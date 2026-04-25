import { useState, useEffect, useCallback } from "react";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import { Spinner } from "@/react-app/components/ui/microinteractions";
import { MobileHeader } from "@/react-app/components/layout/MobileHeader";
import { useToast } from "@/react-app/components/ui/microinteractions";
import { apiFetch } from "@/react-app/lib/api";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/react-app/components/ui/dialog";
import {
  MessageCircle,
  Heart,
  Plus,
  Search,
  Users,
  Sparkles,
  Stethoscope,
  Zap,
  HelpCircle,
  Clock,
  Send,
  Trash2,
  ArrowLeft,
  Pin,
  Pencil,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFocusFirstInput } from "@/react-app/hooks/useFocusFirstInput";

interface ForumPost {
  id: number;
  user_id: string;
  user_name: string;
  category: string;
  title: string;
  content: string;
  is_pinned: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface ForumComment {
  id: number;
  post_id: number;
  user_id: string;
  user_name: string;
  content: string;
  likes_count: number;
  created_at: string;
}

const CATEGORIES = [
  { id: "all", label: "Todos", icon: Sparkles, color: "from-violet-500 to-purple-600" },
  { id: "casos", label: "Casos Clínicos", icon: Stethoscope, color: "from-emerald-500 to-teal-600" },
  { id: "eletroterapia", label: "Eletroterapia", icon: Zap, color: "from-amber-500 to-orange-600" },
  { id: "tecnicas", label: "Técnicas Manuais", icon: Users, color: "from-blue-500 to-indigo-600" },
  { id: "duvidas", label: "Dúvidas Gerais", icon: HelpCircle, color: "from-pink-500 to-rose-600" },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "agora";
  if (diffMins < 60) return `${diffMins}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;
  return date.toLocaleDateString("pt-BR");
}

function getCategoryInfo(categoryId: string) {
  return CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[1];
}

export default function Forum() {
  const { user } = useAppAuth();
  const toast = useToast();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const focusPostFormRef = useFocusFirstInput(showNewPost);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null);
  const [editingComment, setEditingComment] = useState<ForumComment | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [newPostForm, setNewPostForm] = useState({
    category: "casos",
    title: "",
    content: "",
  });

  // Memoized fetchPosts so handleCreatePost always gets a fresh reference
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const url =
        selectedCategory === "all"
          ? "/api/forum/posts"
          : `/api/forum/posts?category=${selectedCategory}`;
      const res = await apiFetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as ForumPost[];
        setPosts(Array.isArray(data) ? data : []);
      } else {
        toast.showError("Erro ao carregar posts do fórum.");
      }
    } catch {
      toast.showError("Erro ao carregar posts do fórum.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, toast]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  async function handleCreatePost() {
    if (!newPostForm.title.trim() || newPostForm.title.trim().length < 5 || !newPostForm.content.trim()) {
      toast.showError("Preencha título e conteúdo");
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiFetch("/api/forum/posts", {
        method: "POST",
        body: JSON.stringify(newPostForm),
      });

      if (res.ok) {
        const data = await res.json() as { post: ForumPost; success: boolean };

        if (data.post) {
          // Add the new post directly from the server response — no re-fetch needed.
          // This avoids D1 eventual-consistency issues where a GET right after INSERT
          // might hit a replica that hasn't synced the write yet.
          // We do NOT call setSelectedCategory("all") because it would trigger a
          // refetch that could overwrite this optimistic state with stale D1 data.
          // The client-side category filter in filteredPosts handles the display.
          setPosts((prev) => {
            const alreadyExists = prev.some((p) => p.id === data.post.id);
            if (alreadyExists) return prev;
            return [data.post, ...prev];
          });
        } else {
          // Fallback: server didn't return the post object, do a full refetch
          await fetchPosts();
        }

        toast.showSuccess("Post publicado com sucesso!");
        setShowNewPost(false);
        setNewPostForm({ category: "casos", title: "", content: "" });
      } else {
        const errData = await res.json().catch(() => ({})) as { error?: string };
        toast.showError(errData.error ?? "Erro ao publicar");
      }
    } catch {
      toast.showError("Erro ao publicar");
    } finally {
      setSubmitting(false);
    }
  }

  async function openPost(post: ForumPost) {
    setSelectedPost(post);
    setLoadingComments(true);
    setComments([]);
    setNewComment("");
    setEditingComment(null);

    try {
      const [postRes, likedRes] = await Promise.all([
        apiFetch(`/api/forum/posts/${post.id}`, { cache: "no-store" }),
        apiFetch(`/api/forum/posts/${post.id}/liked`, { cache: "no-store" }),
      ]);

      if (postRes.ok) {
        const data = await postRes.json() as { post: ForumPost; comments: ForumComment[] };
        setComments(data.comments ?? []);
      }

      if (likedRes.ok) {
        const data = await likedRes.json() as { liked: boolean };
        if (data.liked) {
          setLikedPosts((prev) => new Set([...prev, post.id]));
        }
      }
    } catch {
      toast.showError("Erro ao carregar comentários.");
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleAddComment() {
    if (!newComment.trim() || !selectedPost) return;

    try {
      setSubmitting(true);
      const res = await apiFetch(`/api/forum/posts/${selectedPost.id}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        setNewComment("");
        // Refresh comments from server
        const postRes = await apiFetch(`/api/forum/posts/${selectedPost.id}`, { cache: "no-store" });
        if (postRes.ok) {
          const data = await postRes.json() as { post: ForumPost; comments: ForumComment[] };
          setComments(data.comments ?? []);
          setSelectedPost((prev) =>
            prev ? { ...prev, comments_count: prev.comments_count + 1 } : prev
          );
        }
        setPosts((prev) =>
          prev.map((p) =>
            p.id === selectedPost.id
              ? { ...p, comments_count: p.comments_count + 1 }
              : p
          )
        );
      } else {
        toast.showError("Erro ao comentar");
      }
    } catch {
      toast.showError("Erro ao comentar");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLikePost(postId: number) {
    const wasLiked = likedPosts.has(postId);
    const delta = wasLiked ? -1 : 1;

    // ── Optimistic update: toggle immediately ──
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (wasLiked) next.delete(postId);
      else next.add(postId);
      return next;
    });
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes_count: p.likes_count + delta } : p))
    );
    setSelectedPost((prev) =>
      prev?.id === postId ? { ...prev, likes_count: prev.likes_count + delta } : prev
    );

    try {
      const res = await apiFetch(`/api/forum/posts/${postId}/like`, { method: "POST" });

      if (!res.ok) {
        // API falhou — reverte o estado otimista
        setLikedPosts((prev) => {
          const next = new Set(prev);
          if (wasLiked) next.add(postId);
          else next.delete(postId);
          return next;
        });
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes_count: p.likes_count - delta } : p))
        );
        setSelectedPost((prev) =>
          prev?.id === postId ? { ...prev, likes_count: prev.likes_count - delta } : prev
        );
        toast.showError("Erro ao curtir. Tente novamente.");
      }
      // Se ok: o estado otimista já está correto — não faz mais nada
    } catch {
      // Reverte em caso de exceção de rede
      setLikedPosts((prev) => {
        const next = new Set(prev);
        if (wasLiked) next.add(postId);
        else next.delete(postId);
        return next;
      });
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes_count: p.likes_count - delta } : p))
      );
      setSelectedPost((prev) =>
        prev?.id === postId ? { ...prev, likes_count: prev.likes_count - delta } : prev
      );
      toast.showError("Erro ao curtir. Tente novamente.");
    }
  }

  async function handleDeletePost(postId: number) {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;

    try {
      const res = await apiFetch(`/api/forum/posts/${postId}`, { method: "DELETE" });

      if (res.ok) {
        toast.showSuccess("Post excluído");
        setSelectedPost(null);
        // Remove only this post from the local array — without a full fetchPosts.
        // fetchPosts has D1 eventual-consistency issues that can return a stale empty
        // list right after a DELETE, wiping all posts from the UI.
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        const errBody = await res.json().catch(() => ({})) as Record<string, string>;
        toast.showError(`Erro ao excluir (${res.status}): ${errBody?.error ?? "tente novamente"}`);
      }
    } catch {
      toast.showError("Erro ao excluir");
    }
  }

  async function handleEditPost() {
    if (!editingPost || !newPostForm.title.trim() || !newPostForm.content.trim()) {
      toast.showError("Preencha título e conteúdo");
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiFetch(`/api/forum/posts/${editingPost.id}`, {
        method: "PUT",
        body: JSON.stringify(newPostForm),
      });

      if (res.ok) {
        toast.showSuccess("Post atualizado!");
        // Local update — avoids D1 eventual-consistency issues on immediate refetch
        const updated = { title: newPostForm.title, content: newPostForm.content, category: newPostForm.category };
        setPosts((prev) =>
          prev.map((p) => (p.id === editingPost.id ? { ...p, ...updated } : p))
        );
        setSelectedPost((prev) =>
          prev?.id === editingPost.id ? { ...prev, ...updated } : prev
        );
        setEditingPost(null);
        setShowNewPost(false);
        setNewPostForm({ category: "casos", title: "", content: "" });
      } else {
        toast.showError("Erro ao atualizar");
      }
    } catch {
      toast.showError("Erro ao atualizar");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEditComment() {
    if (!editingComment || !editCommentContent.trim()) return;

    try {
      setSubmitting(true);
      const res = await apiFetch(`/api/forum/comments/${editingComment.id}`, {
        method: "PUT",
        body: JSON.stringify({ content: editCommentContent }),
      });

      if (res.ok) {
        toast.showSuccess("Comentário atualizado!");
        setEditingComment(null);
        setEditCommentContent("");
        if (selectedPost) {
          const postRes = await apiFetch(`/api/forum/posts/${selectedPost.id}`, { cache: "no-store" });
          if (postRes.ok) {
            const data = await postRes.json() as { post: ForumPost; comments: ForumComment[] };
            setComments(data.comments ?? []);
          }
        }
      } else {
        toast.showError("Erro ao atualizar comentário");
      }
    } catch {
      toast.showError("Erro ao atualizar");
    } finally {
      setSubmitting(false);
    }
  }

  function startEditPost(post: ForumPost) {
    setEditingPost(post);
    setNewPostForm({ category: post.category, title: post.title, content: post.content });
    setShowNewPost(true);
  }

  function startEditComment(comment: ForumComment) {
    setEditingComment(comment);
    setEditCommentContent(comment.content);
  }

  // Dual filtering: category (client-side safety net on top of the API param)
  // and free-text search. The API already filters by category, but client-side
  // filtering ensures correctness when the posts array contains mixed categories
  // (e.g. after an optimistic update from a different category view).
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="md:hidden">
        <MobileHeader
          actions={
            <button
              onClick={() => setShowNewPost(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-violet-600 text-white active:bg-violet-700"
              aria-label="Nova discussão"
            >
              <Plus size={18} />
            </button>
          }
        />
      </div>
      <>
      <div className="space-y-5">
        {/* ── Standardized Header — hidden on mobile (MobileHeader takes over) ── */}
        <div className="hidden md:block relative rounded-2xl bg-card border border-border shadow-sm overflow-hidden p-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="hidden sm:block">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Comunidade</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Conecte-se com fisioterapeutas de todo o Brasil
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowNewPost(true)}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 text-white font-semibold w-full sm:w-auto shadow-lg shadow-violet-500/25"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Discussão
            </Button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar discussões..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* ── Mobile Search (visible only when hero header is hidden) ── */}
        <div className="md:hidden relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar discussões..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            inputMode="search"
          />
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium border ${
                  isSelected
                    ? `bg-gradient-to-r ${cat.color} text-white border-transparent shadow-md`
                    : "bg-card border-border hover:bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── Posts List ── */}
        {loading ? (
          /* Skeleton loading */
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border rounded-xl p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />
                  <div className="flex-1 space-y-2.5">
                    <div className="flex gap-2">
                      <div className="h-5 bg-muted rounded-full w-24" />
                      <div className="h-5 bg-muted rounded w-20" />
                    </div>
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                    <div className="flex gap-4 pt-1">
                      <div className="h-3 bg-muted rounded w-12" />
                      <div className="h-3 bg-muted rounded w-12" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-card border rounded-2xl">
            <div className="w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-10 w-10 text-violet-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {searchQuery ? "Nenhuma discussão encontrada" : "Nenhuma discussão ainda"}
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              {searchQuery
                ? "Tente uma busca diferente ou explore outras categorias"
                : "Seja o primeiro a iniciar uma conversa! Use o botão \"Nova Discussão\" acima."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredPosts.map((post, index) => {
                const catInfo = getCategoryInfo(post.category);
                const CatIcon = catInfo.icon;
                const isLiked = likedPosts.has(post.id);
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                    onClick={() => void openPost(post)}
                    className="bg-card border rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700 transition-all group active:scale-[0.98] active:opacity-80 select-none"
                  >
                    <div className="flex gap-4">
                      {/* Author avatar */}
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${catInfo.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}
                      >
                        {getInitials(post.user_name)}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Meta row */}
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          {post.is_pinned === 1 && (
                            <Pin className="h-3 w-3 text-amber-500 flex-shrink-0" />
                          )}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${catInfo.color} text-white`}
                          >
                            <CatIcon className="h-3 w-3" />
                            {catInfo.label}
                          </span>
                          <span className="text-xs font-medium text-foreground">{post.user_name}</span>
                          <span className="text-muted-foreground/50 text-xs">•</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(post.created_at)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-base leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2" title={post.title}>
                          {post.title}
                        </h3>

                        {/* Content preview */}
                        <p className="text-muted-foreground text-sm mt-1.5 line-clamp-2 leading-relaxed">
                          {post.content}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center gap-4 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleLikePost(post.id);
                            }}
                            className={`flex items-center gap-1.5 text-sm transition-colors ${
                              isLiked
                                ? "text-rose-500"
                                : "text-muted-foreground hover:text-rose-500"
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                            <span>{post.likes_count}</span>
                          </button>
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments_count}</span>
                          </span>
                          <div className="ml-auto flex items-center gap-2">
                            {post.user_id === user?.id && (
                              <button
                                onClick={(e) => { e.stopPropagation(); startEditPost(post); }}
                                className="p-1 rounded text-muted-foreground hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors opacity-0 group-hover:opacity-100"
                                title="Editar post"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <span className="text-xs text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                              Ver discussão →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── New / Edit Post Dialog ── */}
      <Dialog
        open={showNewPost}
        onOpenChange={(open) => {
          setShowNewPost(open);
          if (!open) {
            setEditingPost(null);
            setNewPostForm({ category: "casos", title: "", content: "" });
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingPost ? (
                <Pencil className="h-5 w-5 text-violet-500" />
              ) : (
                <Plus className="h-5 w-5 text-violet-500" />
              )}
              {editingPost ? "Editar Discussão" : "Nova Discussão"}
            </DialogTitle>
          </DialogHeader>

          <div ref={focusPostFormRef} className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Categoria</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
                  const Icon = cat.icon;
                  const isActive = newPostForm.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewPostForm({ ...newPostForm, category: cat.id })}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-sm ${
                        isActive
                          ? `bg-gradient-to-r ${cat.color} text-white border-transparent shadow-sm`
                          : "hover:border-violet-300 dark:hover:border-violet-700 text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Título</label>
              <Input
                placeholder="Ex: Dúvida sobre protocolo de TENS..."
                value={newPostForm.title}
                onChange={(e) => setNewPostForm({ ...newPostForm, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Conteúdo</label>
              <Textarea
                placeholder="Descreva sua dúvida ou caso clínico em detalhes..."
                rows={5}
                value={newPostForm.content}
                onChange={(e) => setNewPostForm({ ...newPostForm, content: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewPost(false);
                  setEditingPost(null);
                  setNewPostForm({ category: "casos", title: "", content: "" });
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={editingPost ? () => void handleEditPost() : () => void handleCreatePost()}
                disabled={submitting || newPostForm.title.trim().length < 5 || !newPostForm.content.trim()}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90"
              >
                {submitting ? (
                  <Spinner size="sm" />
                ) : editingPost ? (
                  "Salvar alterações"
                ) : (
                  "Publicar"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Post Detail Dialog ── */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => { if (!open) setSelectedPost(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
          {selectedPost && (
            <>
              {/* Dialog Header */}
              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 w-fit transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </button>

                {/* Category badge */}
                {(() => {
                  const catInfo = getCategoryInfo(selectedPost.category);
                  const CatIcon = catInfo.icon;
                  return (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${catInfo.color} text-white w-fit mb-2`}>
                      <CatIcon className="h-3 w-3" />
                      {catInfo.label}
                    </span>
                  );
                })()}

                <DialogTitle className="text-xl leading-snug">{selectedPost.title}</DialogTitle>

                <div className="flex items-center gap-3 mt-3">
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${getCategoryInfo(selectedPost.category).color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                  >
                    {getInitials(selectedPost.user_name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedPost.user_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(selectedPost.created_at)}
                    </p>
                  </div>
                  {selectedPost.user_id === user?.id && (
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => startEditPost(selectedPost)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
                        title="Editar post"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => void handleDeletePost(selectedPost.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Excluir post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </DialogHeader>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                {/* Post content */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {selectedPost.content}
                </p>

                {/* Like / comment count */}
                <div className="flex items-center gap-4 py-3 border-y">
                  <button
                    onClick={() => void handleLikePost(selectedPost.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
                      likedPosts.has(selectedPost.id)
                        ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600"
                        : "bg-muted hover:bg-rose-100 dark:hover:bg-rose-900/30 text-muted-foreground hover:text-rose-600"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${likedPosts.has(selectedPost.id) ? "fill-current" : ""}`}
                    />
                    {selectedPost.likes_count} curtida{selectedPost.likes_count !== 1 ? "s" : ""}
                  </button>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    {selectedPost.comments_count} comentário{selectedPost.comments_count !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Comments */}
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">
                    Comentários
                  </h4>
                  {loadingComments ? (
                    <div className="flex justify-center py-8">
                      <Spinner />
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-6 bg-muted/30 rounded-xl">
                      Nenhum comentário ainda. Seja o primeiro!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex gap-3 p-3.5 bg-muted/40 rounded-xl"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {getInitials(comment.user_name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{comment.user_name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(comment.created_at)}
                              </span>
                              {comment.user_id === user?.id && (
                                <button
                                  onClick={() => startEditComment(comment)}
                                  className="ml-auto p-1 rounded text-muted-foreground hover:text-violet-500 transition-colors"
                                  title="Editar comentário"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                            {editingComment?.id === comment.id ? (
                              <div className="mt-2 space-y-2">
                                <Textarea
                                  value={editCommentContent}
                                  onChange={(e) => setEditCommentContent(e.target.value)}
                                  rows={2}
                                  className="text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => void handleEditComment()}
                                    disabled={submitting || !editCommentContent.trim()}
                                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90"
                                  >
                                    {submitting ? <Spinner size="sm" /> : "Salvar"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingComment(null);
                                      setEditCommentContent("");
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm mt-1 whitespace-pre-wrap leading-relaxed">
                                {comment.content}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Comment Input — always visible at bottom */}
              <div className="flex-shrink-0 px-6 py-4 border-t bg-card">
                <div className="flex gap-2">
                  <Input
                    placeholder="Escreva um comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void handleAddComment();
                      }
                    }}
                  />
                  <Button
                    onClick={() => void handleAddComment()}
                    disabled={submitting || !newComment.trim()}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 flex-shrink-0"
                  >
                    {submitting ? <Spinner size="sm" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
    </>
  );
}
