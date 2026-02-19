import React from 'react';
import { Sparkles, BookOpen, MessageCircle, Users, Heart, Zap } from 'lucide-react';

export default function Page() {
    return (
        <div className="min-h-full relative overflow-hidden w-full">
            <div className="relative z-10 flex flex-col items-center justify-center min-h-full text-center w-full">
                {/* <div className="max-w-4xl mx-auto text-center min-h-full"> */}
                    
                    <div className="w-full min-h-[calc(100vh-70px)] flex flex-col items-center justify-center gap-5">
                        {/* Header principal con animación */}
                        <div className="space-y-6">
                            <div className="relative inline-block group">
                                <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
                                    Arrechoteca
                                </h1>
                                {/* Las 3 estrellas de la bandera de Guayaquil - Mejor posicionadas */}
                                <div className="absolute -top-8 -right-8 md:-top-12 md:-right-12">
                                    <div className="relative w-20 h-16 md:w-24 md:h-20">
                                        {/* Estrella 1 - Arriba centro */}
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-spin drop-shadow-lg" style={{animationDuration: '4s'}}>
                                            <svg className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                        </div>
                                        {/* Estrella 2 - Abajo derecha */}
                                        <div className="absolute bottom-0 right-0 animate-spin drop-shadow-lg" style={{animationDuration: '3.5s', animationDirection: 'reverse'}}>
                                            <svg className="w-7 h-7 md:w-9 md:h-9 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                        </div>
                                        {/* Estrella 3 - Abajo izquierda */}
                                        <div className="absolute bottom-0 left-0 animate-spin drop-shadow-lg" style={{animationDuration: '5s'}}>
                                            <svg className="w-6 h-6 md:w-8 md:h-8 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                        </div>
                                        {/* Efecto de brillo sutil */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjetas de descripción */}
                        <div className="grid md:grid-cols-1 gap-6 max-w-3xl mx-auto">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md border border-sky-100 transform hover:scale-102 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="bg-gradient-to-r from-sky-500 to-cyan-500 p-3 rounded-full">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-left space-y-3">
                                        <h3 className="text-xl font-bold text-gray-800">¿Qué es Arrechoteca?</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            El rincón digital donde vive la jerga guayaca en todo su esplendor: desde las frases típicas del guayaco que se respeta, hasta las puteadas más sabrosas que usamos para desahogarnos o joder a los panas.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md border border-cyan-100 transform hover:scale-102 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-full">
                                        <MessageCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-left space-y-3">
                                        <h3 className="text-xl font-bold text-gray-800">Más que significados</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Aquí no solo encuentras significados, también ejemplos reales, contextos y hasta la chance de comentar cómo usarías cada insulto o expresión, porque en Guayaquil no hablamos, <span className="font-semibold text-sky-600">tiramos labia</span>.
                                        </p>
                                        <p>
                                            No es un diccionario aburrido: es una biblioteca arrecha de cultura popular guayaca, con humor, picardía y ese <span className="font-semibold text-cyan-600">sabor costeño</span> que nos define.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md border border-blue-100 transform hover:scale-102 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-3 rounded-full">
                                        <Heart className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-left space-y-3">
                                        <h3 className="text-xl font-bold text-gray-800">Cultura popular guayaca</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            No es un diccionario aburrido: es una biblioteca arrecha de cultura popular guayaca, con humor, picardía y ese <span className="font-semibold text-cyan-600">sabor costeño</span> que nos define.
                                        </p>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    
                    <div className='min-h-[calc(100vh-70px)] flex flex-col justify-center items-center w-full bg-gradient-to-b from-slate-100 via-cyan-50 to-sky-200'>                    
                        {/* Características destacadas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-12">
                            <div className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white p-4 rounded-xl text-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                                <Users className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm font-semibold">Test Guayaco</p>
                            </div>
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-xl text-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                                <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm font-semibold">Comenta</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-500 to-sky-500 text-white p-4 rounded-xl text-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm font-semibold">Diccionario</p>
                            </div>
                            <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white p-4 rounded-xl text-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                                <Zap className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm font-semibold">Puteadas</p>
                            </div>
                        </div>

                        {/* Call to action */}
                        <div className="mt-12 space-y-6">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-4 rounded-full font-bold text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Explorar Jerga
                                    </span>
                                </button>
                                
                                <button className="group bg-white/80 backdrop-blur-sm border-2 border-sky-500 text-sky-600 px-8 py-4 rounded-full font-bold hover:bg-sky-500 hover:text-white transform hover:scale-105 transition-all duration-300">
                                    <span className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Unirse a la Comunidad
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    );
}