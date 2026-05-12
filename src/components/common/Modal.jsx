import React from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={`bg-[#161B22] border border-[rgba(255,255,255,0.08)] rounded-2xl p-7 ${sizes[size]} w-[90vw] max-h-[85vh] overflow-y-auto`}>
                <div className="flex justify-between items-center mb-5">
                    <div className="text-base font-bold">{title}</div>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-none text-[#7D8590] text-lg cursor-pointer p-1 rounded-md transition-colors hover:text-[#E6EDF3]"
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;