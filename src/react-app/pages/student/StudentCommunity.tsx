import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@getmocha/users-service/react";
import {
  MessageCircle,
  Heart,
  CheckCircle2,
  ArrowLeft,
  Send,
  Plus,
  X,
  Stethoscope,
  FileText,
  Lightbulb,
  Coffee,
  ChevronRight,
  User,
  MoreVertical,
  Pencil,
  Trash2,
  Users
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";

interface Post {
  id: number;
  user_id: string;
  user_name: string;
  category: string;
  title: string;
  content: string;
  solution_comment_id: number | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  user_name: string;
  content: string;
  is_solution: number;
  likes_count: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  gradient: string;
}

const categories: Category[] = [
  { id: "duvidas", name: "Dúvidas Clínicas", icon: <Stethoscope className="w-4 h-4" />, gradient: "from-teal-500 to-emerald-500" },
  { id: "casos", name: "Discussão de Casos", icon: <FileText className="w-4 h-4" />, gradient: "from-violet-500 to-purple-500" },
  { id: "sugestoes", name: "Sugestões", icon: <Lightbulb className="w-4 h-4" />, gradient: "from-amber-500 to-orange-500" },
  { id: "estagio", name: "Vida de Estágio", icon: <Coffee className="w-4 h-4" />, gradient: "from-rose-500 to-pink-500" }
];

interface Props {
  onBack: () => void;
}

export default function StudentCommunity({ onBack }: Props) {
  const { user, redirectToLogin } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [likedComments, setLikedComments] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit/Delete state
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{type: 'post' | 'comment', id: number} | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  // New post form
  const [newPostCategory, setNewPostCategory] = useState("duvidas");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    fetchPosts();
    fetchLikes();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === "all" 
        ? "/api/student/community/posts"
        : `/api/student/community/posts?category=${selectedCategory}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error("Error fetching posts:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async () => {
    try {
      const res = await fetch("/api/student/community/likes", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setLikedPosts(data.post_ids || []);
        setLikedComments(data.comment_ids || []);
      }
    } catch (e) {
      // Ignore
    }
  };

  const fetchPostDetails = async (postId: number) => {
    try {
      const res = await fetch(`/api/student/community/posts/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedPost(data.post);
        setComments(data.comments || []);
      }
    } catch (e) {
      console.error("Error fetching post:", e);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      localStorage.setItem("loginMode", "student");
      redirectToLogin();
      return;
    }
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/student/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          category: newPostCategory,
          title: newPostTitle.trim(),
          content: newPostContent.trim()
        })
      });
      if (res.ok) {
        setShowNewPost(false);
        setNewPostTitle("");
        setNewPostContent("");
        fetchPosts();
      }
    } catch (e) {
      console.error("Error creating post:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      localStorage.setItem("loginMode", "student");
      redirectToLogin();
      return;
    }
    if (!selectedPost || !newComment.trim()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/student/community/posts/${selectedPost.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newComment.trim() })
      });
      if (res.ok) {
        setNewComment("");
        fetchPostDetails(selectedPost.id);
      }
    } catch (e) {
      console.error("Error adding comment:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async () => {
    if (!editingComment || !editContent.trim()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/student/community/comments/${editingComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: editContent.trim() })
      });
      if (res.ok && selectedPost) {
        setEditingComment(null);
        setEditContent("");
        fetchPostDetails(selectedPost.id);
      }
    } catch (e) {
      console.error("Error editing comment:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const res = await fetch(`/api/student/community/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok && selectedPost) {
        setShowDeleteConfirm(null);
        fetchPostDetails(selectedPost.id);
      }
    } catch (e) {
      console.error("Error deleting comment:", e);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const res = await fetch(`/api/student/community/posts/${postId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        setShowDeleteConfirm(null);
        setSelectedPost(null);
        fetchPosts();
      }
    } catch (e) {
      console.error("Error deleting post:", e);
    }
  };

  const handleLikePost = async (postId: number) => {
    if (!user) {
      localStorage.setItem("loginMode", "student");
      redirectToLogin();
      return;
    }
    try {
      const res = await fetch(`/api/student/community/posts/${postId}/like`, {
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.liked) {
          setLikedPosts([...likedPosts, postId]);
        } else {
          setLikedPosts(likedPosts.filter(id => id !== postId));
        }
        fetchPosts();
        if (selectedPost?.id === postId) {
          fetchPostDetails(postId);
        }
      }
    } catch (e) {
      console.error("Error liking post:", e);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!user) {
      localStorage.setItem("loginMode", "student");
      redirectToLogin();
      return;
    }
    try {
      const res = await fetch(`/api/student/community/comments/${commentId}/like`, {
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.liked) {
          setLikedComments([...likedComments, commentId]);
        } else {
          setLikedComments(likedComments.filter(id => id !== commentId));
        }
        if (selectedPost) {
          fetchPostDetails(selectedPost.id);
        }
      }
    } catch (e) {
      console.error("Error liking comment:", e);
    }
  };

  const handleMarkSolution = async (commentId: number) => {
    if (!user || !selectedPost || selectedPost.user_id !== user.id) return;
    
    try {
      const res = await fetch(`/api/student/community/comments/${commentId}/solution`, {
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        fetchPostDetails(selectedPost.id);
      }
    } catch (e) {
      console.error("Error marking solution:", e);
    }
  };

  const getCategoryInfo = (catId: string) => {
    return categories.find(c => c.id === catId) || categories[0];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("pt-BR");
  };

  const getAvatarGradient = (name: string) => {
    const gradients = [
      "from-teal-400 to-emerald-500",
      "from-violet-400 to-purple-500",
      "from-rose-400 to-pink-500",
      "from-amber-400 to-orange-500",
      "from-blue-400 to-indigo-500",
      "from-cyan-400 to-teal-500"
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  // Post Detail View
  if (selectedPost) {
    const cat = getCategoryInfo(selectedPost.category);
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            <button 
              onClick={() => setSelectedPost(null)}
              className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${cat.gradient} text-white text-sm font-medium flex items-center gap-1.5`}>
              {cat.icon}
              {cat.name}
            </div>
            {user && selectedPost.user_id === user.id && (
              <button
                onClick={() => setShowDeleteConfirm({ type: 'post', id: selectedPost.id })}
                className="ml-auto w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Post Content */}
        <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarGradient(selectedPost.user_name)} flex items-center justify-center text-white font-semibold text-lg shadow-lg`}>
                {selectedPost.user_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{selectedPost.user_name}</p>
                <p className="text-sm text-slate-500">{formatDate(selectedPost.created_at)}</p>
              </div>
              {selectedPost.solution_comment_id && (
                <div className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-600 text-sm font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Resolvido
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-3">{selectedPost.title}</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
            
            <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleLikePost(selectedPost.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  likedPosts.includes(selectedPost.id) 
                    ? "bg-rose-100 text-rose-500" 
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <Heart className={`w-5 h-5 ${likedPosts.includes(selectedPost.id) ? "fill-current" : ""}`} />
                <span className="font-medium">{selectedPost.likes_count}</span>
              </button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-500">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{comments.length}</span>
              </div>
            </div>
          </motion.div>

          {/* Comments Section */}
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-teal-500" />
            <h3 className="text-lg font-semibold text-slate-900">Respostas</h3>
            <span className="text-slate-400">({comments.length})</span>
          </div>

          <div className="space-y-3">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl border p-4 relative shadow-sm ${
                  comment.is_solution 
                    ? "border-emerald-300 ring-1 ring-emerald-200" 
                    : "border-slate-200"
                }`}
              >
                {comment.is_solution && (
                  <div className="absolute -top-2 left-4 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Solução
                  </div>
                )}
                
                {editingComment?.id === comment.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleEditComment}
                        disabled={submitting || !editContent.trim()}
                        className="bg-teal-500 hover:bg-teal-600"
                      >
                        Salvar
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => { setEditingComment(null); setEditContent(""); }}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getAvatarGradient(comment.user_name)} flex items-center justify-center text-white font-medium text-sm shadow-lg shrink-0`}>
                        {comment.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-900">{comment.user_name}</span>
                          <span className="text-xs text-slate-400">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-slate-600 mt-2 whitespace-pre-wrap">{comment.content}</p>
                        
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className={`flex items-center gap-1.5 text-sm transition-colors ${
                              likedComments.includes(comment.id) 
                                ? "text-rose-500" 
                                : "text-slate-400 hover:text-rose-500"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${likedComments.includes(comment.id) ? "fill-current" : ""}`} />
                            {comment.likes_count}
                          </button>
                          {user && selectedPost.user_id === user.id && !comment.is_solution && (
                            <button
                              onClick={() => handleMarkSolution(comment.id)}
                              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-500 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Marcar solução
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {user && comment.user_id === user.id && (
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === comment.id ? null : comment.id)}
                            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          <AnimatePresence>
                            {activeMenu === comment.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-10 w-36 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-10"
                              >
                                <button
                                  onClick={() => {
                                    setEditingComment(comment);
                                    setEditContent(comment.content);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => {
                                    setShowDeleteConfirm({ type: 'comment', id: comment.id });
                                    setActiveMenu(null);
                                  }}
                                  className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Excluir
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
            
            {comments.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">Nenhuma resposta ainda</p>
                <p className="text-slate-400 text-sm mt-1">Seja o primeiro a responder!</p>
              </div>
            )}
          </div>
        </div>

        {/* Comment Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4">
          <div className="max-w-2xl mx-auto flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "Escreva sua resposta..." : "Faça login para responder"}
              disabled={!user}
              className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAddComment()}
            />
            <Button
              onClick={handleAddComment}
              disabled={submitting || !newComment.trim() || !user}
              className="px-5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-xl"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 text-center mb-2">
                  Excluir {showDeleteConfirm.type === 'post' ? 'publicação' : 'comentário'}?
                </h3>
                <p className="text-slate-500 text-center text-sm mb-6">
                  Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-rose-500 hover:bg-rose-600"
                    onClick={() => {
                      if (showDeleteConfirm.type === 'post') {
                        handleDeletePost(showDeleteConfirm.id);
                      } else {
                        handleDeleteComment(showDeleteConfirm.id);
                      }
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Main Posts List View
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Comunidade</h1>
              <p className="text-xs text-slate-500">Conecte-se com outros estudantes</p>
            </div>
          </div>
          
          {user ? (
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarGradient(user.google_user_data?.name || user.email)} flex items-center justify-center text-white font-medium shadow-lg`}>
              {(user.google_user_data?.name || user.email).charAt(0).toUpperCase()}
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                localStorage.setItem("loginMode", "student");
                redirectToLogin();
              }}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl"
            >
              <User className="w-4 h-4 mr-1.5" />
              Entrar
            </Button>
          )}
        </div>
      </header>

      {/* Hero Banner */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600 p-6 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Comunidade RehabRoad
              </h2>
              <p className="text-sm text-white/80">Discussões clínicas entre estudantes e profissionais</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-2xl mx-auto px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 pr-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-lg"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg`
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100" />
                  <div className="flex-1">
                    <div className="h-4 w-28 bg-slate-100 rounded mb-2" />
                    <div className="h-3 w-16 bg-slate-50 rounded" />
                  </div>
                </div>
                <div className="h-5 w-3/4 bg-slate-100 rounded mb-2" />
                <div className="h-4 w-full bg-slate-50 rounded" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhuma publicação ainda</h3>
            <p className="text-slate-500">Seja o primeiro a iniciar uma discussão!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => {
              const cat = getCategoryInfo(post.category);
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => fetchPostDetails(post.id)}
                  className="bg-white rounded-2xl border border-slate-200 p-5 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarGradient(post.user_name)} flex items-center justify-center text-white font-semibold shadow-lg shrink-0`}>
                      {post.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium text-slate-900">{post.user_name}</span>
                        <span className="text-xs text-slate-400">· {formatDate(post.created_at)}</span>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${cat.gradient} text-white text-xs font-medium mb-2`}>
                        {cat.icon}
                        {cat.name}
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{post.content}</p>
                      
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikePost(post.id);
                          }}
                          className={`flex items-center gap-1.5 text-sm transition-colors ${
                            likedPosts.includes(post.id) 
                              ? "text-rose-500" 
                              : "text-slate-400 hover:text-rose-500"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedPosts.includes(post.id) ? "fill-current" : ""}`} />
                          {post.likes_count}
                        </button>
                        <span className="flex items-center gap-1.5 text-sm text-slate-400">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments_count}
                        </span>
                        {post.solution_comment_id && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Resolvido
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-slate-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Post FAB */}
      <button
        onClick={() => setShowNewPost(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-xl shadow-teal-500/30 flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center"
            onClick={() => setShowNewPost(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full sm:w-[480px] sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-auto border-t border-slate-200 sm:border sm:border-slate-200 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-5 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Nova Publicação</h2>
                <button onClick={() => setShowNewPost(false)} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5 space-y-5">
                {/* Category Select */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Categoria</label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setNewPostCategory(cat.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          newPostCategory === cat.id
                            ? "border-teal-500 bg-teal-50"
                            : "border-slate-200 hover:border-slate-300 bg-slate-50"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white mb-2 shadow-lg`}>
                          {cat.icon}
                        </div>
                        <p className="text-sm font-medium text-slate-900">{cat.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Ex: Dúvida sobre manobra de Phalen"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    maxLength={150}
                  />
                  <p className="text-xs text-slate-400 mt-1.5 text-right">{newPostTitle.length}/150</p>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Descrição</label>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Descreva sua dúvida ou inicie a discussão..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    maxLength={2000}
                  />
                  <p className="text-xs text-slate-400 mt-1.5 text-right">{newPostContent.length}/2000</p>
                </div>

                {/* Submit */}
                <Button
                  onClick={handleCreatePost}
                  disabled={submitting || !newPostTitle.trim() || !newPostContent.trim()}
                  className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-xl"
                >
                  {submitting ? "Publicando..." : "Publicar"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
