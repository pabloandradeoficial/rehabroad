import { Hono } from "hono";
import { authMiddleware, optionalAuthMiddleware, getInsertedId } from "../lib/helpers";

export const studentRouter = new Hono<{ Bindings: Env }>();

// ============================================
// STUDENT PROGRESS
// ============================================

studentRouter.get("/progress", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ loggedIn: false, progress: null }, 200);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM student_progress WHERE user_id = ?"
  ).bind(user.id).all();

  if (results.length === 0) {
    await c.env.DB.prepare(`
      INSERT INTO student_progress (user_id, user_email, user_name, modules_visited)
      VALUES (?, ?, ?, ?)
    `).bind(
      user.id,
      user.email,
      user.google_user_data?.name || user.email,
      "[]"
    ).run();

    return c.json({
      loggedIn: true,
      user: { id: user.id, email: user.email, name: user.google_user_data?.name },
      progress: {
        cases_completed: 0,
        cases_correct: 0,
        modules_visited: [],
        last_module: null,
        total_time_minutes: 0,
        xp: 0,
        streak: 0,
        last_streak_date: null,
        daily_challenge_date: null,
        daily_challenge_case_id: null,
        avatar_url: null
      }
    }, 200);
  }

  const progress = results[0] as any;
  return c.json({
    loggedIn: true,
    user: { id: user.id, email: user.email, name: user.google_user_data?.name },
    progress: {
      ...progress,
      modules_visited: (() => { try { return JSON.parse(progress.modules_visited || "[]"); } catch { return []; } })()
    }
  }, 200);
});

studentRouter.post("/progress", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Not logged in" }, 401);
  }

  const body = await c.req.json();
  const { cases_completed, cases_correct, module_visited, time_spent_minutes, daily_completed, xp_earned } = body;

  const today = new Date().toISOString().split('T')[0];

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM student_progress WHERE user_id = ?"
  ).bind(user.id).all();

  if (results.length === 0) {
    const modules = module_visited ? [module_visited] : [];
    const newStreak = daily_completed ? 1 : 0;
    const newXp = xp_earned || 0;

    await c.env.DB.prepare(`
      INSERT INTO student_progress (user_id, user_email, user_name, cases_completed, cases_correct, modules_visited, last_module, total_time_minutes, xp, streak, last_streak_date, daily_challenge_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      user.id,
      user.email,
      user.google_user_data?.name || user.email,
      cases_completed || 0,
      cases_correct || 0,
      JSON.stringify(modules),
      module_visited || null,
      time_spent_minutes || 0,
      newXp,
      newStreak,
      daily_completed ? today : null,
      daily_completed ? today : null
    ).run();
  } else {
    const current = results[0] as any;
    let modulesVisited: string[] = [];
    try { modulesVisited = JSON.parse(current.modules_visited || "[]"); } catch { modulesVisited = []; }

    if (module_visited && !modulesVisited.includes(module_visited)) {
      modulesVisited.push(module_visited);
    }

    const newCasesCompleted = (current.cases_completed || 0) + (cases_completed || 0);
    const newCasesCorrect = (current.cases_correct || 0) + (cases_correct || 0);

    let newStreak = current.streak || 0;
    let newXp = current.xp || 0;

    if (xp_earned && xp_earned > 0) {
      newXp += xp_earned;
    }

    if (daily_completed && current.daily_challenge_date !== today) {
      const lastDate = current.last_streak_date;
      if (lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastDate === yesterdayStr) {
          newStreak = (current.streak || 0) + 1;
        } else if (lastDate === today) {
          newStreak = current.streak || 1;
        } else {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
    }

    await c.env.DB.prepare(`
      UPDATE student_progress
      SET cases_completed = ?,
          cases_correct = ?,
          modules_visited = ?,
          last_module = COALESCE(?, last_module),
          total_time_minutes = total_time_minutes + ?,
          xp = ?,
          streak = ?,
          last_streak_date = CASE WHEN ? = 1 THEN ? ELSE last_streak_date END,
          daily_challenge_date = CASE WHEN ? = 1 THEN ? ELSE daily_challenge_date END,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).bind(
      newCasesCompleted,
      newCasesCorrect,
      JSON.stringify(modulesVisited),
      module_visited,
      time_spent_minutes || 0,
      newXp,
      newStreak,
      daily_completed ? 1 : 0,
      today,
      daily_completed ? 1 : 0,
      today,
      user.id
    ).run();
  }

  return c.json({ success: true }, 200);
});

