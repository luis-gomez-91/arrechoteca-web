"use client";

import { useEffect, useState } from 'react'
import Card from './WordCard'
import { Plus, Edit2, Trash2, Save, X, Search } from 'lucide-react';

// Mock data temporal
const MOCK_WORDS = [
    { 
        id: 1, 
        word: 'Chévere', 
        meaning: 'Algo que está muy bueno, genial', 
        categories: [{ id: 1, name: 'Expresiones' }],
        example: [{ id: 1, text: 'Esa película estuvo chévere' }]
    },
    { 
        id: 2, 
        word: 'Jevi', 
        meaning: 'Persona muy guapa o atractiva', 
        categories: [{ id: 2, name: 'Personas' }],
        example: [{ id: 1, text: 'Esa chica está jevi' }]
    },
    { 
        id: 3, 
        word: 'Arrecho', 
        meaning: 'Enojado, molesto o también puede ser algo muy bueno', 
        categories: [{ id: 1, name: 'Expresiones' }],
        example: [{ id: 1, text: 'Estoy arrecho contigo' }, { id: 2, text: 'Esa canción está arrecha' }]
    }
];

const MOCK_CATEGORIES = [
    { id: 1, name: 'Expresiones' },
    { id: 2, name: 'Personas' },
    { id: 3, name: 'Comida' },
    { id: 4, name: 'Lugares' }
];

// Configuración de URL con fallback a mock
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const USE_MOCK_DATA = false; // Cambia a false cuando arregles la API

interface Word {
    id: number;
    word: string;
    meaning: string;
    categories?: Category[];
    example?: Example[];
}

interface Category {
    id: number;
    name: string;
}

interface Example {
    id: number;
    text: string;
}

interface FormData {
    word: string;
    meaning: string;
    selectedCategories: number[];
    examples: string[];
}

