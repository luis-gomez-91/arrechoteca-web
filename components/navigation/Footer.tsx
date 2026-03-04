import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-border bg-card mt-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <div className="space-y-3">
                        <Link href="/" className="inline-block font-semibold text-foreground hover:text-primary transition-colors">
                            La Caleta del Verbo
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
                            Diccionario de la jerga guayaca. Palabras y expresiones de Guayaquil.
                        </p>
                    </div>
                </div>
                <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <span>© {new Date().getFullYear()} La Caleta del Verbo</span>
                    <span className="text-muted-foreground">
                        Guayaquil - Ecuador
                    </span>
                </div>
            </div>
        </footer>
    );
}