// Student Ranking
studentRouter.get("/ranking", async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT
      user_id,
      user_name,
      avatar_url,
      xp,
      cases_completed,
      cases_correct,
      streak,
      CASE
        WHEN cases_completed > 0
        THEN ROUND((cases_correct * 100.0 / cases_completed), 0)
        ELSE 0
      END as accuracy
    FROM student_progress
    WHERE cases_completed > 0
    ORDER BY accuracy DESC, cases_completed DESC, cases_correct DESC, xp DESC, streak DESC, user_name ASC
    LIMIT 50
  `).all();

  const ranking = (results || []).map((row: any, index: number) => ({
    rank: index + 1,
    user_id: row.user_id ?? null,
    user_name: row.user_name ?? null,
    avatar_url: row.avatar_url ?? null,
    xp: Number(row.xp ?? 0),
    cases_completed: Number(row.cases_completed ?? 0),
    cases_correct: Number(row.cases_correct ?? 0),
    streak: Number(row.streak ?? 0),
    accuracy: Number(row.accuracy ?? 0),
  }));

  return c.json({ ranking }, 200);
});

// ============================================
// STUDENT AVATAR
// ============================================

studentRouter.post("/avatar", authMiddleware, async (c) => {
  const user = c.get("user");

  const formData = await c.req.formData();
  const file = formData.get("avatar") as File;

  if (!file) {
    return c.json({ error: "No file uploaded" }, 400);
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return c.json({ error: "Invalid file type. Use JPEG, PNG, WebP or GIF." }, 400);
  }

  if (file.size > 2 * 1024 * 1024) {
    return c.json({ error: "File too large. Max 2MB." }, 400);
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const key = `student-avatars/${user!.id}.${ext}`;

  await c.env.R2_BUCKET.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  });

  const avatarUrl = `/api/student/avatar/${user!.id}.${ext}`;

  await c.env.DB.prepare(`
    UPDATE student_progress SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?
  `).bind(avatarUrl, user!.id).run();

  return c.json({ success: true, avatarUrl }, 200);
});

studentRouter.get("/avatar/:filename", async (c) => {
  const filename = c.req.param("filename");
  const key = `student-avatars/${filename}`;

  const object = await c.env.R2_BUCKET.get(key);

  if (!object) {
    return c.json({ error: "Avatar not found" }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=86400");

  return new Response(object.body, { headers });
});

studentRouter.delete("/avatar", authMiddleware, async (c) => {
  const user = c.get("user");

  const { results } = await c.env.DB.prepare(
    "SELECT avatar_url FROM student_progress WHERE user_id = ?"
  ).bind(user!.id).all();

  if (results.length > 0 && results[0].avatar_url) {
    const avatarUrl = results[0].avatar_url as string;
    const filename = avatarUrl.split('/').pop();
    if (filename) {
      await c.env.R2_BUCKET.delete(`student-avatars/${filename}`);
    }
  }

  await c.env.DB.prepare(`
    UPDATE student_progress SET avatar_url = NULL, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?
  `).bind(user!.id).run();

  return c.json({ success: true }, 200);
});

// ============================================
// STUDENT COMMUNITY
// ============================================

studentRouter.get("/community/posts", async (c) => {
  const category = c.req.query("category");

  let query = `
    SELECT p.*,
      (SELECT COUNT(*) FROM student_comments WHERE post_id = p.id) as comments_count
    FROM student_posts p
  `;

  if (category && category !== 'all') {
    query += ` WHERE p.category = ?`;
  }
  query += ` ORDER BY p.created_at DESC LIMIT 100`;

  const stmt = category && category !== 'all'
    ? c.env.DB.prepare(query).bind(category)
    : c.env.DB.prepare(query);

  const { results } = await stmt.all();
  return c.json({ posts: results }, 200);
});

studentRouter.get("/community/posts/:id", async (c) => {
  const postId = c.req.param("id");

  const { results: postResults } = await c.env.DB.prepare(
    "SELECT * FROM student_posts WHERE id = ?"
  ).bind(postId).all();

  if (postResults.length === 0) {
    return c.json({ error: "Post not found" }, 404);
  }

  const { results: comments } = await c.env.DB.prepare(
    "SELECT * FROM student_comments WHERE post_id = ? ORDER BY is_solution DESC, likes_count DESC, created_at ASC"
  ).bind(postId).all();

  return c.json({ post: postResults[0], comments }, 200);
});

studentRouter.post("/community/posts", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }

  const body = await c.req.json();
  const { category, title, content } = body;

  if (!category || !title || !content) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const userName = user.google_user_data?.name || user.email.split('@')[0];

  const result = await c.env.DB.prepare(`
    INSERT INTO student_posts (user_id, user_name, user_email, category, title, content)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(user.id, userName, user.email, category, title, content).run();

  return c.json({ success: true, postId: getInsertedId(result) }, 201);
});

