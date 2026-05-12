import React from 'react';

const Topbar = ({ title, onBlastClick }) => {
    return (
        <div className="px-6 h-[58px] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between flex-shrink-0 bg-[#161B22]">
            <div className="text-base font-bold">{title}</div>
            <div className="flex items-center gap-3">
                <button
                    onClick={onBlastClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-[#00C853] text-white hover:bg-[#43A047] transition-transform hover:-translate-y-[1px]"
                >
                    📤 Buat Blast
                </button>
                <div className="w-8 h-8 rounded-full bg-[#43A047] flex items-center justify-center text-xs font-bold text-white">
                    AS
                </div>
            </div>
        </div>
    );
};

export default Topbar;