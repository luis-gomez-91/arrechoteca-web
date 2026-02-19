import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="text-center space-y-6">
                    
                    {/* Logo y descripción */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <h3 className="text-3xl font-black bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
                                Arrechoteca
                            </h3>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
                                <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-400"></div>
                            </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto text-lg">
                            La biblioteca digital más arrecha de la jerga guayaca. Aquí vive nuestro palabreo con todo el sabor costeño que nos identifica.
                        </p>
                    </div>

                    {/* Redes sociales */}
                    <div className="flex justify-center gap-6">
                        {/* Instagram */}
                        <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 p-4 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.755-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                            </svg>
                        </button>

                        {/* Facebook */}
                        <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </button>

                        {/* TikTok */}
                        <button className="bg-gray-900 hover:bg-black p-4 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                        </button>
                    </div>
                    
                    {/* Copyright */}
                    <div className="pt-8 border-t border-gray-700">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-gray-400 text-sm">
                            <span>© 2024 Arrechoteca</span>
                            <span className="hidden md:inline">•</span>
                            <span>Hecho con ❤️ en Guayaquil</span>
                            <span className="hidden md:inline">•</span>
                            <span className="flex items-center gap-1">
                                <span>Orgullosamente</span>
                                <div className="flex gap-0.5">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                                    <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                                </div>
                                <span>Guayaco</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}