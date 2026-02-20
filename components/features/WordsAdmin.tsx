'use client';

import { fetchWords } from "@/lib/data/fetchWords";
import { Category, NewWord, Word, WordExample } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef, useCallback } from "react";
import { Plus, Search, Pencil, Trash, Loader2, MessageSquare, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
} from "@/components/ui/alert-dialog"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchCategories } from "@/lib/data/fetchCategories";
import { createClient } from "@/lib/supabase";

export default function WordsAdmin () {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useAuth();
    const [words, setWords] = useState<Word[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [editingWordId, setEditingWordId] = useState<number | null>(null);
    const [expandedWords, setExpandedWords] = useState<Set<number>>(new Set());
    const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
    const [editingExample, setEditingExample] = useState<WordExample | null>(null);
    const [selectedWordId, setSelectedWordId] = useState<number | null>(null);




    const toggleWordExpansion = (wordId: number) => {
        const newExpanded = new Set(expandedWords);
        if (newExpanded.has(wordId)) {
        newExpanded.delete(wordId);
        } else {
        newExpanded.add(wordId);
        }
        setExpandedWords(newExpanded);
    };

    const [newWord, setNewWord] = useState<NewWord>({
        word: '',
        meaning: '',
        category_ids: []
    });

    const [total, setTotal] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const PAGE_SIZE = 20;
    const hasMore = words.length < total;

    const loadWords = useCallback(async (skip = 0, append = false) => {
        try {
            if (append) setLoadingMore(true);
            else setLoading(true);
            const data = await fetchWords(skip, PAGE_SIZE);
            setTotal(data.total);
            setWords(prev => append ? [...prev, ...data.items] : data.items);
        } catch {
            if (!append) setWords([]);
            setTotal(0);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    const loadCategories = async () => {
        const categoriesData: Category[] = await fetchCategories();
        setCategories(categoriesData);
    };

    useEffect(() => {
        loadWords(0, false);
        loadCategories();
    }, [loadWords]);

    useEffect(() => {
        if (!hasMore || loadingMore || loading) return;
        const el = sentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && hasMore && !loadingMore) {
                    loadWords(words.length, true);
                }
            },
            { rootMargin: "200px", threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, loadingMore, loading, words.length, loadWords]);

    const filteredWords: Word[] = words.filter(word => 
        word.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (wordId: number) => {
        try {
            const { data: { session: freshSession } } = await createClient().auth.getSession();
            const token = freshSession?.access_token;
            if (!token) {
                alert("Sesión expirada. Vuelve a iniciar sesión.");
                return;
            }
            const response = await fetch(`${apiUrl}words/${wordId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Mensaje de éxito
                alert(`✅ ${data.message}`);
                
                // Actualizar la lista de palabras (remover la palabra eliminada)
                setWords((prev) => prev.filter((w) => w.id !== wordId));
                setTotal((t) => Math.max(0, t - 1));
                
            } else {
                const err = data as { detail?: string; message?: string };
                alert(`❌ Error: ${err.detail || err.message || 'No se pudo eliminar la palabra'}`);
            }
            
        } catch (error) {
            // Mensaje de error de conexión
            alert('❌ Error de conexión al eliminar la palabra');
            console.error('Error deleting word:', error);
        }
    };

    const handleCategoryToggle = (categoryId: number) => {
        setNewWord(prev => ({
            ...prev,
            category_ids: prev.category_ids.includes(categoryId)
                ? prev.category_ids.filter(id => id !== categoryId)
                : [...prev.category_ids, categoryId]
        }));
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            const { data: { session: freshSession } } = await createClient().auth.getSession();
            const token = freshSession?.access_token;
            if (!token) {
                alert("Sesión expirada. Vuelve a iniciar sesión.");
                setIsSubmitting(false);
                return;
            }
            const headers: HeadersInit = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            };
            const response = await fetch(`${apiUrl}words/`, {
                method: "POST",
                headers,
                body: JSON.stringify(newWord),
            });

            const data = await response.json();

            if (response.ok) {
                const created = data as Word;
                alert("✅ Palabra agregada correctamente");

                setWords((prev) => [created, ...prev]);
                setTotal((t) => t + 1);

                resetForm();
                setIsModalOpen(false);
            } else {
                const err = data as { detail?: string; message?: string };
                alert(`❌ Error: ${err.detail || err.message || "No se pudo guardar la palabra"}`);
            }
        } catch (error) {
            console.error("Error al guardar la palabra:", error);
            alert("❌ Error de conexión al guardar la palabra");
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleInputChange = (field: keyof NewWord, value: string) => {
        setNewWord(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setNewWord({
            word: '',
            meaning: '',
            category_ids: [1]
        });
    };
    
    const handleOpenAddModal = () => {
        setEditingWordId(null); // estamos agregando
        resetForm();
        setIsModalOpen(true);
    };


    const handleEdit = (word: Word) => {
        setEditingWordId(word.id); // estamos editando
        setNewWord({
            word: word.word,
            meaning: word.meaning,
            category_ids: word.categories? word.categories.map(cat => cat.id) : []
        });
        setIsModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingWordId) return;

        try {
            setIsSubmitting(true);
            const { data: { session: freshSession } } = await createClient().auth.getSession();
            const token = freshSession?.access_token;
            if (!token) {
                alert("Sesión expirada. Vuelve a iniciar sesión.");
                setIsSubmitting(false);
                return;
            }
            const response = await fetch(`${apiUrl}words/${editingWordId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(newWord),
            });

            const data = await response.json();

            if (response.ok) {
                const updated = data as Word;
                alert("✅ Palabra actualizada correctamente");

                setWords(prev => prev.map(w => w.id === editingWordId ? updated : w));

                resetForm();
                setIsModalOpen(false);
                setEditingWordId(null);
            } else {
                const err = data as { detail?: string; message?: string };
                alert(`❌ Error: ${err.detail || err.message || "No se pudo actualizar la palabra"}`);
            }
        } catch (error) {
            console.error("Error al actualizar la palabra:", error);
            alert("❌ Error de conexión al actualizar la palabra");
        } finally {
            setIsSubmitting(false);
        }
    };


    const [newExampleText, setNewExampleText] = useState('');

    const handleAddExample = (wordId: number) => {
        setSelectedWordId(wordId);
        setEditingExample(null);
        setNewExampleText('');
        setIsExampleModalOpen(true);
    };

    const handleSubmitExample = async () => {
        if (!newExampleText.trim()) return;
        if (editingExample) {
            if (!editingExample.id) return;
            try {
                setIsSubmitting(true);
                const { data: { session: freshSession } } = await createClient().auth.getSession();
                const token = freshSession?.access_token;
                if (!token) {
                    alert("Sesión expirada. Vuelve a iniciar sesión.");
                    setIsSubmitting(false);
                    return;
                }
                const exampleHeaders: HeadersInit = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                };
                const response = await fetch(`${apiUrl}words/examples/${editingExample.id}`, {
                    method: "PUT",
                    headers: exampleHeaders,
                    body: JSON.stringify({ text: newExampleText.trim(), is_active: true }),
                });

                if (!response.ok) {
                    const err = await response.json().catch(() => ({}));
                    alert(`❌ Error: ${err.detail || err.message || "No se pudo actualizar el ejemplo"}`);
                    return;
                }

                const updatedExample: WordExample = await response.json();
                setWords(prev =>
                    prev.map(word =>
                        word.id === selectedWordId && word.examples
                            ? {
                                ...word,
                                examples: word.examples.map((ex) =>
                                    ex.id === updatedExample.id ? updatedExample : ex
                                ),
                            }
                            : word
                    )
                );
                alert("✅ Ejemplo actualizado correctamente");
                setIsExampleModalOpen(false);
                setNewExampleText('');
                setEditingExample(null);
            } catch (error) {
                console.error("Error al actualizar el ejemplo:", error);
                alert("❌ Error de conexión al actualizar el ejemplo");
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        if (!selectedWordId) return;
        try {
            setIsSubmitting(true);
            const { data: { session: freshSession } } = await createClient().auth.getSession();
            const token = freshSession?.access_token;
            if (!token) {
                alert("Sesión expirada. Vuelve a iniciar sesión.");
                setIsSubmitting(false);
                return;
            }
            const exampleHeaders: HeadersInit = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            };
            const response = await fetch(`${apiUrl}words/${selectedWordId}/examples`, {
                method: "POST",
                headers: exampleHeaders,
                body: JSON.stringify({ text: newExampleText.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                const updatedWord = data as Word;
                alert("✅ Ejemplo agregado correctamente");
                setWords(prev =>
                    prev.map(word => (word.id === updatedWord.id ? updatedWord : word))
                );
                setIsExampleModalOpen(false);
                setNewExampleText('');
            } else {
                const err = data as { detail?: string; message?: string };
                alert(`❌ Error: ${err.detail || err.message || "No se pudo guardar el ejemplo"}`);
            }
        } catch (error) {
            console.error("Error al guardar el ejemplo:", error);
            alert("❌ Error de conexión al guardar el ejemplo");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteExample = (wordId: number, exampleId: number) => {
        setWords(prevWords => 
        prevWords.map(word => 
            word.id === wordId 
            ? { ...word, examples: word.examples?.filter(ex => ex.id !== exampleId) }
            : word
        )
        );
    };

    const handleEditExample = (wordId: number, example: WordExample) => {
        setSelectedWordId(wordId);
        setEditingExample(example);
        setNewExampleText(example.text);
        setIsExampleModalOpen(true);
    };


    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Buscar palabras o significados..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:opacity-90 text-primary-foreground shrink-0" onClick={handleOpenAddModal}>
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Palabra
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={editingWordId ? handleEditSubmit : handleAddSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingWordId ? 'Editar palabra' : 'Agregar nueva palabra'}</DialogTitle>
                                <DialogDescription>
                                    {editingWordId ? 'Modifica los campos y guarda los cambios.' : 'Completa los campos para agregar una nueva palabra al diccionario.'}
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="word" className="text-right">
                                        Palabra
                                    </Label>
                                    <Input
                                        id="word"
                                        value={newWord.word}
                                        onChange={(e) => handleInputChange('word', e.target.value)}
                                        placeholder="Ej: chevere"
                                        className="col-span-3"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <Label htmlFor="meaning" className="text-right mt-2">
                                        Significado
                                    </Label>
                                    <Textarea
                                        id="meaning"
                                        value={newWord.meaning}
                                        onChange={(e) => handleInputChange('meaning', e.target.value)}
                                        placeholder="Describe el significado de la palabra..."
                                        className="col-span-3 min-h-[80px]"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <Label className="mb-2 block">Categorías</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                type="button"
                                                onClick={() => handleCategoryToggle(category.id)}
                                                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                                    newWord.category_ids.includes(category.id)
                                                        ? 'bg-primary/15 text-primary border border-primary/30'
                                                        : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                                                }`}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
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
                                    disabled={isSubmitting || !newWord.word.trim() || !newWord.meaning.trim()}
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="py-12 text-center text-muted-foreground text-sm">Cargando palabras...</div>
            ) : (
            <>
            {/* <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Palabra</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead></TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredWords.map((word: Word) => (
                        <TableRow key={word.id}>
                            <TableCell>{word.id}</TableCell>
                            <TableCell>{word.word}</TableCell>
                            <TableCell>{word.meaning}</TableCell>
                            <TableCell className="flex gap-2 justify-end">
                                <Button variant="secondary" onClick={() => {handleEdit(word)}} className="cursor-pointer">
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
                                        <AlertDialogTitle>¿Eliminar palabra?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Estás a punto de eliminar <b>{word.word}</b>.  
                                            Esta acción no se puede deshacer.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDelete(word.id)}
                                            className="bg-destructive text-white hover:bg-destructive/90"
                                        >
                                            Eliminar
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table> */}

            <p className="text-sm text-muted-foreground mb-4">
                    {filteredWords.length} palabra{filteredWords.length !== 1 ? 's' : ''}
                    {total > 0 && ` (${words.length} de ${total} cargadas)`}
                </p>
                <div className="space-y-3">
                    {filteredWords.map((word) => {
                    const isExpanded = expandedWords.has(word.id);
                    return (
                        <div key={word.id} className="rounded-xl border border-border bg-background overflow-hidden shadow-soft">
                        <div className="p-4">
                            <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleWordExpansion(word.id)}
                                className="p-1.5 shrink-0 rounded-lg"
                                >
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </Button>
                                <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-foreground">{word.word}</span>
                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                                    {word.examples?.length ?? 0} ejemplo{(word.examples?.length ?? 0) !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-sm mt-0.5 line-clamp-2">{word.meaning}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <Button variant="outline" size="icon" onClick={() => handleEdit(word)} className="rounded-lg">
                                    <Pencil className="size-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="icon" className="rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10">
                                            <Trash className="size-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>¿Eliminar palabra?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Se eliminará <strong>{word.word}</strong>. Esta acción no se puede deshacer.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(word.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Eliminar
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            </div>
                        </div>
                        {isExpanded && (
                            <div className="border-t border-border bg-muted/20 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-foreground flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    Ejemplos de uso
                                </h4>
                                <Dialog open={isExampleModalOpen} onOpenChange={setIsExampleModalOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="secondary" onClick={() => handleAddExample(word.id)} className="rounded-lg">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Agregar ejemplo
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] rounded-xl">
                                    <DialogHeader>
                                    <DialogTitle>
                                        {editingExample ? 'Editar Ejemplo' : 'Agregar Nuevo Ejemplo'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingExample 
                                        ? 'Modifica el ejemplo de uso para la palabra.'
                                        : 'Agrega un nuevo ejemplo de uso para la palabra.'
                                        }
                                    </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="py-4">
                                    <Label htmlFor="example-text" className="text-right">
                                        Ejemplo
                                    </Label>
                                    <Textarea
                                        id="example-text"
                                        value={newExampleText}
                                        onChange={(e) => setNewExampleText(e.target.value)}
                                        placeholder="Ej: ¡Esa película estuvo chevere!"
                                        className="mt-2 min-h-[80px]"
                                        disabled={isSubmitting}
                                    />
                                    </div>
                                    
                                    <DialogFooter>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => {
                                        setIsExampleModalOpen(false);
                                        setNewExampleText('');
                                        setEditingExample(null);
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button 
                                        onClick={handleSubmitExample}
                                        disabled={isSubmitting || !newExampleText.trim()}
                                    >
                                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        {isSubmitting ? 'Guardando...' : (editingExample ? 'Actualizar' : 'Agregar')}
                                    </Button>
                                    </DialogFooter>
                                </DialogContent>
                                </Dialog>
                            </div>

                            {!word.examples?.length ? (
                                <div className="text-center py-6 text-muted-foreground">
                                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No hay ejemplos. Agrega el primero.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                {word.examples?.map((example) => (
                                    <div key={example.id} className="bg-card p-3 rounded-lg border border-border flex items-start justify-between gap-2 group">
                                    <p className="flex-1 text-sm text-foreground italic min-w-0">&quot;{example.text}&quot;</p>
                                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="sm" onClick={() => handleEditExample(word.id, example)} className="h-8 w-8 p-0 rounded-md">
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-md text-destructive hover:text-destructive">
                                                <Trash className="h-3 w-3" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="rounded-xl">
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>¿Eliminar ejemplo?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Se eliminará: <em>&quot;{example.text}&quot;</em>. No se puede deshacer.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteExample(word.id, example.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Eliminar
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                        </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                    </div>
                                ))}
                                </div>
                            )}
                            </div>
                        )}
                        </div>
                    );
                    })}
                </div>
                <div ref={sentinelRef} className="min-h-[1px] w-full" aria-hidden />
                {loadingMore && (
                    <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}
            </>
            )}
        </>
    )
}