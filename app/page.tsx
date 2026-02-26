import React from 'react';
import Link from 'next/link';
import { BookOpen, MessageCircle, Users, Zap, ArrowRight } from 'lucide-react';
import AdSlot from '@/components/ads/AdSlot';

export default function Page() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="w-full">
          <p className="text-sm font-medium text-primary mb-3">Diccionario de la jerga guayaca</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-5">
            La Caleta del Verbo
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            Palabras, expresiones y el sabor costeño de Guayaquil. Significados, ejemplos de uso y la caleta del palabreo que nos define.
          </p>
          <Link
            href="/palabras"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Explorar diccionario
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Espacio publicitario en la home */}
      <section className="py-8" aria-label="Publicidad">
        <AdSlot id="banner-home" variant="banner" />
      </section>

      {/* Enlaces */}
      <section className="py-12 border-t border-border">
        <p className="text-sm font-medium text-muted-foreground mb-6">Qué encontrarás</p>
        <nav className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/palabras"
            className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-primary/[0.04]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="font-medium text-foreground">Diccionario</span>
            <span className="text-sm text-muted-foreground">Jerga guayaca</span>
          </Link>
          <Link
            href="/puteadas"
            className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-primary/[0.04]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15">
              <Zap className="h-5 w-5" />
            </span>
            <span className="font-medium text-foreground">Puteadas</span>
            <span className="text-sm text-muted-foreground">Puteadas</span>
          </Link>
          <Link
            href="/guayaco"
            className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-primary/[0.04]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15">
              <Users className="h-5 w-5" />
            </span>
            <span className="font-medium text-foreground">Test Guayaco</span>
            <span className="text-sm text-muted-foreground">Guayaco que se respeta</span>
          </Link>
          <Link
            href="/palabras"
            className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-primary/[0.04]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15">
              <MessageCircle className="h-5 w-5" />
            </span>
            <span className="font-medium text-foreground">Comentar</span>
            <span className="text-sm text-muted-foreground">Comunidad</span>
          </Link>
        </nav>
      </section>
    </div>
  );
}
