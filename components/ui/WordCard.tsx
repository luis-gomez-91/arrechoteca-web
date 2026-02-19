'use client';

import { useState } from 'react';
import { Word } from '@/types/word';
import { Bookmark } from 'lucide-react';

interface WordCardProps {
  word: Word;
}

function highlightWordInExample(exampleText: string, mainWord: string): React.ReactNode {
  if (!mainWord.trim()) return <>{exampleText}</>;
  const parts: React.ReactNode[] = [];
  const lower = exampleText.toLowerCase();
  const mainLower = mainWord.toLowerCase();
  let lastEnd = 0;
  let idx = lower.indexOf(mainLower);
  while (idx !== -1) {
    if (idx > lastEnd) parts.push(exampleText.slice(lastEnd, idx));
    parts.push(
      <mark key={idx} className="bg-primary/15 text-primary font-medium rounded px-0.5">
        {exampleText.slice(idx, idx + mainWord.length)}
      </mark>
    );
    lastEnd = idx + mainWord.length;
    idx = lower.indexOf(mainLower, lastEnd);
  }
  if (lastEnd < exampleText.length) parts.push(exampleText.slice(lastEnd));
  return <>{parts.length ? parts : exampleText}</>;
}

export default function WordCard({ word }: WordCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const hasExamples = word.examples && word.examples.length > 0;

  return (
    <article className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex">
        <div className="w-1 shrink-0 bg-primary/30 rounded-l-lg" aria-hidden />
        <div className="flex-1 min-w-0 p-5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {word.word}
            </h2>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setBookmarked((b) => !b);
              }}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
              aria-label={bookmarked ? 'Quitar de guardados' : 'Guardar'}
            >
              <Bookmark
                className={`w-5 h-5 ${bookmarked ? 'fill-primary text-primary' : ''}`}
              />
            </button>
          </div>

          <p className="mt-3 text-foreground text-[15px] leading-relaxed">
            {word.meaning}
          </p>

          {hasExamples && (
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                Ejemplos de uso
              </p>
              <ul className="space-y-3">
                {word.examples!.map((ex) => (
                  <li key={ex.id} className="flex gap-2">
                    <span
                      className="text-2xl font-serif text-muted-foreground/60 leading-none shrink-0 select-none"
                      aria-hidden
                    >
                      “
                    </span>
                    <p className="text-[15px] text-foreground leading-relaxed pt-0.5">
                      {highlightWordInExample(ex.text, word.word)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
