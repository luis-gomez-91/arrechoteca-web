'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Star, MessageCircle, Send, Loader2, ChevronLeft, Heart, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase';
import { fetchBadWordById, fetchInsultComments } from '@/lib/data/fetchBadWords';
import type { BadWord, InsultCommentType } from '@/types/bad_word';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const apiUrl = () => process.env.NEXT_PUBLIC_API_URL ?? '';

type Props = { insultId: number };

export default function PuteadaDetail({ insultId }: Props) {
  const { user, session } = useAuth();
  const [insult, setInsult] = useState<BadWord | null>(null);
  const [comments, setComments] = useState<InsultCommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [starLoading, setStarLoading] = useState(false);
  const [likeLoadingId, setLikeLoadingId] = useState<number | null>(null);
  const [starCommentLoadingId, setStarCommentLoadingId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [savingCommentId, setSavingCommentId] = useState<number | null>(null);
  const [deleteCommentLoadingId, setDeleteCommentLoadingId] = useState<number | null>(null);

  const token = session?.access_token ?? null;
  const currentUserId = user?.id ?? null;

  const loadData = useCallback(async () => {
    if (!insultId) return;
    setLoading(true);
    setError(null);
    try {
      const [insultData, commentsData] = await Promise.all([
        fetchBadWordById(insultId, token),
        fetchInsultComments(insultId, token),
      ]);
      setInsult(insultData);
      setComments(commentsData);
    } catch (e) {
      console.error(e);
      setError('No se pudo cargar la puteada.');
    } finally {
      setLoading(false);
    }
  }, [insultId, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getAuthHeaders = async () => {
    const { data: { session: s } } = await createClient().auth.getSession();
    const t = s?.access_token;
    if (!t) return null;
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${t}`,
    };
  };

  const handleStarInsult = async () => {
    if (!user || starLoading) return;
    const headers = await getAuthHeaders();
    if (!headers) {
      alert('Inicia sesión para dar estrellita.');
      return;
    }
    setStarLoading(true);
    try {
      const res = await fetch(`${apiUrl()}bad_words/${insultId}/star`, {
        method: 'POST',
        headers,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && insult) {
        setInsult({
          ...insult,
          starred_by_me: data.starred,
          star_count: data.star_count ?? (insult.star_count ?? 0) + (data.starred ? 1 : -1),
        });
      } else if (res.status === 401) {
        alert('Inicia sesión para dar estrellita.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setStarLoading(false);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!user) return;
    const headers = await getAuthHeaders();
    if (!headers) return;
    setLikeLoadingId(commentId);
    try {
      const res = await fetch(`${apiUrl()}bad_words/comments/${commentId}/like`, { method: 'POST', headers });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const update = (list: InsultCommentType[]): InsultCommentType[] =>
          list.map((c) => {
            if (c.id === commentId) return { ...c, liked_by_me: data.liked, likes_count: data.likes_count ?? c.likes_count };
            return { ...c, replies: update(c.replies) };
          });
        setComments(update(comments));
      } else if (res.status === 401) {
        alert('Inicia sesión para dar like.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLikeLoadingId(null);
    }
  };

  const handleStarComment = async (commentId: number) => {
    if (!user) return;
    const headers = await getAuthHeaders();
    if (!headers) return;
    setStarCommentLoadingId(commentId);
    try {
      const res = await fetch(`${apiUrl()}bad_words/comments/${commentId}/star`, { method: 'POST', headers });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const update = (list: InsultCommentType[]): InsultCommentType[] =>
          list.map((c) => {
            if (c.id === commentId) return { ...c, starred_by_me: data.starred, star_count: data.star_count ?? c.star_count };
            return { ...c, replies: update(c.replies) };
          });
        setComments(update(comments));
      } else if (res.status === 401) {
        alert('Inicia sesión para dar estrellita.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setStarCommentLoadingId(null);
    }
  };

  const updateCommentInList = (list: InsultCommentType[], commentId: number, update: Partial<InsultCommentType>): InsultCommentType[] =>
    list.map((c) => {
      if (c.id === commentId) return { ...c, ...update };
      return { ...c, replies: updateCommentInList(c.replies, commentId, update) };
    });

  const removeCommentFromList = (list: InsultCommentType[], commentId: number): InsultCommentType[] =>
    list
      .filter((c) => c.id !== commentId)
      .map((c) => ({ ...c, replies: removeCommentFromList(c.replies, commentId) }));

  const handleEditComment = async (commentId: number, newText: string) => {
    if (!newText.trim()) return;
    const headers = await getAuthHeaders();
    if (!headers) return;
    setSavingCommentId(commentId);
    try {
      const res = await fetch(`${apiUrl()}bad_words/comments/${commentId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ comment: newText.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setComments((prev) => updateCommentInList(prev, commentId, { comment: newText.trim() }));
        setEditingCommentId(null);
      } else {
        alert(typeof data.detail === 'string' ? data.detail : data.detail?.[0]?.msg ?? 'Error al editar.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    } finally {
      setSavingCommentId(null);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('¿Eliminar este comentario?')) return;
    const headers = await getAuthHeaders();
    if (!headers) return;
    setDeleteCommentLoadingId(commentId);
    try {
      const res = await fetch(`${apiUrl()}bad_words/comments/${commentId}`, { method: 'DELETE', headers });
      if (res.ok) {
        setComments((prev) => removeCommentFromList(prev, commentId));
        setEditingCommentId((id) => (id === commentId ? null : id));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(typeof data.detail === 'string' ? data.detail : 'No puedes eliminar este comentario.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    } finally {
      setDeleteCommentLoadingId(null);
    }
  };

  const submitComment = async (text: string, parentId?: number | null) => {
    if (!text.trim()) return;
    const headers = await getAuthHeaders();
    if (!headers) {
      alert('Inicia sesión para comentar.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl()}bad_words/${insultId}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ comment: text.trim(), parent_id: parentId ?? null }),
      });
      if (res.ok) {
        await loadData();
        setNewComment('');
        setReplyTo(null);
        setReplyText('');
      } else {
        const err = await res.json();
        alert(err.detail || 'Error al publicar.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !insult) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive mb-4">{error || 'Puteada no encontrada.'}</p>
        <Link href="/puteadas" className="text-primary hover:underline">
          Volver a Puteadas
        </Link>
      </div>
    );
  }

  const formatDate = (s: string) => {
    try {
      const d = new Date(s);
      return d.toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return s;
    }
  };

  return (
    <div className="w-full space-y-8">
      <Link
        href="/puteadas"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Volver a Puteadas
      </Link>

      <article className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex">
          <div className="w-1 shrink-0 bg-primary/30 rounded-l-xl" aria-hidden />
          <div className="flex-1 min-w-0 p-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {insult.insult}
              </h1>
              {insult.tag && (
                <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                  {insult.tag.name}
                </span>
              )}
            </div>
            <p className="text-foreground text-[15px] leading-relaxed mb-4">
              {insult.meaning}
            </p>
            {insult.examples && insult.examples.length > 0 && (
              <div className="mb-6 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                  Ejemplos de uso
                </p>
                <ul className="space-y-2">
                  {insult.examples.map((ex) => (
                    <li key={ex.id} className="flex gap-2">
                      <span className="text-2xl font-serif text-muted-foreground/60 shrink-0">"</span>
                      <p className="text-[15px] text-foreground leading-relaxed">{ex.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center gap-4 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleStarInsult}
                disabled={!user || starLoading}
                className={`gap-1.5 ${insult.starred_by_me ? 'border-amber-500 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 hover:border-amber-500' : ''}`}
              >
                {starLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Star className={`h-4 w-4 ${insult.starred_by_me ? 'fill-amber-500 text-amber-500' : ''}`} />
                )}
                <span>{insult.star_count ?? 0}</span>
                <span className="text-muted-foreground text-xs">estrellita</span>
              </Button>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {insult.comments_count ?? comments.length} comentarios
              </span>
            </div>
          </div>
        </div>
      </article>

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">Comentarios</h2>
        {user ? (
          <div className="mb-6">
            <Textarea
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] mb-2"
              disabled={submitting}
            />
            <Button
              onClick={() => submitComment(newComment)}
              disabled={submitting || !newComment.trim()}
              className="gap-2"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Publicar
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-6">
            <Link href="/auth/login" className="text-primary hover:underline">Inicia sesión</Link> para comentar.
          </p>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aún no hay comentarios.</p>
          ) : (
            comments.map((c) => (
              <CommentBlock
                key={c.id}
                comment={c}
                currentUserId={currentUserId}
                editingCommentId={editingCommentId}
                savingCommentId={savingCommentId}
                deleteCommentLoadingId={deleteCommentLoadingId}
                onLikeComment={handleLikeComment}
                onStarComment={handleStarComment}
                onStartEdit={() => setEditingCommentId(c.id)}
                onSaveEdit={handleEditComment}
                onCancelEdit={() => setEditingCommentId(null)}
                onDeleteComment={handleDeleteComment}
                likeLoadingId={likeLoadingId}
                starCommentLoadingId={starCommentLoadingId}
                canLike={!!user}
                canStar={!!user}
                formatDate={formatDate}
                onReply={
                  user
                    ? () => {
                        setReplyTo(c.id);
                        setReplyText('');
                      }
                    : undefined
                }
                replyForm={
                  replyTo === c.id && user ? (
                    <div className="mt-3 flex gap-2">
                      <Textarea
                        placeholder="Escribe una respuesta..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="min-h-[60px] flex-1"
                        disabled={submitting}
                      />
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          onClick={() => submitComment(replyText, c.id)}
                          disabled={submitting || !replyText.trim()}
                          className="gap-1"
                        >
                          {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                          Enviar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { setReplyTo(null); setReplyText(''); }}
                          disabled={submitting}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : null
                }
                submitting={submitting}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function CommentBlock({
  comment,
  currentUserId,
  editingCommentId,
  savingCommentId,
  deleteCommentLoadingId,
  onLikeComment,
  onStarComment,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteComment,
  likeLoadingId,
  starCommentLoadingId,
  canLike,
  canStar,
  formatDate,
  onReply,
  replyForm,
  submitting,
}: {
  comment: InsultCommentType;
  currentUserId: string | null;
  editingCommentId: number | null;
  savingCommentId: number | null;
  deleteCommentLoadingId: number | null;
  onLikeComment: (commentId: number) => void;
  onStarComment: (commentId: number) => void;
  onStartEdit: () => void;
  onSaveEdit: (commentId: number, text: string) => void;
  onCancelEdit: () => void;
  onDeleteComment: (commentId: number) => void;
  likeLoadingId: number | null;
  starCommentLoadingId: number | null;
  canLike: boolean;
  canStar: boolean;
  formatDate: (s: string) => string;
  onReply?: () => void;
  replyForm: React.ReactNode;
  submitting: boolean;
}) {
  const likeLoading = likeLoadingId === comment.id;
  const starLoading = starCommentLoadingId === comment.id;
  const isMine = currentUserId != null && comment.user_id === currentUserId;
  const isEditing = editingCommentId === comment.id;
  const saving = savingCommentId === comment.id;
  const deleting = deleteCommentLoadingId === comment.id;
  const [editText, setEditText] = useState(comment.comment);
  useEffect(() => {
    if (isEditing) setEditText(comment.comment);
  }, [isEditing, comment.id, comment.comment]);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-foreground text-sm">
            {comment.user?.full_name || comment.user?.email || 'Anónimo'}
          </p>
          <p className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isMine && !isEditing && (
            <>
              <Button variant="ghost" size="sm" onClick={onStartEdit} disabled={saving || deleting} className="gap-1" title="Editar">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteComment(comment.id)}
                disabled={saving || deleting}
                className="gap-1 text-destructive hover:text-destructive"
                title="Eliminar"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLikeComment(comment.id)}
            disabled={!canLike || likeLoading}
            className="gap-1"
            title="Me gusta"
          >
            {likeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${comment.liked_by_me ? 'fill-primary text-primary' : ''}`} />}
            <span className="text-xs">{comment.likes_count}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStarComment(comment.id)}
            disabled={!canStar || starLoading}
            className="gap-1"
            title="Estrellita"
          >
            {starLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className={`h-4 w-4 ${comment.starred_by_me ? 'fill-primary text-primary' : ''}`} />}
            <span className="text-xs">{comment.star_count}</span>
          </Button>
        </div>
      </div>
      {isEditing ? (
        <div className="mt-2 space-y-2">
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[80px]"
            disabled={saving}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onSaveEdit(comment.id, editText)} disabled={saving || !editText.trim()} className="gap-1">
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              Guardar
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancelEdit} disabled={saving}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-foreground text-sm whitespace-pre-wrap">{comment.comment}</p>
      )}
      {!isEditing && onReply && (
        <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground" onClick={onReply} disabled={submitting}>
          Responder
        </Button>
      )}
      {replyForm}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-border space-y-3">
          {comment.replies.map((r) => (
            <CommentBlock
              key={r.id}
              comment={r}
              currentUserId={currentUserId}
              editingCommentId={editingCommentId}
              savingCommentId={savingCommentId}
              deleteCommentLoadingId={deleteCommentLoadingId}
              onLikeComment={onLikeComment}
              onStarComment={onStarComment}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onDeleteComment={onDeleteComment}
              likeLoadingId={likeLoadingId}
              starCommentLoadingId={starCommentLoadingId}
              canLike={canLike}
              canStar={canStar}
              formatDate={formatDate}
              replyForm={null}
              submitting={submitting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
