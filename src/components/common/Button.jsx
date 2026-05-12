import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    className = '',
    icon = null,
    type = 'button'
}) => {
    const variants = {
        primary: 'bg-[#00C853] text-white hover:bg-[#43A047]',
        secondary: 'bg-transparent text-[#E6EDF3] border border-[rgba(255,255,255,0.08)] hover:bg-[#21262D]',
        danger: 'bg-[rgba(255,95,87,0.15)] text-[#FF5F57] border border-[rgba(255,95,87,0.3)] hover:bg-[rgba(255,95,87,0.25)]',
        success: 'bg-[rgba(0,200,83,0.15)] text-[#00C853] border border-[rgba(0,200,83,0.25)] hover:bg-[rgba(0,200,83,0.25)]',
        warning: 'bg-[rgba(255,189,46,0.15)] text-[#FFBD2E] border border-[rgba(255,189,46,0.25)] hover:bg-[rgba(255,189,46,0.25)]',
        whatsapp: 'bg-[rgba(37,211,102,0.15)] text-[#25D366] border border-[rgba(37,211,102,0.25)] hover:bg-[rgba(37,211,102,0.25)]'
    };

    const sizes = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-4 py-2 text-[13px]',
        lg: 'px-6 py-3 text-sm'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center gap-1.5 font-semibold rounded-lg transition-all duration-200
        ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
        ${variant === 'primary' && !disabled ? 'hover:scale-[1.02]' : ''} ${className}`}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
};

export default Button;