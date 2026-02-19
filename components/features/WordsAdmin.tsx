'use client';

import { fetchWords } from "@/lib/data/fetchWords";
import { Category, NewWord, Word, WordExample } from "@/types";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export default function WordsAdmin () {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
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

    const loadWords = async () => {
        try {
            setLoading(true)
            const wordsData: Word[] = await fetchWords();
            setWords(wordsData);
        } catch {
            
        } finally {
            setLoading(false)
        }    
    };

    const loadCategories = async () => {
        const categoriesData: Category[] = await fetchCategories();
        setCategories(categoriesData);
    };

    useEffect(() => {
        loadWords();
        loadCategories();
    }, []);

    const filteredWords: Word[] = words.filter(word => 
        word.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        console.log('Agregar nueva palabra');
    };

    const handleDelete = async (wordId: number) => {
        try {
            const response = await fetch(`${apiUrl}words/${wordId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Mensaje de éxito
                alert(`✅ ${data.message}`);
                
                // Actualizar la lista de palabras (remover la palabra eliminada)
                setWords(words.filter(word => word.id !== wordId));
                
            } else {
                // Mensaje de error del servidor
                alert(`❌ Error: ${data.detail || data.message || 'No se pudo eliminar la palabra'}`);
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

            const response = await fetch(`${apiUrl}words/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newWord),
            });

            const data: Word = await response.json();

            if (response.ok) {
                // ✅ Palabra creada correctamente
                alert("✅ Palabra agregada correctamente");

                // Agregar la nueva palabra al inicio de la lista
                setWords((prev) => [data, ...prev]);

                // Cerrar modal y resetear form
                resetForm();
                setIsModalOpen(false);
            } else {
                alert(`❌ Error: ${data.detail || data.message || "No se pudo guardar la palabra"}`);
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

            const response = await fetch(`${apiUrl}words/${editingWordId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newWord),
            });

            const data: Word = await response.json();

            if (response.ok) {
                alert("✅ Palabra actualizada correctamente");

                setWords(prev => prev.map(w => w.id === editingWordId ? data : w));

                resetForm();
                setIsModalOpen(false);
                setEditingWordId(null);
            } else {
                alert(`❌ Error: ${data.detail || data.message || "No se pudo actualizar la palabra"}`);
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
        // e.preventDefault();
        if (!selectedWordId || !newExampleText.trim()) return;

        try {
            setIsSubmitting(true);

            const response = await fetch(`${apiUrl}words/${selectedWordId}/examples`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: newExampleText }),
            });

            const updatedWord: Word = await response.json();

            if (response.ok) {
                alert("✅ Ejemplo agregado correctamente");

                setWords(prev =>
                    prev.map(word =>
                    word.id === updatedWord.id ? updatedWord : word
                    )
                );

                setIsExampleModalOpen(false);
                setNewExampleText('');
            }

        } catch (error) {
            alert("❌ Error de conexión al guardar la palabra");
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
            
            <div className="flex gap-4 my-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar palabras..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                
                {/* Modal para agregar palabra */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-sky-500 hover:bg-sky-400"  onClick={handleOpenAddModal}>
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Palabra
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={editingWordId ? handleEditSubmit : handleAddSubmit}>
                            <DialogHeader>
                                <DialogTitle>Agregar Nueva Palabra</DialogTitle>
                                <DialogDescription>
                                    Completa los campos para agregar una nueva palabra al diccionario.
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categorías
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(category => (
                                            <button
                                                key={category.id}
                                                type="button"
                                                onClick={() => handleCategoryToggle(category.id)}
                                                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                                    newWord.category_ids.includes(category.id)
                                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
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

            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Gestión de Palabras y Ejemplos</h1>
                
                <div className="space-y-4">
                    {filteredWords.map((word) => {
                    const isExpanded = expandedWords.has(word.id);
                    
                    return (
                        <div key={word.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Fila principal de la palabra */}
                        <div className="bg-white p-4">
                            <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                                <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleWordExpansion(word.id)}
                                className="p-1"
                                >
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                                </Button>
                                
                                <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-lg">{word.word}</span>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {word.examples?.length} ejemplo{word.examples?.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mt-1">{word.meaning}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                {/* <Button variant="secondary" size="sm">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(word.id)}>
                                    <Trash className="h-4 w-4" />
                                </Button> */}

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

                            </div>
                            </div>
                        </div>

                        {/* Sección de ejemplos expandible */}
                        {isExpanded && (
                            <div className="bg-gray-50 border-t border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Ejemplos de uso
                                </h4>
                                
                                <Dialog open={isExampleModalOpen} onOpenChange={setIsExampleModalOpen}>
                                <DialogTrigger asChild>
                                    <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleAddExample(word.id)}
                                    >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Agregar Ejemplo
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
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

                            {word.examples?.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No hay ejemplos para esta palabra</p>
                                <p className="text-sm">Agrega el primer ejemplo de uso</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                {word.examples?.map((example) => (
                                    <div 
                                    key={example.id} 
                                    className="bg-white p-3 rounded border border-gray-200 flex items-start justify-between group hover:shadow-sm transition-shadow"
                                    >
                                    <div className="flex-1">
                                        <p className="text-gray-700 italic">"{example.text}"</p>
                                    </div>
                                    
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-3">
                                        <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditExample(word.id, example)}
                                        className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                                        >
                                        <Pencil className="h-3 w-3" />
                                        </Button>
                                        
                                        <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                                            >
                                            <Trash className="h-3 w-3" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>¿Eliminar ejemplo?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Estás a punto de eliminar este ejemplo: <br />
                                                <em>"{example.text}"</em><br />
                                                Esta acción no se puede deshacer.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDeleteExample(word.id, example.id)}
                                                className="bg-destructive text-white hover:bg-destructive/90"
                                            >
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
            </div>
        </>
    )
}