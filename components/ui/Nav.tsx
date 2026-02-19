import { useState } from 'react';

const Nav = () => {
    const [activeItem, setActiveItem] = useState('Palabras');
    
    const navItems = [
        { name: 'Palabras', href: '#' },
        { name: 'Insultos', href: '#' },
        { name: 'Guayaco no dice', href: '#' }
    ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 py-4">
                {/* Logo/Title */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            La Caleta del Verbo
                        </h1>
                        <span className="ml-2 text-sm text-gray-500 font-medium">🇪🇨</span>
                    </div>
                    
                    {/* Navigation Links */}
                    <ul className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    href={item.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveItem(item.name);
                                    }}
                                    className={`
                                        relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                                        ${activeItem === item.name 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                        }
                                    `}
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Nav