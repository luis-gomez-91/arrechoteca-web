"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { fetchWords } from "@/lib/data/fetchWords";
import WordCard from "./WordCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Word } from "@/types/word";
import { Search, Loader2 } from "lucide-react";

const PAGE_SIZE = 20;
const MAX_AUTO_LOAD_WHEN_SEARCHING = 10;

type TabId = "todo" | "az" | "populares" | "recientes";

const TABS: { id: TabId; label: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "az", label: "A-Z" },
  { id: "populares", label: "Populares" },
  { id: "recientes", label: "Recientes" },
];

export default function Words() {
  const [words, setWords] = useState<Word[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("todo");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const autoLoadCountRef = useRef(0);
  const lastSearchRef = useRef("");

  const filteredBySearch = useMemo(
    () =>
      words.filter(
        (word) =>
          word.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.meaning?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [words, searchTerm]
  );

  const filteredWords = useMemo(() => {
    let list = [...filteredBySearch];
    if (activeTab === "az") {
      list.sort((a, b) => (a.word ?? "").localeCompare(b.word ?? ""));
    }
    if (activeTab === "recientes") {
      list.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }
    if (activeTab === "populares") {
      list.sort((a, b) => (b.examples?.length ?? 0) - (a.examples?.length ?? 0));
    }
    return list;
  }, [filteredBySearch, activeTab]);

  const hasMore = words.length < total;

  const loadPage = useCallback(async (skip: number, append: boolean) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);
      const data = await fetchWords(skip, PAGE_SIZE);
      setTotal(data.total);
      setWords((prev) => (append ? [...prev, ...data.items] : data.items));
    } catch {
      if (!append) setWords([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPage(0, false);
  }, [loadPage]);

  useEffect(() => {
    if (searchTerm !== lastSearchRef.current) {
      lastSearchRef.current = searchTerm;
      autoLoadCountRef.current = 0;
    }
  }, [searchTerm]);

  useEffect(() => {
    if (
      !searchTerm.trim() ||
      filteredWords.length > 0 ||
      !hasMore ||
      loadingMore ||
      loading ||
      autoLoadCountRef.current >= MAX_AUTO_LOAD_WHEN_SEARCHING
    ) {
      return;
    }
    autoLoadCountRef.current += 1;
    loadPage(words.length, true);
  }, [searchTerm, filteredWords.length, hasMore, loadingMore, loading, words.length, loadPage]);

  useEffect(() => {
    if (!hasMore || loadingMore || loading) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loadingMore) {
          loadPage(words.length, true);
        }
      },
      { rootMargin: "200px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, words.length, loadPage]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="flex gap-2">
          {TABS.map((_, i) => (
            <Skeleton key={i} className="h-9 w-16 rounded-lg" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Búsqueda + filtros fijos al hacer scroll */}
      <div className="sticky top-16 z-10 flex flex-col gap-4 pb-4 -mx-1 px-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-transparent shadow-[0_1px_0_0_var(--border)]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Buscar palabra o significado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
            aria-label="Buscar en el diccionario"
          />
        </div>

        {/* Filtros + contador */}
        <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {total > 0 && `${filteredWords.length} de ${total}`}
        </span>
        </div>
      </div>

      {/* Lista o estado vacío */}
      {filteredWords.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 py-14 text-center">
          {searchTerm && hasMore && loadingMore ? (
            <p className="text-sm text-muted-foreground">Buscando en más palabras...</p>
          ) : searchTerm && hasMore ? (
            <p className="text-sm text-muted-foreground">
              No encontrado en {words.length} cargadas. Cargando más...
            </p>
          ) : searchTerm ? (
            <p className="text-sm text-muted-foreground">
              Sin resultados para &quot;{searchTerm}&quot;.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Aún no hay palabras.</p>
          )}
        </div>
      ) : (
        <>
          <ul className="space-y-6" role="list">
            {filteredWords.map((word) => (
              <li key={word.id}>
                <WordCard word={word} />
              </li>
            ))}
          </ul>
          <div ref={sentinelRef} className="min-h-[1px] w-full" aria-hidden />
          {loadingMore && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
            </div>
          )}
          {!loadingMore && hasMore && (
            <p className="text-center text-xs text-muted-foreground pb-4">
              Desplaza para cargar más
            </p>
          )}
        </>
      )}
    </div>
  );
}
