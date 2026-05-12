import React from 'react';

const Card = ({ children, title, action, className = '' }) => {
    return (
        <div className={`bg-[#161B22] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between mb-4">
                    {title && <div className="text-sm font-bold">{title}</div>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;