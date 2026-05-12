import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children, activePage, onNavigate, onBlastClick, waConnected }) => {
    const pageTitles = {
        dashboard: 'Dashboard',
        connect: 'Koneksi WhatsApp',
        blast: 'WA Blast',
        blastlog: 'Riwayat Blast',
        contacts: 'Kontak',
        pipeline: 'Pipeline',
        analytics: 'Analytics',
        settings: 'Pengaturan'
    };

    return (
        <div className="flex h-screen overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] bg-[#0D1117] text-[#E6EDF3]">
            <Sidebar
                activePage={activePage}
                onNavigate={onNavigate}
                waConnected={waConnected}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Topbar
                    title={pageTitles[activePage]}
                    onBlastClick={onBlastClick}
                />
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;