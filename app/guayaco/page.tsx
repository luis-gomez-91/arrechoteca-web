"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchTestGuayacoQuestions } from "@/lib/data/fetchTestGuayaco";
import type { TestGuayacoQuestion, TestGuayacoAnswer } from "@/types/testGuayaco";
import { Loader2, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUESTIONS_PER_TEST = 10;

/** Rúbrica: mensaje final según puntaje sobre 10 */
function getResultMessage(score: number): { title: string; subtitle: string } {
  if (score <= 2) {
    return {
      title: "Aún no eres guayaco",
      subtitle: "Te falta calle, compa. Sigue leyendo la jerga y vuelve a intentarlo.",
    };
  }
  if (score <= 4) {
    return {
      title: "Estás en proceso",
      subtitle: "Algo sabes, pero te falta afinar el oído. Dale duro al diccionario.",
    };
  }
  if (score <= 6) {
    return {
      title: "Vas bien, casi eres guayaco",
      subtitle: "Ya te defiendes. Un poquito más y llegas.",
    };
  }
  if (score <= 8) {
    return {
      title: "Eres bien guayaco",
      subtitle: "La caleta te conoce. Guayaco que se respeta.",
    };
  }
  return {
    title: "Eres guayaco hasta las patas",
    subtitle: "De la calle, del barrio. ¡Guayaco que se respeta!",
  };
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function GuayacoPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allQuestions, setAllQuestions] = useState<TestGuayacoQuestion[]>([]);
  const [gameQuestions, setGameQuestions] = useState<TestGuayacoQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [results, setResults] = useState<{ questionId: number; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTestGuayacoQuestions(0, 100);
      const active = (data.items ?? []).filter((q) => q.is_active && q.answers?.length >= 4);
      setAllQuestions(active);
      if (active.length < QUESTIONS_PER_TEST) {
        setError(`Se necesitan al menos ${QUESTIONS_PER_TEST} preguntas activas. Hay ${active.length}.`);
        return;
      }
      const shuffled = shuffle(active);
      setGameQuestions(shuffled.slice(0, QUESTIONS_PER_TEST));
      setCurrentIndex(0);
      setSelectedAnswerId(null);
      setResults([]);
      setFinished(false);
    } catch (e) {
      console.error(e);
      setError("No se pudo cargar el test. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const currentQuestion = gameQuestions[currentIndex];
  const currentAnswers: TestGuayacoAnswer[] = currentQuestion
    ? [...(currentQuestion.answers ?? [])].sort((a, b) => a.order - b.order)
    : [];

  const handleSelectAnswer = (answerId: number, isCorrect: boolean) => {
    if (selectedAnswerId != null) return;
    setSelectedAnswerId(answerId);
    setResults((prev) => [...prev, { questionId: currentQuestion.id, correct: isCorrect }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= gameQuestions.length) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedAnswerId(null);
  };

  const score = results.filter((r) => r.correct).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando test...</p>
      </div>
    );
  }

  if (error || gameQuestions.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <header className="mb-8">
          <p className="text-sm font-medium text-primary mb-1">Test</p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Test Guayaco
          </h1>
          <p className="text-muted-foreground mt-2">
            Pon a prueba qué tan guayaco eres con la jerga de la costa.
          </p>
        </header>
        <div className="rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
          <p className="text-muted-foreground mb-4">{error ?? "No hay preguntas disponibles."}</p>
          <Button onClick={loadQuestions} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (finished) {
    const { title, subtitle } = getResultMessage(score);
    return (
      <div className="w-full max-w-xl mx-auto">
        <header className="mb-8">
          <p className="text-sm font-medium text-primary mb-1">Resultado</p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Test Guayaco
          </h1>
        </header>
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <Trophy className="h-8 w-8" />
          </div>
          <p className="text-4xl font-bold text-foreground mb-1">
            {score} / {QUESTIONS_PER_TEST}
          </p>
          <p className="text-muted-foreground text-sm mb-6">respuestas correctas</p>
          <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground mb-8">{subtitle}</p>
          <Button onClick={loadQuestions} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Volver a jugar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary mb-1">Test</p>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Test Guayaco
        </h1>
        <p className="text-muted-foreground mt-2">
          {currentIndex + 1} de {gameQuestions.length} — Elige la respuesta correcta.
        </p>
      </header>

      <article className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          {currentQuestion.question}
        </h2>
        <ul className="space-y-3">
          {currentAnswers.map((a) => {
            const selected = selectedAnswerId === a.id;
            const showCorrect = selectedAnswerId != null && a.is_correct;
            const showWrong = selectedAnswerId != null && selected && !a.is_correct;
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => handleSelectAnswer(a.id, a.is_correct)}
                  disabled={selectedAnswerId != null}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors disabled:pointer-events-none ${
                    selectedAnswerId == null
                      ? "border-border bg-background hover:bg-muted hover:border-primary/30"
                      : showCorrect
                        ? "border-green-500 bg-green-500/10 text-green-700"
                        : showWrong
                          ? "border-destructive/50 bg-destructive/10 text-destructive"
                          : selected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {a.text}
                </button>
              </li>
            );
          })}
        </ul>
        {selectedAnswerId != null && (
          <div className="mt-6 flex justify-end">
            <Button onClick={handleNext}>
              {currentIndex + 1 >= gameQuestions.length ? "Ver resultado" : "Siguiente"}
            </Button>
          </div>
        )}
      </article>
    </div>
  );
}
