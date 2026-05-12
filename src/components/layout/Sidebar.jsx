import React from 'react';

const Sidebar = ({ activePage, onNavigate, waConnected }) => {
    const navItems = [
        { icon: '📊', label: 'Dashboard', page: 'dashboard', section: 'Utama' },
        { icon: '🏗️', label: 'Pipeline', page: 'pipeline', section: 'Utama' },
        { icon: '👥', label: 'Kontak', page: 'contacts', section: 'Utama' },
        { icon: '📱', label: 'Koneksi WA', page: 'connect', section: 'WhatsApp' },
        { icon: '📤', label: 'WA Blast', page: 'blast', section: 'WhatsApp' },
        { icon: '📋', label: 'Riwayat Blast', page: 'blastlog', section: 'WhatsApp' },
        { icon: '📈', label: 'Analytics', page: 'analytics', section: 'Laporan' },
        { icon: '⚙️', label: 'Pengaturan', page: 'settings', section: 'Laporan' }
    ];

    let currentSection = '';
    const navElements = [];

    navItems.forEach((item, idx) => {
        if (item.section !== currentSection) {
            currentSection = item.section;
            navElements.push(
                <div key={`section-${idx}`} className="text-[10px] font-bold tracking-[1.5px] text-[#7D8590] px-3 pt-[14px] pb-1.5 uppercase">
                    {currentSection}
                </div>
            );
        }
        navElements.push(
            <div
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13px] font-medium cursor-pointer transition-all duration-150 ${activePage === item.page
                        ? 'bg-[rgba(0,200,83,0.12)] text-[#00C853] font-bold'
                        : 'text-[#7D8590] hover:bg-[#21262D] hover:text-[#E6EDF3]'
                    }`}
            >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
            </div>
        );
    });

    return (
        <aside className="w-[220px] min-w-[220px] bg-[#161B22] border-r border-[rgba(255,255,255,0.08)] flex flex-col">
            <div className="px-[18px] pt-5 pb-4 border-b border-[rgba(255,255,255,0.08)] text-lg font-extrabold">
                Blaz<span className="text-[#00C853]">CRM</span>
            </div>
            <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5">
                {navElements}
            </nav>
            <div className="p-3 border-t border-[rgba(255,255,255,0.08)]">
                <div
                    onClick={() => onNavigate('connect')}
                    className="flex items-center gap-2 p-2.5 rounded-[10px] bg-[#21262D] border border-[rgba(255,255,255,0.08)] cursor-pointer transition-colors hover:border-[#00C853]"
                >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${waConnected ? 'bg-[#00C853] shadow-[0_0_6px_#00C853] animate-pulse' : 'bg-[#FF5F57]'}`}></div>
                    <div>
                        <div className="text-xs font-semibold">{waConnected ? 'Terhubung' : 'Terputus'}</div>
                        <div className="text-[10px] text-[#7D8590]">{waConnected ? '+62 812-3456-7890' : 'Klik untuk koneksi'}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;