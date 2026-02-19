"use client";

import { useState } from 'react';
import { Menu, X, User, ChevronDown, LogOut, Shield } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// Tu email de administrador - agrega esto a tu .env.local
const admmin_email = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',');

const Nav = () => {
    const [activeItem, setActiveItem] = useState('Inicio');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    
    const { user, loading, signInWithGoogle, signOut } = useAuth();
    
    // Verificar si el usuario actual es admin
    const isAdmin = user ? admmin_email.includes(user.email) : false;

    
    const navItems = [
        { name: 'Jerga Guayaca', href: '/palabras' },
        { name: 'Ricas puteadas', href: '/puteadas' },
        { name: 'Guayaco que se respeta', href: '/guayaco' }
    ];

    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setUserMenuOpen(false);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const handleAdminClick = () => {
        // Por ahora no hace nada, pero aquí puedes agregar la lógica admin
        console.log('Acceso admin clickeado');
        setUserMenuOpen(false);
    };

    // Componente de botón de login/user
    const AuthButton = () => {
        if (loading) {
            return (
                <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
            );
        }

        if (user) {
            return (
                <div className="relative">
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                    >
                        {user.user_metadata?.avatar_url ? (
                            <img 
                                src={user.user_metadata?.avatar_url} 
                                alt="Avatar" 
                                className="w-6 h-6 rounded-full"
                            />
                        ) : (
                            <User className="w-5 h-5 text-white" />
                        )}
                        <span className="text-white text-sm font-medium hidden md:block">
                            {user.user_metadata?.full_name || user.email}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown menu */}
                    {userMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">
                                    {user.user_metadata?.full_name || 'Usuario'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user.email}
                                    {isAdmin && (
                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Admin
                                        </span>
                                    )}
                                </p>
                            </div>
                            
                            {/* Opción Admin - Solo visible para admin */}
                            {isAdmin && (
                                <Link
                                    // onClick={handleAdminClick}
                                    href="/admin/words" 
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <Shield className="w-4 h-4" />
                                    Administrador
                                </Link>
                            )}
                            
                            <Link 
                                href="/perfil" 
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setUserMenuOpen(false)}
                            >
                                <User className="w-4 h-4" />
                                Mi Perfil
                            </Link>
                            
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <button 
                onClick={handleSignIn}
                className="group relative overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                </div>
            </button>
        );
    };

    return (
        <nav className="bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-500 sticky top-0 z-50 shadow-lg backdrop-blur-sm">
            <div className="mx-auto px-4 max-w-[1200px]">
                <div className="flex justify-between items-center py-4">
                    {/* Logo mejorado */}
                    <a href="/" className="flex items-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                        <div className="relative">
                            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg">
                                Arrechoteca
                            </h1>
                            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-orange-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </div>
                        <div className="ml-2 w-2 h-2 bg-amber-300 rounded-full animate-pulse"></div>
                    </a>
                    
                    {/* Desktop Navigation mejorada */}
                    <div className="hidden lg:flex items-center gap-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setActiveItem(item.name)}
                                className={`
                                    relative px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-full
                                    ${activeItem === item.name
                                        ? 'bg-white text-sky-600 shadow-lg scale-105'
                                        : 'text-white hover:bg-white/20 hover:scale-102'
                                    }
                                `}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Button Desktop */}
                    <div className="hidden lg:flex items-center gap-3">
                        <AuthButton />
                    </div>
                    
                    {/* Mobile menu button mejorado */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="relative p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-110"
                            aria-label="Toggle mobile menu"
                        >
                            <div className="relative w-6 h-6">
                                <Menu 
                                    className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                                        mobileMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                                    }`} 
                                />
                                <X 
                                    className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                                        mobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'
                                    }`} 
                                />
                            </div>
                        </button>
                    </div>
                </div>
                
                {/* Mobile Navigation mejorada */}
                <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
                    mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl mx-4 mb-4 border border-white/20 shadow-xl">
                        <div className="p-4 space-y-2">
                            {navItems.map((item, index) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        setActiveItem(item.name);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`
                                        w-full text-left px-4 py-4 rounded-xl font-medium transition-all duration-300 transform
                                        ${activeItem === item.name
                                            ? 'bg-white text-sky-600 shadow-lg scale-105'
                                            : 'text-white hover:bg-white/20 hover:translate-x-2'
                                        }
                                    `}
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animation: mobileMenuOpen ? 'slideInFromRight 0.5s ease-out forwards' : 'none'
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        {item.name}
                                        {activeItem === item.name && (
                                            <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                                        )}
                                    </div>
                                </button>
                            ))}
                            
                            {/* Separador elegante */}
                            <div className="flex items-center justify-center py-4">
                                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-full"></div>
                            </div>
                            
                            {/* Auth Button Mobile */}
                            {user ? (
                                <div className="space-y-2">
                                    <div className="text-xs text-white/80 px-4 flex items-center gap-2">
                                        Hola, {user.user_metadata?.full_name || user.email}
                                        {isAdmin && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Opción Admin en móvil */}
                                    {isAdmin && (
                                        <button 
                                            onClick={handleAdminClick}
                                            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <Shield className="w-5 h-5" />
                                                <span>Panel Admin</span>
                                            </div>
                                        </button>
                                    )}
                                    
                                    <button 
                                        onClick={handleSignOut}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <LogOut className="w-5 h-5" />
                                            <span>Cerrar Sesión</span>
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleSignIn}
                                    className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <User className="w-5 h-5" />
                                        <span>Iniciar Sesión</span>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes slideInFromRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </nav>
    );
};

export default Nav;