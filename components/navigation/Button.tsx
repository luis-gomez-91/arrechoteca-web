import { ReactNode } from "react"

interface ButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
}

const Button = ({ children, href, onClick, className = "" }: ButtonProps) => {
    const baseClasses = "rounded-full bg-amber-300 px-5 py-2 text-center inline-block transition-colors hover:text-white";
    
    if (href) {
        return (
            <a 
                href={href} 
                className={`${baseClasses} ${className}`}
            >
                {children}
            </a>
        );
    }
    
    return (
        <button 
            onClick={onClick}
            className={`${baseClasses} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;