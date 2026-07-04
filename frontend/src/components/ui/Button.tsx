import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger" | "ghost";
}

export const Button = ({ children, variant = "primary", className = "", ...props }: ButtonProps) => {
    const baseStyles = "focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center transition-all flex items-center justify-center gap-2";
    
    const variants = {
        primary: "text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300",
        secondary: "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100",
        danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300",
        ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    };

    return (
        <button 
            type="button" 
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
