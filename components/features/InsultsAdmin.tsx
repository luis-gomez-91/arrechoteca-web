'use client';
import { Loader2, Pencil, Plus, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
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
} from "@/components/ui/alert-dialog"
import { BadWord, NewBadWord } from "@/types/bad_word";
import { fetchBadWords } from "@/lib/data/fetchBadWords";

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


export default function InsultsAdmin() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [, setLoading] = useState<boolean>(false);
    const [badWords, setBadWords] = useState<BadWord[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [editingBadWordId, setEditingBadWordId] = useState<number | null>(null);
    

    const [newBadWord, setNewBadWord] = useState<NewBadWord>({
        insult: '',
        meaning: '',
    });

    const loadBadWords = async () => {
            try {
                setLoading(true)
                const badWordsData: BadWord[] = await fetchBadWords();
                setBadWords(badWordsData);
            } catch {
                
            } finally {
                setLoading(false)
            }    
        };
    
    useEffect(() => {
        loadBadWords();
    }, []);

    const filteredBadWords: BadWord[] = badWords.filter(word => 
            word.insult?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleInputChange = (field: keyof NewBadWord, value: string) => {
        setNewBadWord(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setNewBadWord({
            insult: '',
            meaning: '',
        });
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            const response = await fetch(`${apiUrl}bad_words/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newBadWord),
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ Palabra creada correctamente
                const created = data as BadWord;
                alert("✅ Puteada agregada correctamente");

                // Agregar la nueva palabra al inicio de la lista
                setBadWords((prev) => [created, ...prev]);

                // Cerrar modal y resetear form
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

    const handleOpenAddModal = () => {
        setEditingBadWordId(null);
        resetForm();
        setIsModalOpen(true);
    };


    const handleEdit = (badWord: BadWord) => {
        setEditingBadWordId(badWord.id);
        setNewBadWord({
            insult: badWord.insult,
            meaning: badWord.meaning,
        });
        setIsModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingBadWordId) return;

        try {
            setIsSubmitting(true);

            const response = await fetch(`${apiUrl}bad_words/${editingBadWordId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBadWord),
            });

            const data = await response.json();

            if (response.ok) {
                const updated = data as BadWord;
                alert("✅ Palabra actualizada correctamente");

                setBadWords(prev => prev.map(w => w.id === editingBadWordId ? updated : w));

                resetForm();
                setIsModalOpen(false);
                setEditingBadWordId(null);
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

    return (
        <>
            <div className="flex gap-4 my-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar puteadas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            className="bg-sky-500 hover:bg-sky-400"  
                            onClick={handleOpenAddModal}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Puteada
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form 
                            onSubmit={editingBadWordId ? handleEditSubmit : handleAddSubmit}
                        >
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
                                        value={newBadWord.insult}
                                        onChange={(e) => handleInputChange('insult', e.target.value)}
                                        placeholder="Ej: Hijueputa"
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
                                        value={newBadWord.meaning}
                                        onChange={(e) => handleInputChange('meaning', e.target.value)}
                                        placeholder="Describe el significado de la puteada..."
                                        className="col-span-3 min-h-[80px]"
                                        disabled={isSubmitting}
                                    />
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
                                    disabled={isSubmitting || !newBadWord.insult.trim() || !newBadWord.meaning.trim()}
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>

            <Table>
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
                    {filteredBadWords.map((badWord: BadWord) => (
                        <TableRow key={badWord.id}>
                            <TableCell>{badWord.id}</TableCell>
                            <TableCell>{badWord.insult}</TableCell>
                            <TableCell>{badWord.meaning}</TableCell>
                            <TableCell className="flex gap-2 justify-end">
                                <Button 
                                    variant="secondary" 
                                    onClick={() => {handleEdit(badWord)}} 
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
                                        <AlertDialogTitle>¿Eliminar palabra?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Estás a punto de eliminar <b>{badWord.insult}</b>.  
                                            Esta acción no se puede deshacer.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            // onClick={() => handleDelete(word.id)}
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
            </Table>
        </>
    )
}