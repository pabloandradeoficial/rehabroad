import { Hono } from "hono";
import { authMiddleware, isOwnerAdminEmail, getInsertedId, type AppUser } from "../lib/helpers";

export const forumRouter = new Hono<{ Bindings: Env }>();

// Get all forum posts
forumRouter.get("/posts", authMiddleware, async (c) => {
  const category = c.req.query("category");

  let query = `SELECT * FROM forum_posts`;
  const params: string[] = [];

  if (category && category !== "all") {
    query += ` WHERE category = ?`;
    params.push(category);
  }

  query += ` ORDER BY COALESCE(is_pinned, 0) DESC, created_at DESC`;

  const stmt = params.length > 0
    ? c.env.DB.prepare(query).bind(...params)
    : c.env.DB.prepare(query);

  const { results } = await stmt.all();
  return c.json(results || []);
});

// Create forum post
forumRouter.post("/posts", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string; email: string; name?: string };
  const body = await c.req.json();

  const { category, title, content } = body;

  if (!category || !title || !content) {
    return c.json({ error: "Category, title and content are required" }, 400);
  }

  const userName = user.name || user.email.split("@")[0];

  const result = await c.env.DB.prepare(`
    INSERT INTO forum_posts (user_id, user_name, category, title, content)
    VALUES (?, ?, ?, ?, ?)
  `).bind(user.id, userName, category, title, content).run();

  const newId = getInsertedId(result);

  const newPost = await c.env.DB.prepare(
    `SELECT * FROM forum_posts WHERE id = ?`
  ).bind(newId).first();

  return c.json({ post: newPost, success: true });
});

// Get single post with comments
forumRouter.get("/posts/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");

  const post = await c.env.DB.prepare(`
    SELECT * FROM forum_posts WHERE id = ?
  `).bind(id).first();

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  const { results: comments } = await c.env.DB.prepare(`
    SELECT * FROM forum_comments WHERE post_id = ? ORDER BY created_at ASC
  `).bind(id).all();

  return c.json({ post, comments: comments || [] });
});

// Add comment to post
forumRouter.post("/posts/:id/comments", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string; email: string; name?: string };
  const postId = c.req.param("id");
  const body = await c.req.json();

  const { content } = body;

  if (!content) {
    return c.json({ error: "Content is required" }, 400);
  }

  const userName = user.name || user.email.split("@")[0];

  await c.env.DB.prepare(`
    INSERT INTO forum_comments (post_id, user_id, user_name, content)
    VALUES (?, ?, ?, ?)
  `).bind(postId, user.id, userName, content).run();

  await c.env.DB.prepare(`
    UPDATE forum_posts SET comments_count = comments_count + 1 WHERE id = ?
  `).bind(postId).run();

  return c.json({ success: true });
});

// Like/unlike post
forumRouter.post("/posts/:id/like", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const postId = c.req.param("id");

  const existing = await c.env.DB.prepare(`
    SELECT id FROM forum_likes WHERE user_id = ? AND post_id = ?
  `).bind(user.id, postId).first();

  if (existing) {
    await c.env.DB.prepare(`
      DELETE FROM forum_likes WHERE user_id = ? AND post_id = ?
    `).bind(user.id, postId).run();

    await c.env.DB.prepare(`
      UPDATE forum_posts SET likes_count = likes_count - 1 WHERE id = ?
    `).bind(postId).run();

    return c.json({ liked: false });
  } else {
    await c.env.DB.prepare(`
      INSERT INTO forum_likes (user_id, post_id) VALUES (?, ?)
    `).bind(user.id, postId).run();

    await c.env.DB.prepare(`
      UPDATE forum_posts SET likes_count = likes_count + 1 WHERE id = ?
    `).bind(postId).run();

    return c.json({ liked: true });
  }
});

// Delete post (author or admin only)
forumRouter.delete("/posts/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as AppUser;
  const id = c.req.param("id");

  const post = await c.env.DB.prepare(`
    SELECT user_id FROM forum_posts WHERE id = ?
  `).bind(id).first() as { user_id: string } | null;

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  const isOwner = post.user_id === user.id;
  const isAdmin = isOwnerAdminEmail(user.email);

  if (!isOwner && !isAdmin) {
    console.error(`[forum delete] unauthorized: post.user_id=${post.user_id} user.id=${user.id} user.email=${user.email}`);
    return c.json({ error: "Not authorized" }, 403);
  }

  await c.env.DB.prepare(`DELETE FROM forum_comments WHERE post_id = ?`).bind(id).run();
  await c.env.DB.prepare(`DELETE FROM forum_likes WHERE post_id = ?`).bind(id).run();
  await c.env.DB.prepare(`DELETE FROM forum_posts WHERE id = ?`).bind(id).run();

  return c.json({ success: true });
});

// Check if user liked a post
forumRouter.get("/posts/:id/liked", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const postId = c.req.param("id");

  const existing = await c.env.DB.prepare(`
    SELECT id FROM forum_likes WHERE user_id = ? AND post_id = ?
  `).bind(user.id, postId).first();

  return c.json({ liked: !!existing });
});

// Edit post (author only)
forumRouter.put("/posts/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const id = c.req.param("id");
  const { title, content, category } = await c.req.json();

  const post = await c.env.DB.prepare(`
    SELECT user_id FROM forum_posts WHERE id = ?
  `).bind(id).first() as { user_id: string } | null;

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  if (post.user_id !== user.id) {
    return c.json({ error: "Not authorized" }, 403);
  }

  await c.env.DB.prepare(`
    UPDATE forum_posts SET title = ?, content = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).bind(title, content, category, id).run();

  const updatedPost = await c.env.DB.prepare(
    `SELECT * FROM forum_posts WHERE id = ?`
  ).bind(id).first();

  return c.json({ post: updatedPost, success: true });
});

// Edit comment (author only)
forumRouter.put("/comments/:id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const id = c.req.param("id");
  const { content } = await c.req.json();

  const comment = await c.env.DB.prepare(`
    SELECT user_id FROM forum_comments WHERE id = ?
  `).bind(id).first() as { user_id: string } | null;

  if (!comment) {
    return c.json({ error: "Comment not found" }, 404);
  }

  if (comment.user_id !== user.id) {
    return c.json({ error: "Not authorized" }, 403);
  }

  await c.env.DB.prepare(`
    UPDATE forum_comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).bind(content, id).run();

  return c.json({ success: true });
});
