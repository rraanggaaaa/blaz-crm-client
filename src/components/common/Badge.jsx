import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-[#21262D] text-[#7D8590]',
        success: 'bg-[rgba(0,200,83,0.15)] text-[#00C853]',
        warning: 'bg-[rgba(255,189,46,0.15)] text-[#FFBD2E]',
        danger: 'bg-[rgba(255,95,87,0.15)] text-[#FF5F57]',
        info: 'bg-[rgba(88,166,255,0.15)] text-[#58A6FF]',
        active: 'bg-[rgba(0,200,83,0.15)] text-[#00C853]',
        inactive: 'bg-[#21262D] text-[#7D8590]'
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;