const Words: React.FC = () => {
    const [words, setWords] = useState<Word[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        word: '',
        meaning: '',
        selectedCategories: [],
        examples: ['']
    });

    // Función para hacer peticiones con mejor manejo de errores
    const apiRequest = async (endpoint: string, options?: RequestInit) => {
        if (USE_MOCK_DATA) {
            throw new Error('Using mock data - API disabled');
        }

        try {
            const url = `${API_BASE_URL}${endpoint}`;
            console.log('Fetching:', url);
            
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    };

    // Fetch words and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                if (USE_MOCK_DATA) {
                    // Simular delay de API
                    await new Promise(resolve => setTimeout(resolve, 500));
                    setWords(MOCK_WORDS);
                    setCategories(MOCK_CATEGORIES);
                    console.log('Using mock data');
                } else {
                    console.log('Fetching data from:', API_BASE_URL);
                    
                    const [wordsResult, categoriesResult] = await Promise.all([
                        apiRequest('/words/?skip=0&limit=100'),
                        apiRequest('/categories/').catch(err => {
                            console.warn('Categories fetch failed:', err);
                            return [];
                        })
                    ]);
                    const items = wordsResult?.items ?? wordsResult ?? [];
                    setWords(Array.isArray(items) ? items : []);
                    setCategories(categoriesResult || []);
                }
                
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos';
                setError(errorMessage);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        }
        
        fetchData()
    }, [])

    const filteredWords = words.filter(word => 
        word.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setIsAdding(true);
        setFormData({ word: '', meaning: '', selectedCategories: [], examples: [''] });
    };

    const handleEdit = (word: Word) => {
        setEditingId(word.id);
        setFormData({
            word: word.word,
            meaning: word.meaning,
            selectedCategories: word.categories?.map(cat => cat.id) || [],
            examples: word.example?.length ? word.example.map(ex => ex.text) : ['']
        });
    };

    const handleSave = async () => {
        try {
            setError(null);
            
            const examplesData = formData.examples
                .filter(ex => ex.trim() !== '')
                .map((text, index) => ({ id: index + 1, text: text.trim() }));

            const wordData = {
                word: formData.word,
                meaning: formData.meaning,
                categories: categories.filter(cat => formData.selectedCategories.includes(cat.id)),
                example: examplesData
            };

            if (USE_MOCK_DATA) {
                // Simular guardado con mock data
                const newId = Math.max(...words.map(w => w.id), 0) + 1;
                const newWord = { ...wordData, id: isAdding ? newId : editingId! };
                
                if (isAdding) {
                    setWords([...words, newWord]);
                } else {
                    setWords(words.map(word => word.id === editingId ? newWord : word));
                }
                
                alert('Palabra guardada (mock data)');
            } else {
                let result: Word;
                if (isAdding) {
                    result = await apiRequest('/words/', {
                        method: 'POST',
                        body: JSON.stringify(wordData)
                    });
                    setWords([...words, result]);
                } else {
                    result = await apiRequest(`/words/${editingId}/`, {
                        method: 'PUT',
                        body: JSON.stringify(wordData)
                    });
                    setWords(words.map(word => word.id === editingId ? result : word));
                }
            }
            
            handleCancel();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al guardar la palabra';
            setError(errorMessage);
            console.error('Error saving word:', err);
        }
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ word: '', meaning: '', selectedCategories: [], examples: [''] });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta palabra?')) return;
        
        try {
            setError(null);
            
            if (USE_MOCK_DATA) {
                setWords(words.filter(word => word.id !== id));
                alert('Palabra eliminada (mock data)');
            } else {
                await apiRequest(`/words/${id}/`, {
                    method: 'DELETE'
                });
                setWords(words.filter(word => word.id !== id));
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la palabra';
            setError(errorMessage);
            console.error('Error deleting word:', err);
        }
    };

    const handleCategoryToggle = (categoryId: number) => {
        setFormData(prev => ({
            ...prev,
            selectedCategories: prev.selectedCategories.includes(categoryId)
                ? prev.selectedCategories.filter(id => id !== categoryId)
                : [...prev.selectedCategories, categoryId]
        }));
    };

    const handleExampleChange = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            examples: prev.examples.map((ex, i) => i === index ? value : ex)
        }));
    };

    const addExample = () => {
        setFormData(prev => ({
            ...prev,
            examples: [...prev.examples, '']
        }));
    };

    const removeExample = (index: number) => {
        setFormData(prev => ({
            ...prev,
            examples: prev.examples.filter((_, i) => i !== index)
        }));
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-gray-500">Cargando palabras...</div>
                    {USE_MOCK_DATA && <div className="text-xs text-green-600 mt-2">Usando datos de ejemplo</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Palabras</h1>
                <p className="text-gray-600">Administra tu vocabulario personal</p>
                {USE_MOCK_DATA && (
                    <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm">
                        ⚠️ Usando datos de ejemplo. Cambia <code>USE_MOCK_DATA = false</code> para conectar a la API.
                    </div>
                )}
                {error && (
                    <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-sm text-red-700">
                        Error: {error}
                    </div>
                )}
            </div>

            {/* Search and Add Button */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar palabras..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Agregar Palabra
                </button>
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {isAdding ? 'Agregar Nueva Palabra' : 'Editar Palabra'}
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Palabra
                            </label>
                            <input
                                type="text"
                                value={formData.word}
                                onChange={(e) => setFormData(prev => ({ ...prev, word: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ingresa la palabra..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Significado
                            </label>
                            <textarea
                                value={formData.meaning}
                                onChange={(e) => setFormData(prev => ({ ...prev, meaning: e.target.value }))}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Describe el significado..."
                            />
                        </div>

                        {/* Categories */}
                        {categories.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categorías
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(category => (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategoryToggle(category.id)}
                                            className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                                formData.selectedCategories.includes(category.id)
                                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Examples */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Ejemplos de uso
                                </label>
                                <button
                                    type="button"
                                    onClick={addExample}
                                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    Agregar ejemplo
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.examples.map((example, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={example}
                                            onChange={(e) => handleExampleChange(index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder={`Ejemplo ${index + 1}...`}
                                        />
                                        {formData.examples.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeExample(index)}
                                                className="px-2 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Guardar
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Words List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                    Palabras ({filteredWords.length})
                </h2>
                
                {filteredWords.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>{searchTerm ? 'No se encontraron palabras que coincidan con tu búsqueda' : 'No hay palabras aún. ¡Agrega la primera!'}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredWords.map(word => (
                            <div key={word.id} className="relative">
                                <Card 
                                    word={word.word} 
                                    meaning={word.meaning} 
                                    categorias={word.categories}
                                    example={word.example}
                                />
                                
                                {/* Action buttons */}
                                <div className="absolute top-4 right-16 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(word)}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(word.id)}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Words;