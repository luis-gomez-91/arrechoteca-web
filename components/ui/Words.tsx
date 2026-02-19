"use client";
import { useEffect, useState } from 'react'
import { fetchWords } from "@/lib/data/fetchWords";
import WordCard from './WordCard';
import { Skeleton } from "@/components/ui/skeleton"
import { Word } from '@/types/word';
import { Search } from 'lucide-react';

export default function Words() {
    const [words, setWords] = useState<Word[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false)

    const filteredWords = words.filter(word => 
        word.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        loadWords();
    }, []);

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

    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                ))}
            </div>
        )
    } else {
        return (
            <div className='flex flex-col gap-3 py-7 w-full lg:w-[1000]'>
                
                <div className="flex gap-4">
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
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                    Palabras ({filteredWords.length})
                </h2>
                <div className='flex flex-col gap-3'>
                    {
                        filteredWords.map((word) => (
                            <div key={word.id} className="relative">
                                <WordCard
                                    word={word}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}