'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Star, MessageCircle, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase';
import { fetchBadWords } from '@/lib/data/fetchBadWords';
import type { BadWord } from '@/types/bad_word';

const apiUrl = () => process.env.NEXT_PUBLIC_API_URL ?? '';

function sortByStarsThenName(items: BadWord[]): BadWord[] {
  return [...items].sort((a, b) => {
    const starsA = a.star_count ?? 0;
    const starsB = b.star_count ?? 0;
    if (starsB !== starsA) return starsB - starsA;
    return (a.insult ?? '').localeCompare(b.insult ?? '', 'es');
  });
}

export default function PuteadasList() {
  const { user, session } = useAuth();
  const token = session?.access_token ?? null;
  const [items, setItems] = useState<BadWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starLoadingId, setStarLoadingId] = useState<number | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchBadWords(token);
      setItems(sortByStarsThenName(data));
    } catch (e) {
      console.error(e);
      setError('No se pudo cargar la lista.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleStar = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    const { data: { session: s } } = await createClient().auth.getSession();
    const t = s?.access_token;
    if (!t) return;
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` };
    setStarLoadingId(id);
    try {
      const res = await fetch(`${apiUrl()}bad_words/${id}/star`, { method: 'POST', headers });
      const data = await res.json();
      if (res.ok) {
        setItems((prev) =>
          sortByStarsThenName(
            prev.map((w) =>
              w.id === id
                ? {
                    ...w,
                    starred_by_me: data.starred,
                    star_count: data.star_count ?? (w.star_count ?? 0) + (data.starred ? 1 : -1),
                  }
                : w
            )
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStarLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground text-sm">
        Cargando puteadas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-destructive text-sm">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center">
        <p className="text-muted-foreground">Aún no hay puteadas en el diccionario.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((w) => (
        <Link
          key={w.id}
          href={`/puteadas/${w.id}`}
          className="block group cursor-pointer rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-md hover:bg-card/90"
        >
          <article className="flex">
            <div className="w-1 shrink-0 bg-primary/30 rounded-l-xl" aria-hidden />
            <div className="flex-1 min-w-0 p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  {w.insult}
                </h2>
                {w.tag && (
                  <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                    {w.tag.name}
                  </span>
                )}
              </div>
              <p className="text-foreground text-[15px] leading-relaxed">
                {w.meaning}
              </p>
              {w.examples && w.examples.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                    Ejemplos de uso
                  </p>
                  <ul className="space-y-2">
                    {w.examples.map((ex) => (
                      <li key={ex.id} className="flex gap-2">
                        <span className="text-2xl font-serif text-muted-foreground/60 leading-none shrink-0 select-none" aria-hidden>
                          "
                        </span>
                        <p className="text-[15px] text-foreground leading-relaxed pt-0.5">
                          {ex.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleStar(e, w.id)}
                    className={`relative z-10 inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-colors ${
                      w.starred_by_me
                        ? 'border-amber-500 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 hover:border-amber-500'
                        : 'border-border bg-background text-foreground hover:bg-muted hover:border-primary/30'
                    }`}
                    title={user ? 'Dar estrellita' : 'Inicia sesión para dar estrellita'}
                  >
                    {starLoadingId === w.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <Star className={`h-4 w-4 ${w.starred_by_me ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'}`} />
                    )}
                    <span>{w.star_count ?? 0}</span>
                    <span className="hidden sm:inline">Estrellita</span>
                  </button>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    {w.comments_count ?? 0} comentarios
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Ver detalle y comentarios
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