studentRouter.post("/community/posts/:id/comments", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }

  const postId = c.req.param("id");
  const body = await c.req.json();
  const { content } = body;

  if (!content) {
    return c.json({ error: "Content required" }, 400);
  }

  const userName = user.google_user_data?.name || user.email.split('@')[0];

  await c.env.DB.prepare(`
    INSERT INTO student_comments (post_id, user_id, user_name, user_email, content)
    VALUES (?, ?, ?, ?, ?)
  `).bind(postId, user.id, userName, user.email, content).run();

  await c.env.DB.prepare(`
    UPDATE student_posts SET comments_count = comments_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).bind(postId).run();

  return c.json({ success: true }, 201);
});

studentRouter.post("/community/posts/:id/like", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }

  const postId = c.req.param("id");

  const { results: existing } = await c.env.DB.prepare(
    "SELECT id FROM student_likes WHERE user_id = ? AND post_id = ?"
  ).bind(user.id, postId).all();

  if (existing.length > 0) {
    await c.env.DB.prepare("DELETE FROM student_likes WHERE user_id = ? AND post_id = ?").bind(user.id, postId).run();
    await c.env.DB.prepare("UPDATE student_posts SET likes_count = likes_count - 1 WHERE id = ?").bind(postId).run();
    return c.json({ liked: false }, 200);
  } else {
    await c.env.DB.prepare("INSERT INTO student_likes (user_id, post_id) VALUES (?, ?)").bind(user.id, postId).run();
    await c.env.DB.prepare("UPDATE student_posts SET likes_count = likes_count + 1 WHERE id = ?").bind(postId).run();
    return c.json({ liked: true }, 200);
  }
});

studentRouter.post("/community/comments/:id/like", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }

  const commentId = c.req.param("id");

  const { results: existing } = await c.env.DB.prepare(
    "SELECT id FROM student_likes WHERE user_id = ? AND comment_id = ?"
  ).bind(user.id, commentId).all();

  if (existing.length > 0) {
    await c.env.DB.prepare("DELETE FROM student_likes WHERE user_id = ? AND comment_id = ?").bind(user.id, commentId).run();
    await c.env.DB.prepare("UPDATE student_comments SET likes_count = likes_count - 1 WHERE id = ?").bind(commentId).run();
    return c.json({ liked: false }, 200);
  } else {
    await c.env.DB.prepare("INSERT INTO student_likes (user_id, comment_id) VALUES (?, ?)").bind(user.id, commentId).run();
    await c.env.DB.prepare("UPDATE student_comments SET likes_count = likes_count + 1 WHERE id = ?").bind(commentId).run();
    return c.json({ liked: true }, 200);
  }
});

studentRouter.post("/community/comments/:id/solution", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }

  const commentId = c.req.param("id");

  const { results: commentResults } = await c.env.DB.prepare(
    "SELECT c.*, p.user_id as post_author_id FROM student_comments c JOIN student_posts p ON c.post_id = p.id WHERE c.id = ?"
  ).bind(commentId).all();

  if (commentResults.length === 0) {
    return c.json({ error: "Comment not found" }, 404);
  }

  const comment = commentResults[0] as any;

  if (comment.post_author_id !== user.id) {
    return c.json({ error: "Only post author can mark solution" }, 403);
  }

  const newStatus = comment.is_solution ? 0 : 1;

  await c.env.DB.prepare("UPDATE student_comments SET is_solution = 0 WHERE post_id = ?").bind(comment.post_id).run();

  if (newStatus === 1) {
    await c.env.DB.prepare("UPDATE student_comments SET is_solution = 1 WHERE id = ?").bind(commentId).run();
    await c.env.DB.prepare("UPDATE student_posts SET solution_comment_id = ? WHERE id = ?").bind(commentId, comment.post_id).run();
  } else {
    await c.env.DB.prepare("UPDATE student_posts SET solution_comment_id = NULL WHERE id = ?").bind(comment.post_id).run();
  }

  return c.json({ is_solution: newStatus === 1 }, 200);
});

studentRouter.get("/community/likes", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ post_ids: [], comment_ids: [] }, 200);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT post_id, comment_id FROM student_likes WHERE user_id = ?"
  ).bind(user.id).all();

  const post_ids = results.filter((r: any) => r.post_id).map((r: any) => r.post_id);
  const comment_ids = results.filter((r: any) => r.comment_id).map((r: any) => r.comment_id);

  return c.json({ post_ids, comment_ids }, 200);
});

studentRouter.put("/community/comments/:id", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }

  const commentId = c.req.param("id");
  const body = await c.req.json();
  const { content } = body;

  if (!content?.trim()) {
    return c.json({ error: "Content required" }, 400);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT user_id FROM student_comments WHERE id = ?"
  ).bind(commentId).all();

  if (results.length === 0) {
    return c.json({ error: "Comment not found" }, 404);
  }

  if ((results[0] as any).user_id !== user.id) {
    return c.json({ error: "Not authorized" }, 403);
  }

  await c.env.DB.prepare(
    "UPDATE student_comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(content.trim(), commentId).run();

  return c.json({ success: true }, 200);
});

studentRouter.delete("/community/comments/:id", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }

  const commentId = c.req.param("id");

  const { results } = await c.env.DB.prepare(
    "SELECT user_id, post_id, is_solution FROM student_comments WHERE id = ?"
  ).bind(commentId).all();

  if (results.length === 0) {
    return c.json({ error: "Comment not found" }, 404);
  }

  const comment = results[0] as any;

  if (comment.user_id !== user.id) {
    return c.json({ error: "Not authorized" }, 403);
  }

  await c.env.DB.prepare("DELETE FROM student_comments WHERE id = ?").bind(commentId).run();

  await c.env.DB.prepare(
    "UPDATE student_posts SET comments_count = comments_count - 1 WHERE id = ?"
  ).bind(comment.post_id).run();

  if (comment.is_solution) {
    await c.env.DB.prepare(
      "UPDATE student_posts SET solution_comment_id = NULL WHERE id = ?"
    ).bind(comment.post_id).run();
  }

  await c.env.DB.prepare("DELETE FROM student_likes WHERE comment_id = ?").bind(commentId).run();

  return c.json({ success: true }, 200);
});

studentRouter.delete("/community/posts/:id", optionalAuthMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Login required" }, 401);
  }

  const postId = c.req.param("id");

  const { results } = await c.env.DB.prepare(
    "SELECT user_id FROM student_posts WHERE id = ?"
  ).bind(postId).all();

  if (results.length === 0) {
    return c.json({ error: "Post not found" }, 404);
  }

  if ((results[0] as any).user_id !== user.id) {
    return c.json({ error: "Not authorized" }, 403);
  }

  await c.env.DB.prepare("DELETE FROM student_likes WHERE post_id = ?").bind(postId).run();
  await c.env.DB.prepare("DELETE FROM student_likes WHERE comment_id IN (SELECT id FROM student_comments WHERE post_id = ?)").bind(postId).run();
  await c.env.DB.prepare("DELETE FROM student_comments WHERE post_id = ?").bind(postId).run();
  await c.env.DB.prepare("DELETE FROM student_posts WHERE id = ?").bind(postId).run();

  return c.json({ success: true }, 200);
});
