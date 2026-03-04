"use client";

import { Loader2, Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { createClient } from "@/lib/supabase";
import type {
  TestGuayacoQuestion,
  TestGuayacoAnswerItem,
} from "@/types/testGuayaco";
import {
  fetchTestGuayacoQuestions,
  createTestGuayacoQuestion,
  updateTestGuayacoQuestion,
  deleteTestGuayacoQuestion,
} from "@/lib/data/fetchTestGuayaco";

const emptyAnswers: TestGuayacoAnswerItem[] = [
  { text: "", order: 1, is_correct: false },
  { text: "", order: 2, is_correct: false },
  { text: "", order: 3, is_correct: false },
  { text: "", order: 4, is_correct: false },
];

export default function RespectAdmin() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<TestGuayacoQuestion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formQuestion, setFormQuestion] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formAnswers, setFormAnswers] = useState<TestGuayacoAnswerItem[]>(emptyAnswers);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTestGuayacoQuestions(0, 100);
      setQuestions(data.items ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getAuthHeaders = async () => {
    const {
      data: { session },
    } = await createClient().auth.getSession();
    const token = session?.access_token;
    if (!token) {
      alert("Sesión expirada. Vuelve a iniciar sesión.");
      return null;
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const getToken = async () => {
    const {
      data: { session },
    } = await createClient().auth.getSession();
    return session?.access_token ?? null;
  };

  const resetForm = () => {
    setFormQuestion("");
    setFormActive(true);
    setFormAnswers(emptyAnswers.map((a) => ({ ...a })));
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (q: TestGuayacoQuestion) => {
    setEditingId(q.id);
    setFormQuestion(q.question);
    setFormActive(q.is_active);
    const answers = (q.answers ?? []).sort((a, b) => a.order - b.order);
    setFormAnswers(
      [1, 2, 3, 4].map((order) => {
        const a = answers.find((x) => x.order === order);
        return a
          ? { text: a.text, order: a.order, is_correct: a.is_correct }
          : { text: "", order, is_correct: false };
      })
    );
    setIsModalOpen(true);
  };

  const setAnswerAt = (index: number, field: keyof TestGuayacoAnswerItem, value: string | number | boolean) => {
    setFormAnswers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const setCorrectAnswer = (index: number) => {
    setFormAnswers((prev) =>
      prev.map((a, i) => ({ ...a, is_correct: i === index }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getToken();
    if (!token) return;
    const answers = formAnswers.map((a, i) => ({
      text: a.text.trim(),
      order: i + 1,
      is_correct: i === formAnswers.findIndex((x) => x.is_correct),
    }));
    if (answers.some((a) => !a.text)) {
      alert("Las 4 respuestas deben tener texto.");
      return;
    }
    const correctCount = answers.filter((a) => a.is_correct).length;
    if (correctCount !== 1) {
      alert("Debe haber exactamente una respuesta correcta. Marca una con el botón «Correcta».");
      return;
    }
    try {
      setIsSubmitting(true);
      if (editingId != null) {
        await updateTestGuayacoQuestion(
          editingId,
          { question: formQuestion.trim(), is_active: formActive, answers },
          token
        );
        alert("✅ Pregunta actualizada.");
      } else {
        await createTestGuayacoQuestion(
          { question: formQuestion.trim(), is_active: formActive, answers },
          token
        );
        alert("✅ Pregunta creada.");
      }
      await loadData();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("❌ " + (err instanceof Error ? err.message : "Error al guardar"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = await getToken();
    if (!token) return;
    try {
      await deleteTestGuayacoQuestion(id, token);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      alert("✅ Pregunta eliminada.");
    } catch (err) {
      console.error(err);
      alert("❌ " + (err instanceof Error ? err.message : "No se pudo eliminar"));
    }
  };

  return (
    <>
      <div className="flex gap-4 my-3">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAdd} className="shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Agregar pregunta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar pregunta" : "Agregar pregunta"}
                </DialogTitle>
                <DialogDescription>
                  Escribe la pregunta y exactamente 4 respuestas. Marca cuál es la correcta.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Pregunta</Label>
                  <Textarea
                    id="question"
                    value={formQuestion}
                    onChange={(e) => setFormQuestion(e.target.value)}
                    placeholder="Ej: ¿Qué significa 'chévere'?"
                    className="min-h-[80px]"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    disabled={isSubmitting}
                    className="rounded border-input"
                  />
                  <Label htmlFor="active">Activa (aparece en el test)</Label>
                </div>
                <div className="space-y-3">
                  <Label>Respuestas (marca la correcta)</Label>
                  {formAnswers.map((a, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={a.text}
                        onChange={(e) => setAnswerAt(index, "text", e.target.value)}
                        placeholder={`Opción ${index + 1}`}
                        className="flex-1"
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant={a.is_correct ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCorrectAnswer(index)}
                        disabled={isSubmitting}
                      >
                        Correcta
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formQuestion.trim()}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground text-sm">
          Cargando preguntas...
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Pregunta</TableHead>
              <TableHead className="text-center">Activa</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No hay preguntas. Agrega la primera para el test.
                </TableCell>
              </TableRow>
            ) : (
              questions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell>{q.id}</TableCell>
                  <TableCell className="max-w-[320px] truncate" title={q.question}>
                    {q.question}
                  </TableCell>
                  <TableCell className="text-center">
                    {q.is_active ? (
                      <span className="text-green-600 text-sm">Sí</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">No</span>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleEdit(q)}
                      className="cursor-pointer"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="cursor-pointer">
                          <Trash className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar pregunta?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Se eliminará la pregunta y sus respuestas. No se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(q.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}
