'use client';

import { Loader2, Pencil, Plus, Search, Trash, MessageSquare, Star } from "lucide-react";
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
import { BadWord, InsultTag, ExampleFormItem } from "@/types/bad_word";
import { fetchBadWords, fetchInsultTags } from "@/lib/data/fetchBadWords";

const apiUrl = () => process.env.NEXT_PUBLIC_API_URL ?? "";

export default function InsultsAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [badWords, setBadWords] = useState<BadWord[]>([]);
  const [tags, setTags] = useState<InsultTag[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formInsult, setFormInsult] = useState("");
  const [formMeaning, setFormMeaning] = useState("");
  const [formTagId, setFormTagId] = useState<number | null>(null);
  const [exampleItems, setExampleItems] = useState<ExampleFormItem[]>([{ text: "" }]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [wordsData, tagsData] = await Promise.all([
        fetchBadWords(),
        fetchInsultTags(),
      ]);
      setBadWords(wordsData);
      setTags(tagsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredBadWords = badWords.filter(
    (w) =>
      w.insult?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.meaning?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.tag?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const setExampleItem = (index: number, text: string) => {
    setExampleItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], text };
      return next;
    });
  };
  const addExample = () => setExampleItems((prev) => [...prev, { text: "" }]);
  const removeExample = (index: number) => {
    setExampleItems((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormInsult("");
    setFormMeaning("");
    setFormTagId(null);
    setExampleItems([{ text: "" }]);
    setEditingId(null);
  };

  const getAuthHeaders = async () => {
    const { data: { session } } = await createClient().auth.getSession();
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

  const handleOpenAdd = () => {
    resetForm();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (w: BadWord) => {
    setEditingId(w.id);
    setFormInsult(w.insult);
    setFormMeaning(w.meaning);
    setFormTagId(w.tag_id ?? null);
    const fromExamples = w.examples?.length
      ? w.examples.map((e) => ({ id: e.id, text: e.text }))
      : [];
    setExampleItems(fromExamples.length ? [...fromExamples, { text: "" }] : [{ text: "" }]);
    setIsModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = await getAuthHeaders();
    if (!headers) return;
    try {
      setIsSubmitting(true);
      const createRes = await fetch(`${apiUrl()}bad_words/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          insult: formInsult.trim(),
          meaning: formMeaning.trim(),
          is_active: true,
          tag_id: formTagId,
        }),
      });
      const created = await createRes.json();
      if (!createRes.ok) {
        alert(`❌ ${created.detail || created.message || "Error al crear"}`);
        return;
      }
      const newId = created.id;
      const texts = exampleItems.map((x) => x.text.trim()).filter(Boolean);
      for (const text of texts) {
        await fetch(`${apiUrl()}bad_words/${newId}/examples`, {
          method: "POST",
          headers,
          body: JSON.stringify({ text, is_active: true }),
        });
      }
      await loadData();
      alert("✅ Puteada agregada correctamente");
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("❌ Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId == null) return;
    const headers = await getAuthHeaders();
    if (!headers) return;
    const current = badWords.find((w) => w.id === editingId);
    if (!current) return;
    try {
      setIsSubmitting(true);
      const putRes = await fetch(`${apiUrl()}bad_words/${editingId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          insult: formInsult.trim(),
          meaning: formMeaning.trim(),
          is_active: true,
          tag_id: formTagId,
        }),
      });
      const updated = await putRes.json();
      if (!putRes.ok) {
        alert(`❌ ${updated.detail || updated.message || "Error al actualizar"}`);
        return;
      }
      const existingExamples = current.examples ?? [];
      const newList = exampleItems.filter((x) => x.text.trim());
      const existingIds = new Set(newList.filter((x) => x.id != null).map((x) => x.id!));
      for (const ex of existingExamples) {
        if (!existingIds.has(ex.id)) {
          await fetch(`${apiUrl()}bad_words/examples/${ex.id}`, {
            method: "DELETE",
            headers: { Authorization: (headers as Record<string, string>).Authorization },
          });
        }
      }
      for (const item of newList) {
        if (item.id != null) {
          const prev = existingExamples.find((e) => e.id === item.id);
          if (prev && prev.text !== item.text.trim()) {
            await fetch(`${apiUrl()}bad_words/examples/${item.id}`, {
              method: "PUT",
              headers,
              body: JSON.stringify({ text: item.text.trim(), is_active: true }),
            });
          }
        } else {
          await fetch(`${apiUrl()}bad_words/${editingId}/examples`, {
            method: "POST",
            headers,
            body: JSON.stringify({ text: item.text.trim(), is_active: true }),
          });
        }
      }
      await loadData();
      alert("✅ Puteada actualizada correctamente");
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("❌ Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const headers = await getAuthHeaders();
    if (!headers) return;
    try {
      const res = await fetch(`${apiUrl()}bad_words/${id}`, {
        method: "DELETE",
        headers: { Authorization: (headers as Record<string, string>).Authorization },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBadWords((prev) => prev.filter((w) => w.id !== id));
        alert(`✅ ${data.message}`);
      } else {
        alert(`❌ ${data.detail || data.message || "No se pudo eliminar"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error de conexión");
    }
  };

  return (
    <>
      <div className="flex gap-4 my-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar puteadas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAdd} className="shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Puteada
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={editingId ? handleEditSubmit : handleAddSubmit}>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar puteada" : "Agregar puteada"}</DialogTitle>
                <DialogDescription>
                  Completa los campos. Tag opcional; puedes añadir varios ejemplos.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="insult" className="text-right">Puteada</Label>
                  <Input
                    id="insult"
                    value={formInsult}
                    onChange={(e) => setFormInsult(e.target.value)}
                    placeholder="Ej: Hijueputa"
                    className="col-span-3"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tag" className="text-right">Tag</Label>
                  <select
                    id="tag"
                    value={formTagId ?? ""}
                    onChange={(e) => setFormTagId(e.target.value ? Number(e.target.value) : null)}
                    className="col-span-3 h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={isSubmitting}
                  >
                    <option value="">Ninguno</option>
                    {tags.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="meaning" className="text-right mt-2">Significado</Label>
                  <Textarea
                    id="meaning"
                    value={formMeaning}
                    onChange={(e) => setFormMeaning(e.target.value)}
                    placeholder="Significado de la puteada..."
                    className="col-span-3 min-h-[80px]"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      Ejemplos de uso
                    </Label>
                    <Button type="button" variant="ghost" size="sm" onClick={addExample} disabled={isSubmitting}>
                      <Plus className="h-4 w-4 mr-1" /> Añadir
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {exampleItems.map((item, index) => (
                      <div key={item.id ?? `new-${index}`} className="flex gap-2">
                        <Input
                          value={item.text}
                          onChange={(e) => setExampleItem(index, e.target.value)}
                          placeholder={`Ejemplo ${index + 1}`}
                          className="flex-1"
                          disabled={isSubmitting}
                        />
                        {exampleItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExample(index)}
                            disabled={isSubmitting}
                            className="shrink-0 text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting || !formInsult.trim() || !formMeaning.trim()}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground text-sm">Cargando puteadas...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Puteada</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Significado</TableHead>
              <TableHead className="text-center">Ejemplos</TableHead>
              <TableHead className="text-center">Estrellitas</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBadWords.map((w) => (
              <TableRow key={w.id}>
                <TableCell>{w.id}</TableCell>
                <TableCell className="font-medium">{w.insult}</TableCell>
                <TableCell>
                  {w.tag ? (
                    <span className="inline-flex px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground">
                      {w.tag.name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={w.meaning}>{w.meaning}</TableCell>
                <TableCell className="text-center text-muted-foreground">{w.examples?.length ?? 0}</TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Star className="h-4 w-4" />
                    {w.star_count ?? 0}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <Button variant="secondary" size="icon" onClick={() => handleEdit(w)} className="cursor-pointer">
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
                        <AlertDialogTitle>¿Eliminar puteada?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Se eliminará <b>{w.insult}</b>. No se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(w.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
