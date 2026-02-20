"use client";

import { useState } from 'react';
import { Menu, X, User, ChevronDown, LogOut, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

const Nav = () => {
    const [activeItem, setActiveItem] = useState('Inicio');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    
    const { user, loading, signOut, isAdmin } = useAuth();

    
    const navItems = [
        { name: 'Jerga Guayaca', href: '/palabras' },
        { name: 'Ricas puteadas', href: '/puteadas' },
        { name: 'Guayaco que se respeta', href: '/guayaco' }
    ];

    const handleSignOut = async () => {
        try {
            await signOut();
            setUserMenuOpen(false);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Componente de botón de login/user
    const AuthButton = () => {
        if (loading) {
            return <div className="h-9 w-24 rounded-lg bg-muted animate-pulse" />;
        }

        if (user) {
            return (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
                    >
                        {user.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="" className="w-7 h-7 rounded-full" />
                        ) : (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <User className="w-4 h-4" />
                            </span>
                        )}
                        <span className="text-sm font-medium text-foreground hidden md:block max-w-[120px] truncate">
                            {user.user_metadata?.full_name || user.email}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {userMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-card py-2 z-50">
                            <div className="px-4 py-3 border-b border-border">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {user.user_metadata?.full_name || 'Usuario'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                                    {user.email}
                                    {isAdmin && (
                                        <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-destructive/10 text-destructive">
                                            Admin
                                        </span>
                                    )}
                                </p>
                            </div>
                            {isAdmin && (
                                <Link
                                    href="/admin/words"
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                                    onClick={() => setUserMenuOpen(false)}
                                >
                                    <Shield className="w-4 h-4 text-primary" />
                                    Administrador
                                </Link>
                            )}
                            <Link
                                href="/perfil"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                                onClick={() => setUserMenuOpen(false)}
                            >
                                <User className="w-4 h-4" />
                                Mi Perfil
                            </Link>
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors text-left"
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
            <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
                <User className="w-4 h-4" />
                <span>Iniciar sesión</span>
            </Link>
        );
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-card">
            <div className="mx-auto px-4 max-w-4xl">
                <div className="flex justify-between items-center h-16">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-semibold text-lg text-foreground hover:text-primary transition-colors"
                        onClick={() => setActiveItem('Inicio')}
                    >
                        <Image
                            src="/logo.webp"
                            alt="La Caleta del Verbo"
                            width={36}
                            height={36}
                            className="rounded-md object-contain"
                        />
                        La Caleta del Verbo
                    </Link>

                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setActiveItem(item.name)}
                                className={`
                                    px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
                                    ${activeItem === item.name
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }
                                `}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-2">
                        <AuthButton />
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                        aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                    >
                        <div className="relative w-5 h-5">
                            <Menu className={`w-5 h-5 absolute inset-0 transition-opacity ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                            <X className={`w-5 h-5 absolute inset-0 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                    </button>
                </div>
                
                <div className={`lg:hidden overflow-hidden transition-all duration-200 ${mobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="py-4 border-t border-border bg-card/50 rounded-b-xl">
                        <div className="flex flex-col gap-1 px-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => {
                                        setActiveItem(item.name);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                                        activeItem === item.name ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="my-2 h-px bg-border" />
                            {user ? (
                                <>
                                    {isAdmin && (
                                        <Link
                                            href="/admin/words"
                                            className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Shield className="w-4 h-4 text-primary" />
                                            Administrador
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-destructive hover:bg-destructive/5 w-full text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium bg-primary text-primary-foreground"
                                >
                                    <User className="w-4 h-4" />
                                    Iniciar sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;