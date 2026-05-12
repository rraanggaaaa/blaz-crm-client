import React, { useState, useEffect, useCallback } from 'react';
import {
    getDashboardStats,
    getRecentDeals,
    getContacts,
    getDealsByStage,
    getBlasts
} from '../services/api';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';

const DashboardPage = () => {
    // Navigation State
    const [activePage, setActivePage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Check screen size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Dashboard Data State
    const [stats, setStats] = useState({
        revenue: 0,
        activeDeals: 0,
        totalBlastSent: 0,
        avgOpenRate: 0
    });
    const [recentDeals, setRecentDeals] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [dealsByStage, setDealsByStage] = useState({});
    const [blastHistory, setBlastHistory] = useState([]);

    // WhatsApp Connection State
    const [waConnected, setWaConnected] = useState(false);
    const [qrGrid, setQrGrid] = useState([]);

    // Blast State
    const [blastRunning, setBlastRunning] = useState(false);
    const [blastCurrent, setBlastCurrent] = useState(0);
    const [blastInterval, setBlastInterval] = useState(null);
    const [blastName, setBlastName] = useState('');
    const [blastGroup, setBlastGroup] = useState(0);
    const [blastTemplate, setBlastTemplate] = useState(`Halo {{Nama}}! 👋

Promo spesial bulan ini untuk kamu di {{Kota}}!
Dapatkan *diskon 30%* untuk semua produk kami.

Berlaku hingga 31 Mei 2025. Jangan sampai kehabisan! 🔥

Balas pesan ini untuk info lebih lanjut.`);

    // UI State
    const [contactFilter, setContactFilter] = useState('');
    const [selectedAll, setSelectedAll] = useState(false);

    // Modal State
    const [modals, setModals] = useState({
        import: false,
        addContact: false,
        addDeal: false,
        preview: false,
    });

    // Toast State
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3200);
    };

    const openModal = (id) => setModals(prev => ({ ...prev, [id]: true }));
    const closeModal = (id) => setModals(prev => ({ ...prev, [id]: false }));

    // Fetch Dashboard Data from API
    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const [statsRes, recentDealsRes, contactsRes, dealsStageRes, blastsRes] = await Promise.all([
                getDashboardStats(),
                getRecentDeals(),
                getContacts(),
                getDealsByStage(),
                getBlasts()
            ]);

            setStats(statsRes.data);
            setRecentDeals(recentDealsRes.data || []);
            setContacts(contactsRes.data || []);
            setDealsByStage(dealsStageRes.data || {});
            setBlastHistory(blastsRes.data || []);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message);
            showToast('Gagal memuat data dashboard', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    // Generate QR Code
    const generateQR = useCallback(() => {
        const size = 10;
        const grid = [];
        for (let i = 0; i < size * size; i++) {
            const row = Math.floor(i / size);
            const col = i % size;
            const isCorner = (row < 3 && col < 3) || (row < 3 && col >= 7) || (row >= 7 && col < 3);
            grid.push(isCorner ? '#fff' : (Math.random() > 0.45 ? '#fff' : 'transparent'));
        }
        setQrGrid(grid);
    }, []);

    useEffect(() => {
        fetchDashboardData();
        generateQR();
        const interval = setInterval(generateQR, 20000);
        return () => {
            clearInterval(interval);
            if (blastInterval) clearInterval(blastInterval);
        };
    }, [fetchDashboardData, generateQR, blastInterval]);

    // QR Functions
    const refreshQR = () => {
        generateQR();
        showToast('🔄 QR diperbarui!', 'info');
    };

    const simulateConnect = () => {
        setWaConnected(true);
        showToast('✅ WhatsApp berhasil terhubung!', 'success');
    };

    const disconnectWA = () => {
        setWaConnected(false);
        generateQR();
        showToast('⚠️ WhatsApp terputus', 'info');
    };

    // Blast Functions
    const getTargetCount = () => {
        const groupCounts = [contacts.length, 543, 289, 124, 78];
        return groupCounts[blastGroup] || 0;
    };

    const startBlast = () => {
        if (!waConnected) {
            showToast('⚠️ Hubungkan WhatsApp dulu!', 'info');
            return;
        }
        if (blastRunning) return;
        const name = blastName || 'Blast Baru';
        setBlastRunning(true);
        setBlastCurrent(0);
        showToast('🚀 Blast dimulai: ' + name, 'success');

        const targetTotal = getTargetCount();
        const interval = setInterval(() => {
            setBlastCurrent(prev => {
                let newCurrent = prev + Math.floor(Math.random() * 8) + 3;
                if (newCurrent >= targetTotal) {
                    clearInterval(interval);
                    setBlastRunning(false);
                    showToast('✅ Blast selesai! ' + targetTotal + ' pesan terkirim', 'success');
                    return targetTotal;
                }
                return newCurrent;
            });
        }, 300);
        setBlastInterval(interval);
    };

    const stopBlast = () => {
        if (blastInterval) {
            clearInterval(blastInterval);
            setBlastInterval(null);
        }
        setBlastRunning(false);
        showToast('⏹ Blast dihentikan', 'info');
    };

    // Contact Functions
    const filteredContacts = (contacts || []).filter(c =>
        c.name?.toLowerCase().includes(contactFilter.toLowerCase()) ||
        c.phone?.includes(contactFilter) ||
        c.city?.toLowerCase().includes(contactFilter.toLowerCase())
    );

    const addContact = () => {
        closeModal('addContact');
        showToast('✅ Kontak baru ditambahkan!', 'success');
        fetchDashboardData();
    };

    const selectAllContacts = (e) => {
        const isChecked = e.target.checked;
        setSelectedAll(isChecked);
    };

    // File Upload Handlers
    const handleFileUpload = (event) => {
        if (event.target.files[0]) {
            showToast('📄 File "' + event.target.files[0].name + '" siap diimport', 'info');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag');
        const file = e.dataTransfer.files[0];
        if (file) showToast('📄 File "' + file.name + '" siap diimport', 'info');
    };

    // Template Variables
    const insertVar = (v) => {
        const textarea = document.getElementById('blast-template');
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = blastTemplate.slice(0, start) + v + blastTemplate.slice(end);
            setBlastTemplate(newValue);
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + v.length, start + v.length);
            }, 0);
        }
    };

    const getPreviewText = () => {
        return blastTemplate
            .replace(/{{Nama}}/g, '<strong>Budi</strong>')
            .replace(/{{Kota}}/g, '<strong>Jakarta</strong>')
            .replace(/{{Produk}}/g, '<strong>Paket Pro</strong>')
            .replace(/{{Harga}}/g, '<strong>Rp 299.000</strong>')
            .replace(/{{Tanggal}}/g, '<strong>31 Mei 2025</strong>')
            .replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    };

    const previewBlast = () => {
        openModal('preview');
    };

    // Group Data
    const groupNames = [
        `Semua Kontak (${contacts.length})`,
        'Pelanggan Aktif (543)',
        'Leads Baru (289)',
        'Follow-up Juni (124)',
        'VIP Customer (78)'
    ];

    const handleGroupChange = (e) => {
        setBlastGroup(parseInt(e.target.value));
    };

    const getEstimatedTime = () => {
        const mins = Math.round(getTargetCount() * 5 / 60);
        return mins > 60 ? `~${Math.floor(mins / 60)} jam ${mins % 60} menit` : `~${mins} menit`;
    };

    // Chart Data
    const revenueData = [42, 58, 71, 63, 88, 79, 95];
    const blastChartData = [2400, 3100, 5200, 4800, stats.totalBlastSent || 12480];

    // CSS Variables
    const cssVariables = {
        '--bg': '#0D1117',
        '--bg2': '#161B22',
        '--bg3': '#21262D',
        '--bg4': '#30363D',
        '--text': '#E6EDF3',
        '--muted': '#7D8590',
        '--green': '#10B981',
        '--green2': '#059669',
        '--greenp': 'rgba(16,185,129,0.12)',
        '--wa': '#25D366',
        '--border': 'rgba(255,255,255,0.08)',
        '--warn': '#F59E0B',
        '--red': '#EF4444',
        '--blue': '#3B82F6',
        '--purple': '#8B5CF6',
        '--r': '12px',
        '--rl': '20px',
    };

    return (
        <div className="flex h-screen overflow-hidden font-['Inter',sans-serif]" style={{ ...cssVariables, background: 'var(--bg)', color: 'var(--text)' }}>

            {/* Overlay for mobile */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR - Responsive with Collapse */}
            <aside
                className={`fixed lg:relative z-50 h-full bg-[var(--bg2)] border-r border-[var(--border)] flex flex-col transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'left-0 w-[260px]' : '-left-[260px] lg:left-0 lg:w-[72px]'}`}
            >
                <div className={`px-5 pt-6 pb-5 border-b border-[var(--border)] flex items-center justify-between ${!sidebarOpen && 'lg:justify-center'}`}>
                    {sidebarOpen ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-[var(--green)] to-[var(--green2)] rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-sm">B</span>
                            </div>
                            <div className="text-xl font-bold tracking-tight">
                                Blaz<span className="text-[var(--green)]">CRM</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--green)] to-[var(--green2)] rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">B</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:block hidden text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
                    <div className={`text-[11px] font-semibold text-[var(--muted)] px-3 pb-2 uppercase tracking-wider ${!sidebarOpen && 'lg:hidden'}`}>Main Menu</div>
                    {[
                        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
                        { id: 'pipeline', icon: '🏗️', label: 'Pipeline' },
                        { id: 'contacts', icon: '👥', label: 'Contacts' },
                    ].map(item => (
                        <div
                            key={item.id}
                            onClick={() => {
                                setActivePage(item.id);
                                if (isMobile) setSidebarOpen(false);
                            }}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium cursor-pointer transition-all duration-200 ${activePage === item.id
                                ? 'bg-[var(--greenp)] text-[var(--green)]'
                                : 'text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
                                } ${!sidebarOpen && 'lg:justify-center'}`}
                            title={!sidebarOpen ? item.label : ''}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                            {activePage === item.id && sidebarOpen && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--green)]"></div>
                            )}
                        </div>
                    ))}

                    <div className={`text-[11px] font-semibold text-[var(--muted)] px-3 pt-4 pb-2 uppercase tracking-wider ${!sidebarOpen && 'lg:hidden'}`}>WhatsApp</div>
                    {[
                        { id: 'connect', icon: '📱', label: 'Connect Device' },
                        { id: 'blast', icon: '📤', label: 'Broadcast' },
                        { id: 'blastlog', icon: '📋', label: 'History' },
                    ].map(item => (
                        <div
                            key={item.id}
                            onClick={() => {
                                setActivePage(item.id);
                                if (isMobile) setSidebarOpen(false);
                            }}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium cursor-pointer transition-all duration-200 ${activePage === item.id
                                ? 'bg-[var(--greenp)] text-[var(--green)]'
                                : 'text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
                                } ${!sidebarOpen && 'lg:justify-center'}`}
                            title={!sidebarOpen ? item.label : ''}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </div>
                    ))}

                    <div className={`text-[11px] font-semibold text-[var(--muted)] px-3 pt-4 pb-2 uppercase tracking-wider ${!sidebarOpen && 'lg:hidden'}`}>Analytics</div>
                    {[
                        { id: 'analytics', icon: '📈', label: 'Reports' },
                        { id: 'settings', icon: '⚙️', label: 'Settings' },
                    ].map(item => (
                        <div
                            key={item.id}
                            onClick={() => {
                                setActivePage(item.id);
                                if (isMobile) setSidebarOpen(false);
                            }}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium cursor-pointer transition-all duration-200 ${activePage === item.id
                                ? 'bg-[var(--greenp)] text-[var(--green)]'
                                : 'text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
                                } ${!sidebarOpen && 'lg:justify-center'}`}
                            title={!sidebarOpen ? item.label : ''}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </div>
                    ))}
                </nav>

                <div className={`p-3 m-3 rounded-xl bg-[var(--bg3)] border border-[var(--border)] ${!sidebarOpen && 'lg:p-2'}`}>
                    <div
                        onClick={() => {
                            setActivePage('connect');
                            if (isMobile) setSidebarOpen(false);
                        }}
                        className={`flex items-center gap-3 cursor-pointer ${!sidebarOpen && 'lg:justify-center'}`}
                        title={!sidebarOpen ? (waConnected ? 'Connected' : 'Disconnected') : ''}
                    >
                        <div className={`w-2.5 h-2.5 rounded-full ${waConnected ? 'bg-[var(--green)] shadow-glow' : 'bg-[var(--red)]'}`}></div>
                        {sidebarOpen && (
                            <>
                                <div className="flex-1">
                                    <div className="text-xs font-semibold">{waConnected ? 'Connected' : 'Disconnected'}</div>
                                    <div className="text-[10px] text-[var(--muted)]">{waConnected ? '+62 812-3456-7890' : 'Click to connect'}</div>
                                </div>
                                <div className="text-[var(--muted)] text-sm">→</div>
                            </>
                        )}
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg)]">
                {/* Top Bar - Responsive */}
                <div className="px-4 md:px-6 h-[60px] md:h-[64px] border-b border-[var(--border)] flex items-center justify-between flex-shrink-0 bg-[var(--bg2)]/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden text-[var(--muted)] hover:text-[var(--text)] transition-colors text-xl"
                        >
                            ☰
                        </button>
                        <div>
                            <h1 className="text-base md:text-lg font-semibold">{pageTitles[activePage]}</h1>
                            <p className="text-xs text-[var(--muted)] mt-0.5 hidden sm:block">Welcome back, Admin</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={() => setActivePage('blast')}
                            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-semibold bg-gradient-to-r from-[var(--green)] to-[var(--green2)] text-white hover:shadow-lg hover:shadow-green-500/20 transition-all duration-200"
                        >
                            <span>📤</span>
                            <span className="hidden sm:inline">New Broadcast</span>
                            <span className="sm:hidden">Broadcast</span>
                        </button>
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--green2)] flex items-center justify-center text-xs md:text-sm font-bold text-white shadow-lg">
                            AD
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                    {/* TOAST */}
                    {toast.show && (
                        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-[var(--bg2)] border border-[var(--border)] rounded-xl px-3 py-2 md:px-4 md:py-3 shadow-xl animate-slide-in">
                            <p className={`text-xs md:text-sm font-medium ${toast.type === 'success' ? 'text-[var(--green)]' : toast.type === 'error' ? 'text-[var(--red)]' : 'text-[var(--blue)]'}`}>
                                {toast.message}
                            </p>
                        </div>
                    )}

                    {/* LOADING STATE */}
                    {loading && activePage === 'dashboard' && (
                        <div className="flex items-center justify-center h-64 md:h-96">
                            <div className="text-center">
                                <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-[var(--border)] border-t-[var(--green)] rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-xs md:text-sm text-[var(--muted)]">Loading dashboard data...</p>
                            </div>
                        </div>
                    )}

                    {/* ERROR STATE */}
                    {error && activePage === 'dashboard' && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl md:rounded-2xl p-6 md:p-8 text-center">
                            <p className="text-sm md:text-base text-[var(--red)] mb-4">⚠️ {error}</p>
                            <button onClick={fetchDashboardData} className="px-3 py-1.5 md:px-4 md:py-2 bg-[var(--green)] text-white rounded-lg md:rounded-xl text-xs md:text-sm font-medium">
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* DASHBOARD PAGE - Responsive Grid */}
                    <div className={activePage === 'dashboard' ? 'space-y-4 md:space-y-6' : 'hidden'}>
                        {/* Stats Grid - Responsive: 1 col on mobile, 2 col on tablet, 4 col on desktop */}

                        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400">
                                © 2026 BlazCRM. All rights reserved. Deployed by Rangga
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-5 hover:border-[var(--green)]/30 transition-all duration-200">
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <span className="text-xl md:text-2xl">💰</span>
                                    <span className="text-[10px] md:text-xs text-[var(--green)] bg-[var(--greenp)] px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">+23%</span>
                                </div>
                                <div className="text-xl md:text-2xl font-bold text-[var(--green)]">{formatCurrency(stats.revenue)}</div>
                                <div className="text-[10px] md:text-xs text-[var(--muted)] mt-1">Total Revenue</div>
                            </div>
                            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-5 hover:border-[var(--green)]/30 transition-all duration-200">
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <span className="text-xl md:text-2xl">🤝</span>
                                    <span className="text-[10px] md:text-xs text-[var(--green)] bg-[var(--greenp)] px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">+8</span>
                                </div>
                                <div className="text-2xl md:text-3xl font-bold">{stats.activeDeals}</div>
                                <div className="text-[10px] md:text-xs text-[var(--muted)] mt-1">Active Deals</div>
                            </div>
                            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-5 hover:border-[var(--green)]/30 transition-all duration-200">
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <span className="text-xl md:text-2xl">📨</span>
                                    <span className="text-[10px] md:text-xs text-[var(--green)] bg-[var(--greenp)] px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">+12%</span>
                                </div>
                                <div className="text-2xl md:text-3xl font-bold text-[var(--blue)]">{formatNumber(stats.totalBlastSent)}</div>
                                <div className="text-[10px] md:text-xs text-[var(--muted)] mt-1">Messages Sent</div>
                            </div>
                            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-5 hover:border-[var(--green)]/30 transition-all duration-200">
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <span className="text-xl md:text-2xl">📊</span>
                                    <span className="text-[10px] md:text-xs text-[var(--green)] bg-[var(--greenp)] px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">+2.1%</span>
                                </div>
                                <div className="text-2xl md:text-3xl font-bold text-[var(--warn)]">{stats.avgOpenRate}%</div>
                                <div className="text-[10px] md:text-xs text-[var(--muted)] mt-1">Open Rate</div>
                            </div>
                        </div>

                        {/* Charts Row - Responsive: 1 col on mobile, 2 col on desktop */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm md:text-base font-semibold">Active Blasts</h3>
                                    <button onClick={() => setActivePage('blast')} className="text-xs text-[var(--green)] hover:underline">+ Create</button>
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    {recentDeals.slice(0, 3).map((deal, idx) => (
                                        <div key={idx} className="flex items-center justify-between flex-wrap gap-2">
                                            <div className="flex-1 min-w-[120px]">
                                                <p className="font-medium text-xs md:text-sm">{deal.company_name || 'Unknown'}</p>
                                                <p className="text-[10px] md:text-xs text-[var(--muted)]">{deal.pic_name || 'No PIC'}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] md:text-xs text-[var(--green)]">{formatCurrency(deal.value || 0)}</span>
                                                <div className="w-20 md:w-24 h-1.5 bg-[var(--bg3)] rounded-full mt-1 overflow-hidden">
                                                    <div className="h-full bg-[var(--green)] rounded-full" style={{ width: `${Math.floor(Math.random() * 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-5">
                                <h3 className="text-sm md:text-base font-semibold mb-4">Weekly Revenue</h3>
                                <div className="flex items-end gap-1 md:gap-2 h-24 md:h-32">
                                    {revenueData.map((v, i) => {
                                        const max = Math.max(...revenueData);
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1 md:gap-2">
                                                <div
                                                    className="w-full bg-gradient-to-t from-[var(--green)] to-[var(--green2)] rounded-lg transition-all hover:opacity-80"
                                                    style={{ height: `${Math.max(15, (v / max) * 100)}px` }}
                                                ></div>
                                                <span className="text-[8px] md:text-[10px] text-[var(--muted)]">{i + 1}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Recent Deals Table - Responsive */}
                        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl overflow-hidden">
                            <div className="px-4 md:px-5 py-3 md:py-4 border-b border-[var(--border)] flex items-center justify-between flex-wrap gap-2">
                                <h3 className="text-sm md:text-base font-semibold">Recent Deals</h3>
                                <button onClick={() => setActivePage('pipeline')} className="text-xs text-[var(--green)] hover:underline">View All →</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[500px]">
                                    <thead className="bg-[var(--bg3)]">
                                        <tr className="text-[10px] md:text-xs font-medium text-[var(--muted)]">
                                            <th className="px-3 md:px-5 py-2 md:py-3 text-left">Company</th>
                                            <th className="px-3 md:px-5 py-2 md:py-3 text-left hidden sm:table-cell">PIC</th>
                                            <th className="px-3 md:px-5 py-2 md:py-3 text-left">Value</th>
                                            <th className="px-3 md:px-5 py-2 md:py-3 text-left hidden lg:table-cell">Stage</th>
                                            <th className="px-3 md:px-5 py-2 md:py-3 text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentDeals.slice(0, 5).map((deal, idx) => (
                                            <tr key={idx} className="border-b border-[var(--border)] hover:bg-[var(--bg3)]/50 transition-colors">
                                                <td className="px-3 md:px-5 py-2 md:py-3 font-medium text-xs md:text-sm">{deal.company_name || '-'}</td>
                                                <td className="px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm text-[var(--muted)] hidden sm:table-cell">{deal.pic_name || '-'}</td>
                                                <td className="px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm font-medium text-[var(--green)]">{formatCurrency(deal.value || 0)}</td>
                                                <td className="px-3 md:px-5 py-2 md:py-3 hidden lg:table-cell">
                                                    <span className={`inline-flex px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[9px] md:text-xs font-medium ${deal.stage === 'Closing' ? 'bg-green-500/20 text-[var(--green)]' :
                                                        deal.stage === 'Negosiasi' ? 'bg-yellow-500/20 text-[var(--warn)]' :
                                                            'bg-blue-500/20 text-[var(--blue)]'
                                                        }`}>
                                                        {deal.stage || 'Prospek'}
                                                    </span>
                                                </td>
                                                <td className="px-3 md:px-5 py-2 md:py-3">
                                                    <button className="text-[var(--wa)] hover:opacity-80 transition-opacity text-sm md:text-base">💬 WA</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* CONNECT PAGE - Responsive */}
                    <div className={activePage === 'connect' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6' : 'hidden'}>
                        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-6">
                            <h3 className="text-sm md:text-base font-semibold mb-4">WhatsApp Connection</h3>
                            {!waConnected ? (
                                <div className="text-center py-6 md:py-8">
                                    <div className="w-32 h-32 md:w-48 md:h-48 mx-auto border-2 border-[var(--border)] rounded-xl md:rounded-2xl bg-[var(--bg3)] flex items-center justify-center relative mb-4">
                                        <div className="grid grid-cols-10 gap-0.5 p-2 md:p-3">
                                            {qrGrid.slice(0, 100).map((color, i) => (
                                                <div key={i} className="w-2 h-2 md:w-3 md:h-3 rounded-sm" style={{ background: color }}></div>
                                            ))}
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl md:rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
                                            <button onClick={refreshQR} className="px-2 py-1 md:px-3 md:py-1.5 bg-[var(--green)] rounded-lg text-[10px] md:text-xs">Refresh</button>
                                        </div>
                                    </div>
                                    <p className="text-xs md:text-sm mb-4">Scan QR with WhatsApp</p>
                                    <button onClick={simulateConnect} className="px-3 py-1.5 md:px-4 md:py-2 bg-[var(--green)] rounded-lg md:rounded-xl text-xs md:text-sm font-medium">Simulate Connection</button>
                                </div>
                            ) : (
                                <div className="text-center py-6 md:py-8">
                                    <div className="text-3xl md:text-5xl mb-4">✅</div>
                                    <p className="text-base md:text-lg font-semibold mb-1">Connected!</p>
                                    <p className="text-xs md:text-sm text-[var(--muted)] mb-4">+62 812-3456-7890</p>
                                    <button onClick={disconnectWA} className="px-3 py-1.5 md:px-4 md:py-2 bg-red-500/20 text-[var(--red)] rounded-lg md:rounded-xl text-xs md:text-sm font-medium">Disconnect</button>
                                </div>
                            )}
                        </div>
                        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-6">
                            <h3 className="text-sm md:text-base font-semibold mb-4">Broadcast Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] md:text-xs text-[var(--muted)] block mb-1">Message Delay</label>
                                    <input type="range" min="2" max="30" defaultValue="5" className="w-full" />
                                </div>
                                <div>
                                    <label className="text-[10px] md:text-xs text-[var(--muted)] block mb-1">Daily Limit</label>
                                    <input type="number" defaultValue="500" className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3 py-1.5 md:py-2 text-xs md:text-sm" />
                                </div>
                                <button onClick={() => showToast('Settings saved!', 'success')} className="w-full py-1.5 md:py-2 bg-[var(--green)] rounded-lg md:rounded-xl text-xs md:text-sm font-medium">Save Settings</button>
                            </div>
                        </div>
                    </div>

                    {/* BLAST PAGE - Responsive */}
                    <div className={activePage === 'blast' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6' : 'hidden'}>
                        {blastRunning && (
                            <div className="col-span-1 lg:col-span-2 bg-[var(--bg2)] border border-[var(--green)]/20 rounded-xl md:rounded-2xl p-4 md:p-5 mb-4">
                                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm md:text-base font-semibold">{blastName || 'Broadcast'} - Running</span>
                                    </div>
                                    <button onClick={stopBlast} className="px-2 py-1 md:px-3 md:py-1 bg-red-500/20 text-[var(--red)] rounded-lg text-[10px] md:text-xs">Stop</button>
                                </div>
                                <div className="bg-[var(--bg3)] rounded-full h-1.5 md:h-2 overflow-hidden">
                                    <div className="h-full bg-[var(--green)] rounded-full transition-all" style={{ width: `${(blastCurrent / getTargetCount()) * 100}%` }}></div>
                                </div>
                                <div className="grid grid-cols-4 gap-2 md:gap-3 mt-3 md:mt-4 text-center">
                                    <div><div className="text-sm md:text-xl font-bold text-[var(--green)]">{blastCurrent}</div><div className="text-[8px] md:text-[10px] text-[var(--muted)]">Sent</div></div>
                                    <div><div className="text-sm md:text-xl font-bold text-[var(--warn)]">{getTargetCount() - blastCurrent}</div><div className="text-[8px] md:text-[10px] text-[var(--muted)]">Pending</div></div>
                                    <div><div className="text-sm md:text-xl font-bold">0</div><div className="text-[8px] md:text-[10px] text-[var(--muted)]">Failed</div></div>
                                    <div><div className="text-sm md:text-xl font-bold text-[var(--blue)]">~{Math.ceil((getTargetCount() - blastCurrent) / 6 / 60)}m</div><div className="text-[8px] md:text-[10px] text-[var(--muted)]">ETA</div></div>
                                </div>
                            </div>
                        )}
                        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-6">
                            <h3 className="text-sm md:text-base font-semibold mb-4">Create Broadcast</h3>
                            <div className="space-y-3 md:space-y-4">
                                <div>
                                    <label className="text-[10px] md:text-xs text-[var(--muted)] block mb-1">Campaign Name</label>
                                    <input value={blastName} onChange={(e) => setBlastName(e.target.value)} placeholder="e.g., Summer Promo 2025" className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm focus:outline-none focus:border-[var(--green)] transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] md:text-xs text-[var(--muted)] block mb-1">Contact Group</label>
                                    <select value={blastGroup} onChange={handleGroupChange} className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm">
                                        {groupNames.map((name, idx) => <option key={idx} value={idx}>{name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] md:text-xs text-[var(--muted)] block mb-1">Message Template</label>
                                    <textarea rows="4" value={blastTemplate} onChange={(e) => setBlastTemplate(e.target.value)} className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm resize-none focus:outline-none focus:border-[var(--green)]" />
                                    <div className="flex gap-1.5 md:gap-2 mt-2 flex-wrap">
                                        {['{{Nama}}', '{{Kota}}', '{{Produk}}', '{{Harga}}', '{{Tanggal}}'].map(v => (
                                            <button key={v} onClick={() => insertVar(v)} className="px-1.5 py-0.5 md:px-2 md:py-1 bg-[var(--bg3)] rounded-lg text-[10px] md:text-xs text-[var(--green)] hover:bg-[var(--bg4)] transition">{v}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2 md:gap-3">
                                    <button onClick={previewBlast} className="flex-1 py-1.5 md:py-2 border border-[var(--border)] rounded-lg md:rounded-xl text-xs md:text-sm">Preview</button>
                                    <button onClick={startBlast} className="flex-1 py-1.5 md:py-2 bg-gradient-to-r from-[var(--green)] to-[var(--green2)] rounded-lg md:rounded-xl text-xs md:text-sm font-medium">Start Broadcast</button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-6">
                                <h3 className="text-sm md:text-base font-semibold mb-3">Preview</h3>
                                <div className="bg-[#075E54] rounded-xl md:rounded-2xl p-2 md:p-3">
                                    <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#128C7E] flex items-center justify-center text-white text-[10px] md:text-xs font-bold">B</div>
                                        <div><div className="text-xs md:text-sm font-semibold text-white">Business Account</div><div className="text-[9px] md:text-xs text-white/60">online</div></div>
                                    </div>
                                    <div className="mt-2 bg-[#DCF8C6] rounded-lg md:rounded-xl p-2 md:p-3 max-w-[85%]">
                                        <div className="text-[10px] md:text-sm text-gray-800 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: getPreviewText() }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-6">
                                <h3 className="text-sm md:text-base font-semibold mb-3">Summary</h3>
                                <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                                    <div className="flex justify-between"><span className="text-[var(--muted)]">Target Contacts</span><span className="font-medium">{getTargetCount().toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span className="text-[var(--muted)]">Estimated Time</span><span className="font-medium">{getEstimatedTime()}</span></div>
                                    <div className="flex justify-between"><span className="text-[var(--muted)]">Message Type</span><span className="font-medium text-[var(--blue)]">Text</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BLAST LOG PAGE - Responsive */}
                    <div className={activePage === 'blastlog' ? 'bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl overflow-hidden' : 'hidden'}>
                        <div className="px-4 md:px-5 py-3 md:py-4 border-b border-[var(--border)]">
                            <h3 className="text-sm md:text-base font-semibold">Broadcast History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[500px]">
                                <thead className="bg-[var(--bg3)]">
                                    <tr className="text-[10px] md:text-xs font-medium text-[var(--muted)]">
                                        <th className="px-3 md:px-5 py-2 md:py-3 text-left">Campaign</th>
                                        <th className="px-3 md:px-5 py-2 md:py-3 text-left">Date</th>
                                        <th className="px-3 md:px-5 py-2 md:py-3 text-left">Sent</th>
                                        <th className="px-3 md:px-5 py-2 md:py-3 text-left hidden sm:table-cell">Open Rate</th>
                                        <th className="px-3 md:px-5 py-2 md:py-3 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blastHistory.map((b, i) => (
                                        <tr key={i} className="border-b border-[var(--border)]">
                                            <td className="px-3 md:px-5 py-2 md:py-3 font-medium text-xs md:text-sm">{b.name}</td>
                                            <td className="px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm text-[var(--muted)]">{formatDate(b.created_at)}</td>
                                            <td className="px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm">{formatNumber(b.sent_count)}/{formatNumber(b.target_count)}</td>
                                            <td className="px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm text-[var(--green)] hidden sm:table-cell">{b.open_rate || 0}%</td>
                                            <td className="px-3 md:px-5 py-2 md:py-3"><span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-green-500/20 text-[var(--green)] rounded-full text-[9px] md:text-xs">Completed</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* CONTACTS PAGE - Responsive */}
                    <div className={activePage === 'contacts' ? 'space-y-3 md:space-y-4' : 'hidden'}>
                        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                            <input type="text" value={contactFilter} onChange={(e) => setContactFilter(e.target.value)} placeholder="Search contacts..." className="flex-1 bg-[var(--bg3)] border border-[var(--border)] rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm focus:outline-none focus:border-[var(--green)]" />
                            <div className="flex gap-2">
                                <button onClick={() => openModal('import')} className="px-3 py-1.5 md:px-4 md:py-2 border border-[var(--border)] rounded-lg md:rounded-xl text-xs md:text-sm">📁 Import</button>
                                <button onClick={() => openModal('addContact')} className="px-3 py-1.5 md:px-4 md:py-2 bg-[var(--green)] rounded-lg md:rounded-xl text-xs md:text-sm font-medium">+ Add</button>
                            </div>
                        </div>
                        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px]">
                                    <thead className="bg-[var(--bg3)]">
                                        <tr className="text-[10px] md:text-xs font-medium text-[var(--muted)]">
                                            <th className="px-3 md:px-5 py-2 md:py-3 text-left w-8"><input type="checkbox" onChange={selectAllContacts} /></th>
                                            <th className="px-3 md:px-5 py-2 md:py-3 text-left">Name</th>
                                            <th className="px-3 md:px-5 py-2 md:py-3 text-left hidden sm:table-cell">Phone</th>
                                            <th className="px-3 md:px-5 py-2 md:py-3 text-left hidden lg:table-cell">City</th>
                                            <th className="px-3 md:px-5 py-2 md:py-3 text-left">Group</th>
                                            <th className="px-3 md:px-5 py-2 md:py-3 text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredContacts.map((c, i) => (
                                            <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--bg3)]/50 transition-colors">
                                                <td className="px-3 md:px-5 py-2 md:py-3"><input type="checkbox" checked={selectedAll} onChange={() => { }} /></td>
                                                <td className="px-3 md:px-5 py-2 md:py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-[var(--purple)] to-[var(--blue)] flex items-center justify-center text-white text-[10px] md:text-xs font-bold">
                                                            {c.name?.charAt(0) || '?'}
                                                        </div>
                                                        <span className="font-medium text-xs md:text-sm">{c.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm font-mono hidden sm:table-cell">{c.phone}</td>
                                                <td className="px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm text-[var(--muted)] hidden lg:table-cell">{c.city || '-'}</td>
                                                <td className="px-3 md:px-5 py-2 md:py-3"><span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-blue-500/20 text-[var(--blue)] rounded-full text-[9px] md:text-xs">{c.group || 'General'}</span></td>
                                                <td className="px-3 md:px-5 py-2 md:py-3"><button className="text-[var(--wa)] text-sm md:text-base">💬</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* PIPELINE PAGE - Responsive */}
                    <div className={activePage === 'pipeline' ? 'space-y-3 md:space-y-4' : 'hidden'}>
                        <div className="flex justify-between items-center flex-wrap gap-2">
                            <p className="text-xs md:text-sm text-[var(--muted)]">Pipeline Value: <strong className="text-[var(--green)] text-base md:text-lg">{formatCurrency(stats.revenue)}</strong></p>
                            <button onClick={() => openModal('addDeal')} className="px-3 py-1.5 md:px-4 md:py-2 bg-[var(--green)] rounded-lg md:rounded-xl text-xs md:text-sm font-medium">+ New Deal</button>
                        </div>
                        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2">
                            {Object.entries(dealsByStage).map(([stage, deals]) => (
                                <div key={stage} className="min-w-[250px] md:min-w-[280px] bg-[var(--bg3)] rounded-lg md:rounded-xl overflow-hidden">
                                    <div className="px-3 md:px-4 py-2 md:py-3 bg-[var(--bg2)] border-b border-[var(--border)]">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-xs md:text-sm">{stage}</span>
                                            <span className="px-1.5 py-0.5 md:px-2 md:py-0.5 bg-[var(--bg4)] rounded-full text-[10px] md:text-xs">{deals?.length || 0}</span>
                                        </div>
                                    </div>
                                    <div className="p-2 md:p-3 space-y-2 max-h-[500px] overflow-y-auto">
                                        {(deals || []).map((deal, idx) => (
                                            <div key={idx} className="bg-[var(--bg2)] rounded-lg md:rounded-xl p-2 md:p-3 border border-[var(--border)] hover:border-[var(--green)]/30 transition-all">
                                                <div className="font-medium text-xs md:text-sm">{deal.company_name}</div>
                                                <div className="text-[10px] md:text-xs text-[var(--muted)] mt-1">{deal.pic_name}</div>
                                                <div className="text-xs md:text-sm font-medium text-[var(--green)] mt-1 md:mt-2">{formatCurrency(deal.value)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ANALYTICS PAGE - Responsive */}
                    <div className={activePage === 'analytics' ? 'space-y-4 md:space-y-6' : 'hidden'}>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                            <div className="bg-[var(--bg2)] p-3 md:p-5 rounded-xl md:rounded-2xl"><div className="text-lg md:text-2xl font-bold text-[var(--green)]">{formatCurrency(stats.revenue)}</div><div className="text-[9px] md:text-xs text-[var(--muted)] mt-1">Total Revenue</div></div>
                            <div className="bg-[var(--bg2)] p-3 md:p-5 rounded-xl md:rounded-2xl"><div className="text-lg md:text-2xl font-bold text-[var(--blue)]">{stats.avgOpenRate}%</div><div className="text-[9px] md:text-xs text-[var(--muted)] mt-1">Open Rate</div></div>
                            <div className="bg-[var(--bg2)] p-3 md:p-5 rounded-xl md:rounded-2xl"><div className="text-lg md:text-2xl font-bold text-[var(--warn)]">42.7%</div><div className="text-[9px] md:text-xs text-[var(--muted)] mt-1">Reply Rate</div></div>
                            <div className="bg-[var(--bg2)] p-3 md:p-5 rounded-xl md:rounded-2xl"><div className="text-lg md:text-2xl font-bold">34.1%</div><div className="text-[9px] md:text-xs text-[var(--muted)] mt-1">Conversion</div></div>
                        </div>
                        <div className="bg-[var(--bg2)] p-4 md:p-5 rounded-xl md:rounded-2xl">
                            <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4">Monthly Performance</h3>
                            <div className="flex items-end gap-2 md:gap-3 h-28 md:h-40">
                                {blastChartData.map((v, i) => {
                                    const max = Math.max(...blastChartData);
                                    return <div key={i} className="flex-1 text-center"><div className="bg-gradient-to-t from-[var(--blue)] to-[var(--purple)] rounded-lg transition-all" style={{ height: `${Math.max(15, (v / max) * 100)}px` }}></div><div className="text-[8px] md:text-xs text-[var(--muted)] mt-1 md:mt-2">Month {i + 1}</div></div>;
                                })}
                            </div>
                        </div>
                    </div>

                    {/* SETTINGS PAGE - Responsive */}
                    <div className={activePage === 'settings' ? 'max-w-2xl mx-auto' : 'hidden'}>
                        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl md:rounded-2xl p-4 md:p-6">
                            <h3 className="text-sm md:text-base font-semibold mb-4">Business Profile</h3>
                            <div className="space-y-3 md:space-y-4">
                                <div><label className="text-[10px] md:text-xs text-[var(--muted)] block mb-1">Business Name</label><input defaultValue="PT Karya Digital Nusantara" className="w-full bg-[var(--bg3)] rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm border border-[var(--border)] focus:outline-none focus:border-[var(--green)]" /></div>
                                <div><label className="text-[10px] md:text-xs text-[var(--muted)] block mb-1">Email</label><input defaultValue="admin@blazcrm.id" className="w-full bg-[var(--bg3)] rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm border border-[var(--border)] focus:outline-none focus:border-[var(--green)]" /></div>
                                <div><label className="text-[10px] md:text-xs text-[var(--muted)] block mb-1">WhatsApp Number</label><input defaultValue="+62 812-3456-7890" className="w-full bg-[var(--bg3)] rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm border border-[var(--border)] focus:outline-none focus:border-[var(--green)]" /></div>
                                <button onClick={() => showToast('Profile updated!', 'success')} className="px-3 py-1.5 md:px-4 md:py-2 bg-[var(--green)] rounded-lg md:rounded-xl text-xs md:text-sm font-medium">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODALS - Responsive */}
            {modals.import && (
                <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && closeModal('import')}>
                    <div className="bg-[var(--bg2)] rounded-xl md:rounded-2xl p-4 md:p-6 w-full max-w-[480px] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-base md:text-lg font-semibold">Import Contacts</h3><button onClick={() => closeModal('import')} className="text-[var(--muted)] text-xl">✕</button></div>
                        <div className="border-2 border-dashed border-[var(--border)] rounded-lg md:rounded-xl p-6 md:p-8 text-center cursor-pointer hover:border-[var(--green)] transition-colors" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => document.getElementById('csv-file').click()}>
                            <div className="text-3xl md:text-4xl mb-2">📄</div>
                            <p className="text-xs md:text-sm">Drag & drop CSV file here</p>
                        </div>
                        <input id="csv-file" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                        <div className="flex gap-3 mt-4"><button onClick={() => closeModal('import')} className="flex-1 py-1.5 md:py-2 border border-[var(--border)] rounded-lg md:rounded-xl text-xs md:text-sm">Cancel</button><button onClick={() => { closeModal('import'); showToast('Imported!', 'success'); }} className="flex-1 py-1.5 md:py-2 bg-[var(--green)] rounded-lg md:rounded-xl text-xs md:text-sm font-medium">Import</button></div>
                    </div>
                </div>
            )}

            {modals.addContact && (
                <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && closeModal('addContact')}>
                    <div className="bg-[var(--bg2)] rounded-xl md:rounded-2xl p-4 md:p-6 w-full max-w-[480px]">
                        <h3 className="text-base md:text-lg font-semibold mb-4">Add Contact</h3>
                        <div className="space-y-3">
                            <input placeholder="Full Name" className="w-full bg-[var(--bg3)] rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm border border-[var(--border)] focus:outline-none focus:border-[var(--green)]" />
                            <input placeholder="WhatsApp Number" className="w-full bg-[var(--bg3)] rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm border border-[var(--border)] focus:outline-none focus:border-[var(--green)]" />
                            <input placeholder="City" className="w-full bg-[var(--bg3)] rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm border border-[var(--border)] focus:outline-none focus:border-[var(--green)]" />
                        </div>
                        <div className="flex gap-3 mt-4"><button onClick={() => closeModal('addContact')} className="flex-1 py-1.5 md:py-2 border border-[var(--border)] rounded-lg md:rounded-xl text-xs md:text-sm">Cancel</button><button onClick={addContact} className="flex-1 py-1.5 md:py-2 bg-[var(--green)] rounded-lg md:rounded-xl text-xs md:text-sm font-medium">Save</button></div>
                    </div>
                </div>
            )}

            {modals.addDeal && (
                <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && closeModal('addDeal')}>
                    <div className="bg-[var(--bg2)] rounded-xl md:rounded-2xl p-4 md:p-6 w-full max-w-[480px]">
                        <h3 className="text-base md:text-lg font-semibold mb-4">New Deal</h3>
                        <div className="space-y-3">
                            <input placeholder="Company Name" className="w-full bg-[var(--bg3)] rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm border border-[var(--border)] focus:outline-none focus:border-[var(--green)]" />
                            <input type="number" placeholder="Deal Value (Rp)" className="w-full bg-[var(--bg3)] rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm border border-[var(--border)] focus:outline-none focus:border-[var(--green)]" />
                        </div>
                        <div className="flex gap-3 mt-4"><button onClick={() => closeModal('addDeal')} className="flex-1 py-1.5 md:py-2 border border-[var(--border)] rounded-lg md:rounded-xl text-xs md:text-sm">Cancel</button><button onClick={() => { closeModal('addDeal'); showToast('Deal added!', 'success'); fetchDashboardData(); }} className="flex-1 py-1.5 md:py-2 bg-[var(--green)] rounded-lg md:rounded-xl text-xs md:text-sm font-medium">Save</button></div>
                    </div>
                </div>
            )}

            {modals.preview && (
                <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && closeModal('preview')}>
                    <div className="bg-[var(--bg2)] rounded-xl md:rounded-2xl p-4 md:p-6 w-full max-w-[400px]">
                        <h3 className="text-base md:text-lg font-semibold mb-4">Message Preview</h3>
                        <div className="bg-[#075E54] rounded-lg md:rounded-xl p-2 md:p-3"><div className="bg-[#DCF8C6] rounded-lg md:rounded-xl p-2 md:p-3 text-xs md:text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: getPreviewText() }}></div></div>
                        <button onClick={() => closeModal('preview')} className="w-full mt-4 py-1.5 md:py-2 border border-[var(--border)] rounded-lg md:rounded-xl text-xs md:text-sm">Close</button>
                    </div>
                </div>
            )}

            {/* Styles */}
            <style>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #30363D;
                    border-radius: 10px;
                }
                .shadow-glow {
                    box-shadow: 0 0 8px var(--green);
                }
            `}</style>
        </div>
    );
};

export default DashboardPage;