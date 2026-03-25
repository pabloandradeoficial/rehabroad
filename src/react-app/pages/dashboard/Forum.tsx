import { useState, useEffect } from "react";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import { PageTransition, Spinner } from "@/react-app/components/ui/microinteractions";
import { useToast } from "@/react-app/components/ui/microinteractions";
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
  ChevronRight,
  Send,
  Trash2,
  ArrowLeft,
  Pin,
  Pencil,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("pt-BR");
}

function getCategoryInfo(categoryId: string) {
  return CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
}

export default function Forum() {
  const { user } = useAppAuth();
  const toast = useToast();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
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

  useEffect(() => {
    void fetchPosts();
  }, [selectedCategory]);

  async function fetchPosts() {
    try {
      setLoading(true);
      const url =
        selectedCategory === "all"
          ? "/api/forum/posts"
          : `/api/forum/posts?category=${selectedCategory}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePost() {
    if (!newPostForm.title.trim() || !newPostForm.content.trim()) {
      toast.showError("Preencha título e conteúdo");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPostForm),
      });

      if (res.ok) {
        toast.showSuccess("Post publicado!");
        setShowNewPost(false);
        setNewPostForm({ category: "casos", title: "", content: "" });
        await fetchPosts();
      }
    } catch (_err) {
      toast.showError("Erro ao publicar");
    } finally {
      setSubmitting(false);
    }
  }

  async function openPost(post: ForumPost) {
    setSelectedPost(post);
    setLoadingComments(true);
    setComments([]);

    try {
      const [postRes, likedRes] = await Promise.all([
        fetch(`/api/forum/posts/${post.id}`),
        fetch(`/api/forum/posts/${post.id}/liked`),
      ]);

      if (postRes.ok) {
        const data = await postRes.json();
        setComments(data.comments || []);
      }

      if (likedRes.ok) {
        const data = await likedRes.json();
        if (data.liked) {
          setLikedPosts((prev) => new Set([...prev, post.id]));
        }
      }
    } catch (err) {
      console.error("Error loading post:", err);
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleAddComment() {
    if (!newComment.trim() || !selectedPost) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/forum/posts/${selectedPost.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        setNewComment("");
        const postRes = await fetch(`/api/forum/posts/${selectedPost.id}`);
        if (postRes.ok) {
          const data = await postRes.json();
          setComments(data.comments || []);
          setSelectedPost({
            ...selectedPost,
            comments_count: selectedPost.comments_count + 1,
          });
        }
        setPosts((prev) =>
          prev.map((p) =>
            p.id === selectedPost.id
              ? { ...p, comments_count: p.comments_count + 1 }
              : p
          )
        );
      }
    } catch (_err) {
      toast.showError("Erro ao comentar");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLikePost(postId: number) {
    try {
      const res = await fetch(`/api/forum/posts/${postId}/like`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          if (data.liked) {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          return newSet;
        });

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, likes_count: p.likes_count + (data.liked ? 1 : -1) }
              : p
          )
        );

        if (selectedPost?.id === postId) {
          setSelectedPost({
            ...selectedPost,
            likes_count: selectedPost.likes_count + (data.liked ? 1 : -1),
          });
        }
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  }

  async function handleDeletePost(postId: number) {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;

    try {
      const res = await fetch(`/api/forum/posts/${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.showSuccess("Post excluído");
        setSelectedPost(null);
        await fetchPosts();
      }
    } catch (_err) {
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
      const res = await fetch(`/api/forum/posts/${editingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPostForm),
      });

      if (res.ok) {
        toast.showSuccess("Post atualizado!");
        setEditingPost(null);
        setShowNewPost(false);
        setNewPostForm({ category: "casos", title: "", content: "" });
        await fetchPosts();
        if (selectedPost?.id === editingPost.id) {
          setSelectedPost({ ...selectedPost, ...newPostForm });
        }
      }
    } catch (_err) {
      toast.showError("Erro ao atualizar");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEditComment() {
    if (!editingComment || !editCommentContent.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/forum/comments/${editingComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editCommentContent }),
      });

      if (res.ok) {
        toast.showSuccess("Comentário atualizado!");
        setEditingComment(null);
        setEditCommentContent("");
        if (selectedPost) {
          const postRes = await fetch(`/api/forum/posts/${selectedPost.id}`);
          if (postRes.ok) {
            const data = await postRes.json();
            setComments(data.comments || []);
          }
        }
      }
    } catch (_err) {
      toast.showError("Erro ao atualizar");
    } finally {
      setSubmitting(false);
    }
  }

  function startEditPost(post: ForumPost) {
    setEditingPost(post);
    setNewPostForm({
      category: post.category,
      title: post.title,
      content: post.content,
    });
    setShowNewPost(true);
  }

  function startEditComment(comment: ForumComment) {
    setEditingComment(comment);
    setEditCommentContent(comment.content);
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-violet-950/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  Comunidade REHABROAD
                </h1>
                <p className="text-violet-100 mt-2 text-sm sm:text-base">
                  Conecte-se com fisioterapeutas de todo o Brasil
                </p>
              </div>
              <Button
                onClick={() => setShowNewPost(true)}
                className="bg-white text-violet-600 hover:bg-violet-50 font-semibold w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Discussão
              </Button>
            </div>

            {/* Search */}
            <div className="mt-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-300" />
              <Input
                placeholder="Buscar discussões..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-violet-200 focus:bg-white/20"
              />
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-6">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    isSelected
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                      : "bg-card hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-violet-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Nenhuma discussão ainda</h3>
              <p className="text-muted-foreground mb-4">
                Seja o primeiro a iniciar uma conversa!
              </p>
              <Button onClick={() => setShowNewPost(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Discussão
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredPosts.map((post, index) => {
                  const catInfo = getCategoryInfo(post.category);
                  const CatIcon = catInfo.icon;
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => openPost(post)}
                      className="bg-card border rounded-xl p-4 cursor-pointer hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700 transition-all group"
                    >
                      <div className="flex gap-4">
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${catInfo.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                          {getInitials(post.user_name)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {post.is_pinned === 1 && (
                                  <span className="text-amber-500">
                                    <Pin className="h-3 w-3" />
                                  </span>
                                )}
                                <h3 className="font-semibold group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                  {post.title}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <span className="font-medium">{post.user_name}</span>
                                <span>•</span>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${catInfo.color} text-white`}>
                                  <CatIcon className="h-3 w-3" />
                                  {catInfo.label}
                                </span>
                                <span>•</span>
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(post.created_at)}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-violet-500 transition-colors flex-shrink-0" />
                          </div>

                          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                            {post.content}
                          </p>

                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikePost(post.id);
                              }}
                              className={`flex items-center gap-1 transition-colors ${
                                likedPosts.has(post.id)
                                  ? "text-rose-500"
                                  : "text-muted-foreground hover:text-rose-500"
                              }`}
                            >
                              <Heart
                                className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`}
                              />
                              {post.likes_count}
                            </button>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <MessageCircle className="h-4 w-4" />
                              {post.comments_count}
                            </span>
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

        {/* New/Edit Post Dialog */}
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
          <DialogContent className="max-w-lg">
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

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setNewPostForm({ ...newPostForm, category: cat.id })}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                          newPostForm.category === cat.id
                            ? `bg-gradient-to-r ${cat.color} text-white border-transparent`
                            : "hover:border-violet-300 dark:hover:border-violet-700"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Título</label>
                <Input
                  placeholder="Ex: Dúvida sobre protocolo de TENS..."
                  value={newPostForm.title}
                  onChange={(e) => setNewPostForm({ ...newPostForm, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Conteúdo</label>
                <Textarea
                  placeholder="Descreva sua dúvida ou caso clínico..."
                  rows={5}
                  value={newPostForm.content}
                  onChange={(e) => setNewPostForm({ ...newPostForm, content: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  onClick={editingPost ? handleEditPost : handleCreatePost}
                  disabled={submitting}
                  className="bg-gradient-to-r from-violet-600 to-purple-600"
                >
                  {submitting ? <Spinner size="sm" /> : editingPost ? "Salvar" : "Publicar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Post Detail Dialog */}
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            {selectedPost && (
              <>
                <DialogHeader className="flex-shrink-0">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 w-fit"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </button>
                  <DialogTitle className="text-xl">{selectedPost.title}</DialogTitle>
                  <div className="flex items-center gap-3 mt-2">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${getCategoryInfo(selectedPost.category).color} flex items-center justify-center text-white text-xs font-bold`}
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
                          className="text-muted-foreground hover:text-violet-500 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(selectedPost.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-6">
                  {/* Post Content */}
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 py-3 border-y">
                    <button
                      onClick={() => handleLikePost(selectedPost.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        likedPosts.has(selectedPost.id)
                          ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600"
                          : "bg-muted hover:bg-rose-100 dark:hover:bg-rose-900/30 text-muted-foreground hover:text-rose-600"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${likedPosts.has(selectedPost.id) ? "fill-current" : ""}`}
                      />
                      <span className="font-medium">{selectedPost.likes_count}</span>
                    </button>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <MessageCircle className="h-5 w-5" />
                      {selectedPost.comments_count} comentários
                    </span>
                  </div>

                  {/* Comments */}
                  <div>
                    <h4 className="font-semibold mb-4">Comentários</h4>
                    {loadingComments ? (
                      <div className="flex justify-center py-8">
                        <Spinner />
                      </div>
                    ) : comments.length === 0 ? (
                      <p className="text-muted-foreground text-center py-6">
                        Nenhum comentário ainda. Seja o primeiro!
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="flex gap-3 p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {getInitials(comment.user_name)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{comment.user_name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(comment.created_at)}
                                </span>
                                {comment.user_id === user?.id && (
                                  <button
                                    onClick={() => startEditComment(comment)}
                                    className="text-muted-foreground hover:text-violet-500 transition-colors ml-auto"
                                    title="Editar"
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
                                    <Button size="sm" onClick={handleEditComment} disabled={submitting}>
                                      {submitting ? <Spinner size="sm" /> : "Salvar"}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingComment(null)}
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Comment Input */}
                <div className="flex-shrink-0 pt-4 border-t">
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
                      className="bg-gradient-to-r from-violet-600 to-purple-600"
                    >
                      {submitting ? <Spinner size="sm" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}