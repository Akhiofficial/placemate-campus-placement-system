import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98]";

    const variants = {
        primary: "bg-primary text-foreground-inverted hover:bg-primary-hover shadow-md shadow-primary/20",
        outline: "border border-border bg-background text-foreground hover:bg-background-muted",
        ghost: "text-primary hover:bg-primary/10"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
