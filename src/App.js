import React, { useState, useEffect, useCallback } from 'react';

const App = () => {
  // Navigation State
  const [activePage, setActivePage] = useState('dashboard');
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

  // WhatsApp Connection State
  const [waConnected, setWaConnected] = useState(true);
  const [qrGrid, setQrGrid] = useState([]);

  // Blast State
  const [blastRunning, setBlastRunning] = useState(false);
  const [blastCurrent, setBlastCurrent] = useState(0);
  const [blastTotal] = useState(3200);
  const [blastInterval, setBlastInterval] = useState(null);
  const [blastName, setBlastName] = useState('');
  const [blastGroup, setBlastGroup] = useState(0);
  const [blastTemplate, setBlastTemplate] = useState(`Halo {{Nama}}! 👋

Promo spesial bulan ini untuk kamu di {{Kota}}!
Dapatkan *diskon 30%* untuk semua produk kami.

Berlaku hingga 31 Mei 2025. Jangan sampai kehabisan! 🔥

Balas pesan ini untuk info lebih lanjut.`);
  const [scheduleMode, setScheduleMode] = useState(false);

  // Contacts State
  const [contacts] = useState([
    { name: 'Budi Santoso', phone: '0812-3456-7890', city: 'Jakarta', group: 'Pelanggan', status: 'active', color: '#0D47A1' },
    { name: 'Siti Rahayu', phone: '0857-1234-5678', city: 'Bandung', group: 'Leads', status: 'active', color: '#880E4F' },
    { name: 'Ahmad Fauzi', phone: '0821-9876-5432', city: 'Surabaya', group: 'VIP', status: 'active', color: '#1B5E20' },
    { name: 'Dewi Lestari', phone: '0838-1111-2222', city: 'Jakarta', group: 'Pelanggan', status: 'active', color: '#4A148C' },
    { name: 'Hendra Wijaya', phone: '0811-5555-6666', city: 'Medan', group: 'Follow-up', status: 'inactive', color: '#E65100' },
    { name: 'Maya Putri', phone: '0877-3333-4444', city: 'Yogyakarta', group: 'Leads', status: 'active', color: '#006064' },
    { name: 'Rudi Hartono', phone: '0822-7777-8888', city: 'Semarang', group: 'Pelanggan', status: 'active', color: '#37474F' },
    { name: 'Fitri Handayani', phone: '0855-9999-0000', city: 'Makassar', group: 'VIP', status: 'active', color: '#B71C1C' },
  ]);
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
    generateQR();
    const interval = setInterval(generateQR, 20000);
    return () => clearInterval(interval);
  }, [generateQR]);

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

    const interval = setInterval(() => {
      setBlastCurrent(prev => {
        let newCurrent = prev + Math.floor(Math.random() * 8) + 3;
        if (newCurrent >= blastTotal) {
          clearInterval(interval);
          setBlastRunning(false);
          showToast('✅ Blast selesai! ' + blastTotal + ' pesan terkirim', 'success');
          return blastTotal;
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

  useEffect(() => {
    return () => {
      if (blastInterval) clearInterval(blastInterval);
    };
  }, [blastInterval]);

  // Contact Functions
  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(contactFilter.toLowerCase()) ||
    c.phone.includes(contactFilter) ||
    c.city.toLowerCase().includes(contactFilter.toLowerCase())
  );

  const addContact = () => {
    closeModal('addContact');
    showToast('✅ Kontak baru ditambahkan!', 'success');
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
  const groupNumbers = [1247, 543, 289, 124, 78];
  const groupNames = ['Semua Kontak (1.247)', 'Pelanggan Aktif (543)', 'Leads Baru (289)', 'Follow-up Juni (124)', 'VIP Customer (78)'];

  const handleGroupChange = (e) => {
    setBlastGroup(parseInt(e.target.value));
  };

  const getEstimatedTime = () => {
    const mins = Math.round(groupNumbers[blastGroup] * 5 / 60);
    return mins > 60 ? `~${Math.floor(mins / 60)} jam ${mins % 60} menit` : `~${mins} menit`;
  };

  // Chart Data
  const revenueData = [42, 58, 71, 63, 88, 79, 95];
  const blastChartData = [2400, 3100, 5200, 4800, 12480];

  // CSS Variables for styling
  const cssVariables = {
    '--bg': '#0D1117',
    '--bg2': '#161B22',
    '--bg3': '#21262D',
    '--bg4': '#30363D',
    '--text': '#E6EDF3',
    '--muted': '#7D8590',
    '--mid': '#B0BAC5',
    '--green': '#00C853',
    '--green2': '#43A047',
    '--greenp': 'rgba(0,200,83,0.12)',
    '--wa': '#25D366',
    '--border': 'rgba(255,255,255,0.08)',
    '--warn': '#FFBD2E',
    '--red': '#FF5F57',
    '--blue': '#58A6FF',
    '--r': '10px',
    '--rl': '16px',
  };

  return (
    <div className="flex h-screen overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]" style={{ ...cssVariables, background: 'var(--bg)', color: 'var(--text)' }}>
      {/* SIDEBAR */}
      <aside className="w-[220px] min-w-[220px] bg-[var(--bg2)] border-r border-[var(--border)] flex flex-col">
        <div className="px-[18px] pt-5 pb-4 border-b border-[var(--border)] text-lg font-extrabold">
          Blaz<span className="text-[var(--green)]">CRM</span>
        </div>
        <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5">
          <div
            onClick={() => setActivePage('dashboard')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--r)] text-[13px] font-medium cursor-pointer transition-all duration-150 ${
              activePage === 'dashboard'
                ? 'bg-[var(--greenp)] text-[var(--green)] font-bold'
                : 'text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
            }`}
          >
            <span className="text-base w-5 text-center">📊</span> Dashboard
          </div>
          <div
            onClick={() => setActivePage('pipeline')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--r)] text-[13px] font-medium cursor-pointer transition-all duration-150 ${
              activePage === 'pipeline'
                ? 'bg-[var(--greenp)] text-[var(--green)] font-bold'
                : 'text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
            }`}
          >
            <span className="text-base w-5 text-center">🏗️</span> Pipeline
          </div>
          <div
            onClick={() => setActivePage('contacts')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--r)] text-[13px] font-medium cursor-pointer transition-all duration-150 ${
              activePage === 'contacts'
                ? 'bg-[var(--greenp)] text-[var(--green)] font-bold'
                : 'text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
            }`}
          >
            <span className="text-base w-5 text-center">👥</span> Kontak
          </div>
          <div className="text-[10px] font-bold tracking-[1.5px] text-[var(--muted)] px-3 pt-[14px] pb-1.5 uppercase">WhatsApp</div>
          <div
            onClick={() => setActivePage('connect')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--r)] text-[13px] font-medium cursor-pointer transition-all duration-150 ${
              activePage === 'connect'
                ? 'bg-[var(--greenp)] text-[var(--green)] font-bold'
                : 'text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
            }`}
          >
            <span className="text-base w-5 text-center">📱</span> Koneksi WA
          </div>
          <div
            onClick={() => setActivePage('blast')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--r)] text-[13px] font-medium cursor-pointer transition-all duration-150 ${
              activePage === 'blast'
                ? 'bg-[var(--greenp)] text-[var(--green)] font-bold'
                : 'text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
            }`}
          >
            <span className="text-base w-5 text-center">📤</span> WA Blast
          </div>
          <div
            onClick={() => setActivePage('blastlog')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--r)] text-[13px] font-medium cursor-pointer transition-all duration-150 ${
              activePage === 'blastlog'
                ? 'bg-[var(--greenp)] text-[var(--green)] font-bold'
                : 'text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
            }`}
          >
            <span className="text-base w-5 text-center">📋</span> Riwayat Blast
          </div>
          <div className="text-[10px] font-bold tracking-[1.5px] text-[var(--muted)] px-3 pt-[14px] pb-1.5 uppercase">Laporan</div>
          <div
            onClick={() => setActivePage('analytics')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--r)] text-[13px] font-medium cursor-pointer transition-all duration-150 ${
              activePage === 'analytics'
                ? 'bg-[var(--greenp)] text-[var(--green)] font-bold'
                : 'text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
            }`}
          >
            <span className="text-base w-5 text-center">📈</span> Analytics
          </div>
          <div
            onClick={() => setActivePage('settings')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--r)] text-[13px] font-medium cursor-pointer transition-all duration-150 ${
              activePage === 'settings'
                ? 'bg-[var(--greenp)] text-[var(--green)] font-bold'
                : 'text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
            }`}
          >
            <span className="text-base w-5 text-center">⚙️</span> Pengaturan
          </div>
        </nav>
        <div className="p-3 border-t border-[var(--border)]">
          <div
            onClick={() => setActivePage('connect')}
            className="flex items-center gap-2 p-2.5 rounded-[var(--r)] bg-[var(--bg3)] border border-[var(--border)] cursor-pointer transition-colors hover:border-[var(--green)]"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${waConnected ? 'bg-[var(--green)] shadow-[0_0_6px_var(--green)] animate-pulse' : 'bg-[var(--red)]'}`}></div>
            <div>
              <div className="text-xs font-semibold">{waConnected ? 'Terhubung' : 'Terputus'}</div>
              <div className="text-[10px] text-[var(--muted)]">{waConnected ? '+62 812-3456-7890' : 'Klik untuk koneksi'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 h-[58px] border-b border-[var(--border)] flex items-center justify-between flex-shrink-0 bg-[var(--bg2)]">
          <div className="text-base font-bold">{pageTitles[activePage]}</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setActivePage('blast')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-[var(--green)] text-white hover:bg-[var(--green2)] transition-transform hover:-translate-y-[1px]">
              📤 Buat Blast
            </button>
            <div className="w-8 h-8 rounded-full bg-[var(--green2)] flex items-center justify-center text-xs font-bold text-white">AS</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* TOAST */}
          {toast.show && (
            <div className="fixed bottom-6 right-6 z-50 bg-[var(--bg3)] border border-[var(--border)] rounded-[var(--r)] px-4 py-3 text-[13px] font-medium flex items-center gap-2 animate-slide-in">
              <span className={toast.type === 'success' ? 'text-[var(--green)]' : toast.type === 'info' ? 'text-[var(--blue)]' : ''}>{toast.message}</span>
            </div>
          )}

          {/* DASHBOARD PAGE */}
          <div className={activePage === 'dashboard' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-4 gap-3.5 mb-5">
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-[18px_20px]">
                <div className="text-[28px] font-extrabold leading-none text-[var(--green)]">Rp 284jt</div>
                <div className="text-xs text-[var(--muted)] mt-1.5">Revenue Bulan Ini</div>
                <div className="text-[11px] text-[var(--green)] mt-1">↑ 23% vs bulan lalu</div>
              </div>
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-[18px_20px]">
                <div className="text-[28px] font-extrabold leading-none">47</div>
                <div className="text-xs text-[var(--muted)] mt-1.5">Deal Aktif</div>
                <div className="text-[11px] text-[var(--green)] mt-1">↑ 8 deal baru minggu ini</div>
              </div>
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-[18px_20px]">
                <div className="text-[28px] font-extrabold leading-none text-[var(--blue)]">12.480</div>
                <div className="text-xs text-[var(--muted)] mt-1.5">Pesan WA Terkirim</div>
                <div className="text-[11px] text-[var(--green)] mt-1">↑ 3 blast aktif</div>
              </div>
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-[18px_20px]">
                <div className="text-[28px] font-extrabold leading-none text-[var(--warn)]">98.2%</div>
                <div className="text-xs text-[var(--muted)] mt-1.5">Open Rate Rata-rata</div>
                <div className="text-[11px] text-[var(--green)] mt-1">↑ 2.1% vs minggu lalu</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-5">
                <div className="flex items-center justify-between text-sm font-bold mb-4">
                  Blast Aktif
                  <button onClick={() => setActivePage('blast')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bg3)]">+ Buat Baru</button>
                </div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-[11px] font-bold text-[var(--muted)] text-left border-b border-[var(--border)]">
                      <th className="p-2">Nama</th><th>Progress</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--border)]">
                      <td className="p-2 align-middle"><span className="font-semibold">Promo Mei 2025</span><br /><span className="text-[11px] text-[var(--muted)]">3.200 kontak</span></td>
                      <td className="p-2 align-middle w-[140px]"><div className="bg-[var(--bg3)] rounded-full h-2 overflow-hidden"><div className="h-full rounded-full bg-[var(--green)]" style={{ width: '94%' }}></div></div><span className="text-[11px] text-[var(--muted)]">3.008 / 3.200</span></td>
                      <td className="p-2 align-middle"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(0,200,83,0.15)] text-[var(--green)]">● Berjalan</span></td>
                    </tr>
                    <tr className="border-b border-[var(--border)]">
                      <td className="p-2 align-middle"><span className="font-semibold">Follow-up Leads</span><br /><span className="text-[11px] text-[var(--muted)]">850 kontak</span></td>
                      <td className="p-2 align-middle"><div className="bg-[var(--bg3)] rounded-full h-2 overflow-hidden"><div className="h-full rounded-full bg-[var(--warn)]" style={{ width: '0%' }}></div></div><span className="text-[11px] text-[var(--muted)]">0 / 850</span></td>
                      <td className="p-2 align-middle"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(255,189,46,0.15)] text-[var(--warn)]">⏳ Antrian</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-5">
                <div className="text-sm font-bold mb-4">Revenue 7 Hari Terakhir</div>
                <div className="flex items-end gap-1.5 h-20 px-0.5">
                  {revenueData.map((v, i) => {
                    const max = Math.max(...revenueData);
                    return <div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-[var(--green)] opacity-70 transition-opacity hover:opacity-100" style={{ height: `${Math.max(8, Math.round(v / max * 100))}px` }}></div><div className="text-[9px] text-[var(--muted)]">{i + 1}</div></div>;
                  })}
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-5">
              <div className="flex items-center justify-between text-sm font-bold mb-4">
                Deal Terbaru
                <button onClick={() => setActivePage('pipeline')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bg3)]">Lihat Semua</button>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[11px] font-bold text-[var(--muted)] text-left border-b border-[var(--border)]">
                    <th className="p-2">Perusahaan</th><th>PIC</th><th>Nilai</th><th>Stage</th><th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border)]"><td className="p-2 font-semibold align-middle">PT Nusantara Tech</td><td className="p-2 text-[var(--muted)] align-middle">Dewi Lestari</td><td className="p-2 text-[var(--green)] font-semibold align-middle">Rp 120jt</td><td className="p-2 align-middle"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(88,166,255,0.15)] text-[var(--blue)]">Presentasi</span></td><td className="p-2 align-middle"><button className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-[rgba(37,211,102,0.15)] text-[var(--wa)] border border-[rgba(37,211,102,0.25)]">💬 WA</button></td></tr>
                  <tr className="border-b border-[var(--border)]"><td className="p-2 font-semibold align-middle">PT Mega Prima</td><td className="p-2 text-[var(--muted)] align-middle">Agus Pratama</td><td className="p-2 text-[var(--warn)] font-semibold align-middle">Rp 200jt</td><td className="p-2 align-middle"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(255,189,46,0.15)] text-[var(--warn)]">Negosiasi</span></td><td className="p-2 align-middle"><button className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-[rgba(37,211,102,0.15)] text-[var(--wa)] border border-[rgba(37,211,102,0.25)]">💬 WA</button></td></tr>
                  <tr className="border-b border-[var(--border)]"><td className="p-2 font-semibold align-middle">UD Berkah Abadi</td><td className="p-2 text-[var(--muted)] align-middle">Fitri Handayani</td><td className="p-2 text-[var(--green)] font-semibold align-middle">Rp 78jt</td><td className="p-2 align-middle"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(0,200,83,0.15)] text-[var(--green)]">✓ Closing</span></td><td className="p-2 align-middle"><button className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-[rgba(37,211,102,0.15)] text-[var(--wa)] border border-[rgba(37,211,102,0.25)]">💬 WA</button></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CONNECT PAGE */}
          <div className={activePage === 'connect' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-5">
                <div className="text-sm font-bold mb-4">Koneksi WhatsApp</div>
                {!waConnected ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-[200px] h-[200px] border-2 border-[var(--border)] rounded-[var(--rl)] bg-[var(--bg3)] flex items-center justify-center mx-auto mb-5 relative overflow-hidden">
                      <div className="grid grid-cols-10 gap-0.5 p-4">
                        {qrGrid.map((color, i) => (
                          <div key={i} className="w-[14px] h-[14px] rounded-[1px]" style={{ background: color }}></div>
                        ))}
                      </div>
                      <div className="absolute left-0 right-0 h-0.5 bg-[var(--green)] opacity-80 animate-[scan_2s_ease-in-out_infinite]"></div>
                    </div>
                    <div className="text-base font-bold mb-2">Scan QR Code</div>
                    <div className="text-[13px] text-[var(--muted)] leading-relaxed max-w-[280px]">Buka WhatsApp di HP kamu → Menu → Perangkat Tertaut → Tautkan Perangkat</div>
                    <div className="flex gap-2.5 mt-5">
                      <button onClick={refreshQR} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bg3)]">🔄 Refresh QR</button>
                      <button onClick={simulateConnect} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-[var(--green)] text-white hover:bg-[var(--green2)]">✓ Simulasi Terhubung</button>
                    </div>
                  </div>
                ) : (
                  <div className="py-5 text-center">
                    <div className="text-[48px] mb-4">✅</div>
                    <div className="text-lg font-bold mb-2">WhatsApp Terhubung!</div>
                    <div className="text-sm text-[var(--muted)] mb-5">+62 812-3456-7890 · Ahmad Saleh</div>
                    <div className="bg-[var(--bg3)] rounded-[var(--r)] p-[14px_18px] text-left mb-4">
                      <div className="text-xs text-[var(--muted)] mb-2 font-bold">INFO SESI</div>
                      <div className="text-[13px] mb-1">📱 Device: Samsung Galaxy S23</div>
                      <div className="text-[13px] mb-1">🕐 Terhubung sejak: 10 Mei 2025 09:14</div>
                      <div className="text-[13px]">📊 Total pesan terkirim: 12.480</div>
                    </div>
                    <button onClick={disconnectWA} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-[rgba(255,95,87,0.15)] text-[var(--red)] border border-[rgba(255,95,87,0.3)] hover:bg-[rgba(255,95,87,0.25)]">⏏ Putuskan Koneksi</button>
                  </div>
                )}
              </div>
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-5">
                <div className="text-sm font-bold mb-4">Pengaturan WA Blast</div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Delay Antar Pesan (detik)</label>
                  <input type="range" min="2" max="30" defaultValue="5" className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg p-1.5" />
                  <div className="text-[13px] text-[var(--green)] font-semibold mt-1">5 detik</div>
                  <div className="text-[11px] text-[var(--muted)] mt-1">⚠️ Minimal 3 detik untuk menghindari ban</div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Batas Pesan Per Hari</label>
                  <input type="number" defaultValue="500" className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]" />
                  <div className="text-[11px] text-[var(--muted)] mt-1">Rekomendasi: 500/hari untuk nomor baru, 2000/hari untuk nomor lama</div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Mode Pengiriman</label>
                  <select className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]">
                    <option>🐌 Aman (delay acak 5-15 detik)</option>
                    <option selected>⚡ Normal (delay 3-8 detik)</option>
                    <option>🚀 Cepat (delay 1-3 detik) — berisiko</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Jam Operasional Blast</label>
                  <div className="flex gap-2 items-center">
                    <input type="time" defaultValue="08:00" className="w-auto bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]" />
                    <span className="text-[var(--muted)]">s/d</span>
                    <input type="time" defaultValue="21:00" className="w-auto bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]" />
                  </div>
                </div>
                <button onClick={() => showToast('✅ Pengaturan disimpan!', 'success')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-[var(--green)] text-white hover:bg-[var(--green2)]">Simpan Pengaturan</button>
              </div>
            </div>
          </div>

          {/* BLAST PAGE */}
          <div className={activePage === 'blast' ? 'block' : 'hidden'}>
            {blastRunning && (
              <div className="bg-[var(--bg2)] border border-[rgba(0,200,83,0.2)] rounded-[var(--rl)] p-5 mb-4">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2 text-sm font-bold"><span className="inline-block animate-spin">⚙️</span> Promo Mei 2025 — Sedang Berjalan</div>
                  <button onClick={stopBlast} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[rgba(255,95,87,0.15)] text-[var(--red)] border border-[rgba(255,95,87,0.3)] hover:bg-[rgba(255,95,87,0.25)]">⏹ Stop</button>
                </div>
                <div className="bg-[var(--bg3)] rounded-full h-3 overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--green)] transition-all duration-300" style={{ width: `${Math.round(blastCurrent / blastTotal * 100)}%` }}></div>
                </div>
                <div className="flex justify-between mt-1.5 text-xs text-[var(--muted)]">
                  <span>{blastCurrent.toLocaleString()} dari {blastTotal.toLocaleString()}</span>
                  <span>{Math.round(blastCurrent / blastTotal * 100)}%</span>
                </div>
                <div className="grid grid-cols-4 gap-2.5 mt-3.5">
                  <div className="bg-[var(--bg3)] rounded-lg p-2.5 text-center"><div className="text-xl font-extrabold text-[var(--green)]">{blastCurrent.toLocaleString()}</div><div className="text-[10px] text-[var(--muted)]">Terkirim</div></div>
                  <div className="bg-[var(--bg3)] rounded-lg p-2.5 text-center"><div className="text-xl font-extrabold" style={{ color: 'var(--warn)' }}>{(blastTotal - blastCurrent).toLocaleString()}</div><div className="text-[10px] text-[var(--muted)]">Antrian</div></div>
                  <div className="bg-[var(--bg3)] rounded-lg p-2.5 text-center"><div className="text-xl font-extrabold" style={{ color: 'var(--red)' }}>0</div><div className="text-[10px] text-[var(--muted)]">Gagal</div></div>
                  <div className="bg-[var(--bg3)] rounded-lg p-2.5 text-center"><div className="text-xl font-extrabold" style={{ color: 'var(--blue)' }}>~{Math.ceil((blastTotal - blastCurrent) / 6 / 60)}m</div><div className="text-[10px] text-[var(--muted)]">Estimasi Selesai</div></div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-5">
                <div className="text-sm font-bold mb-4">Buat Blast Baru</div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Nama Kampanye</label>
                  <input value={blastName} onChange={(e) => setBlastName(e.target.value)} placeholder="Contoh: Promo Lebaran 2025" className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]" />
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Pilih Grup Kontak</label>
                  <select value={blastGroup} onChange={handleGroupChange} className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]">
                    {groupNames.map((name, idx) => <option key={idx} value={idx}>{name}</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Template Pesan</label>
                  <textarea id="blast-template" rows="6" value={blastTemplate} onChange={(e) => setBlastTemplate(e.target.value)} className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)] resize-vertical"></textarea>
                  <div className="text-[11px] text-[var(--muted)] mt-1">Klik variabel di bawah untuk menyisipkan:</div>
                  <div className="flex gap-1.5 flex-wrap mt-1.5">
                    {['{{Nama}}', '{{Kota}}', '{{Produk}}', '{{Harga}}', '{{Tanggal}}'].map(v => (
                      <div key={v} onClick={() => insertVar(v)} className="bg-[var(--bg3)] border border-[var(--border)] rounded-md px-2.5 py-1 text-xs text-[var(--green)] cursor-pointer font-['DM_Mono',monospace] transition-colors hover:bg-[var(--bg4)]">{v}</div>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Jadwal Pengiriman</label>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1.5 text-[13px] cursor-pointer"><input type="radio" name="sched" checked={!scheduleMode} onChange={() => setScheduleMode(false)} /> Kirim Sekarang</label>
                    <label className="flex items-center gap-1.5 text-[13px] cursor-pointer"><input type="radio" name="sched" onChange={() => setScheduleMode(true)} /> Jadwalkan</label>
                  </div>
                  {scheduleMode && <input type="datetime-local" className="w-full mt-2 bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]" />}
                </div>
                <div className="flex gap-2.5">
                  <button onClick={previewBlast} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bg3)]">👁 Preview</button>
                  <button onClick={startBlast} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-[var(--green)] text-white hover:bg-[var(--green2)]">🚀 Jalankan Blast</button>
                </div>
              </div>
              <div>
                <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-5 mb-4">
                  <div className="text-sm font-bold mb-4">Preview Pesan</div>
                  <div className="bg-[#075E54] rounded-[var(--rl)] p-3">
                    <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-white/10">
                      <div className="w-9 h-9 rounded-full bg-[#128C7E] flex items-center justify-center font-bold text-[13px]">A</div>
                      <div><div className="text-[13px] font-semibold text-white">Akun WA Bisnis</div><div className="text-[11px] text-white/60">online</div></div>
                    </div>
                    <div className="bg-[#DCF8C6] rounded-[8px_8px_8px_0] p-2.5 max-w-[85%]">
                      <div className="text-[13px] text-[#111] whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: getPreviewText() }}></div>
                      <div className="text-[10px] text-[#667781] text-right mt-1">09:14 ✓✓</div>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-5">
                  <div className="text-sm font-bold mb-4">Ringkasan</div>
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-[var(--border)]"><td className="p-2 text-[var(--muted)]">Target Kontak</td><td className="p-2 font-semibold text-right">{groupNumbers[blastGroup].toLocaleString()}</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="p-2 text-[var(--muted)]">Estimasi Waktu</td><td className="p-2 font-semibold text-right">{getEstimatedTime()}</td></tr>
                      <tr className="border-b border-[var(--border)]"><td className="p-2 text-[var(--muted)]">Delay Antar Pesan</td><td className="p-2 font-semibold text-right">5 detik</td></tr>
                      <tr><td className="p-2 text-[var(--muted)]">Jenis Konten</td><td className="p-2 text-right"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(88,166,255,0.15)] text-[var(--blue)]">Teks</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* BLAST LOG PAGE */}
          <div className={activePage === 'blastlog' ? 'block' : 'hidden'}>
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-5">
              <div className="flex items-center justify-between text-sm font-bold mb-4">Riwayat Blast <span className="text-[var(--muted)] font-normal text-xs">Total 24 kampanye</span></div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[11px] font-bold text-[var(--muted)] text-left border-b border-[var(--border)]">
                    <th className="p-2">Kampanye</th><th>Tanggal</th><th>Kontak</th><th>Terkirim</th><th>Open Rate</th><th>Status</th><th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Promo Ramadan', date: '28 Mar 2025', total: 5200, sent: 5084, rate: 97.8 },
                    { name: 'Follow-up Q1', date: '15 Mar 2025', total: 890, sent: 881, rate: 99.0 },
                    { name: 'Promo Feb', date: '2 Feb 2025', total: 3100, sent: 3054, rate: 98.5 },
                    { name: 'Newsletter Jan', date: '10 Jan 2025', total: 2400, sent: 2280, rate: 95.0 },
                    { name: 'Test Blast', date: '5 Jan 2025', total: 50, sent: 42, rate: 84.0 },
                  ].map((b, i) => (
                    <tr key={i} className="border-b border-[var(--border)]">
                      <td className="p-2 font-semibold align-middle">{b.name}</td>
                      <td className="p-2 text-[var(--muted)] align-middle">{b.date}</td>
                      <td className="p-2 align-middle">{b.total.toLocaleString()}</td>
                      <td className="p-2 align-middle">{b.sent.toLocaleString()}</td>
                      <td className="p-2 align-middle"><span className={`font-semibold ${b.rate >= 95 ? 'text-[var(--green)]' : 'text-[var(--warn)]'}`}>{b.rate}%</span></td>
                      <td className="p-2 align-middle"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(0,200,83,0.15)] text-[var(--green)]">✓ Selesai</span></td>
                      <td className="p-2 align-middle"><button className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold bg-transparent text-[var(--text)] border border-[var(--border)]">Laporan</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CONTACTS PAGE */}
          <div className={activePage === 'contacts' ? 'block' : 'hidden'}>
            <div className="flex gap-3 mb-4 items-center">
              <div className="flex-1 flex gap-2.5">
                <input type="text" value={contactFilter} onChange={(e) => setContactFilter(e.target.value)} placeholder="🔍 Cari nama, nomor, kota..." className="flex-1 bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2 text-[13px] text-[var(--text)] focus:outline-none focus:border-[var(--green)]" />
              </div>
              <button onClick={() => openModal('import')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bg3)]">📁 Import CSV</button>
              <button onClick={() => openModal('addContact')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-[var(--green)] text-white hover:bg-[var(--green2)]">+ Tambah Kontak</button>
            </div>
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-5">
              <div className="flex items-center justify-between text-sm font-bold mb-4">Daftar Kontak <span className="text-[var(--muted)] font-normal text-xs">{filteredContacts.length} kontak</span></div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[11px] font-bold text-[var(--muted)] text-left border-b border-[var(--border)]">
                    <th className="p-2"><input type="checkbox" onChange={selectAllContacts} /></th><th>Nama</th><th>Nomor WA</th><th>Kota</th><th>Grup</th><th>Status</th><th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((c, i) => (
                    <tr key={i} className="border-b border-[var(--border)]">
                      <td className="p-2 align-middle"><input type="checkbox" checked={selectedAll} onChange={() => {}} /></td>
                      <td className="p-2 align-middle"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: c.color }}>{c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div><span className="font-semibold">{c.name}</span></div></td>
                      <td className="p-2 align-middle font-['DM_Mono',monospace] text-xs text-[var(--muted)]">{c.phone}</td>
                      <td className="p-2 align-middle text-[var(--muted)]">{c.city}</td>
                      <td className="p-2 align-middle"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(88,166,255,0.15)] text-[var(--blue)]">{c.group}</span></td>
                      <td className="p-2 align-middle"><span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${c.status === 'active' ? 'bg-[rgba(0,200,83,0.15)] text-[var(--green)]' : 'bg-[var(--bg3)] text-[var(--muted)]'}`}>{c.status === 'active' ? '● Aktif' : '○ Nonaktif'}</span></td>
                      <td className="p-2 align-middle"><div className="flex gap-1.5"><button className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-[rgba(37,211,102,0.15)] text-[var(--wa)] border border-[rgba(37,211,102,0.25)]">💬 WA</button><button className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold bg-transparent text-[var(--text)] border border-[var(--border)]">Edit</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PIPELINE PAGE */}
          <div className={activePage === 'pipeline' ? 'block' : 'hidden'}>
            <div className="flex justify-between items-center mb-4">
              <div className="text-[13px] text-[var(--muted)]">Total Pipeline: <strong className="text-[var(--green)]">Rp 895jt</strong></div>
              <button onClick={() => openModal('addDeal')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-[var(--green)] text-white hover:bg-[var(--green2)]">+ Deal Baru</button>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {['Prospek Baru', 'Kualifikasi', 'Presentasi', 'Negosiasi', 'Closing ✓'].map((stage, idx) => (
                <div key={idx} className="min-w-[160px] bg-[var(--bg3)] rounded-[var(--r)] p-3">
                  <div className="text-[10px] font-bold text-[var(--muted)] tracking-wide uppercase mb-2">{stage}</div>
                  <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-md p-2 mb-1.5"><div className="text-xs font-semibold">PT Maju Bersama</div><div className="text-[11px] text-[var(--muted)]">Siti Rahayu</div><div className="text-xs text-[var(--green)] mt-0.5">Rp 45jt</div></div>
                  <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-md p-2 mb-1.5"><div className="text-xs font-semibold">CV Sentosa Group</div><div className="text-[11px] text-[var(--muted)]">Budi Santoso</div><div className="text-xs text-[var(--green)] mt-0.5">Rp 22jt</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* ANALYTICS PAGE */}
          <div className={activePage === 'analytics' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-4 gap-3.5 mb-5">
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-[18px_20px]"><div className="text-[28px] font-extrabold text-[var(--green)]">284jt</div><div className="text-xs text-[var(--muted)] mt-1.5">Revenue (juta Rp)</div></div>
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-[18px_20px]"><div className="text-[28px] font-extrabold text-[var(--blue)]">98.2%</div><div className="text-xs text-[var(--muted)] mt-1.5">WA Open Rate</div></div>
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-[18px_20px]"><div className="text-[28px] font-extrabold text-[var(--warn)]">42.7%</div><div className="text-xs text-[var(--muted)] mt-1.5">Reply Rate</div></div>
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-[18px_20px]"><div className="text-[28px] font-extrabold">34.1%</div><div className="text-xs text-[var(--muted)] mt-1.5">Conversion Rate</div></div>
            </div>
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-5">
              <div className="text-sm font-bold mb-4">Blast Performa per Bulan</div>
              <div className="flex items-end gap-1.5 h-24 px-0.5">
                {blastChartData.map((v, i) => {
                  const max = Math.max(...blastChartData);
                  return <div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-[var(--blue)] opacity-70 transition-opacity hover:opacity-100" style={{ height: `${Math.max(8, Math.round(v / max * 100))}px` }}></div><div className="text-[9px] text-[var(--muted)]">{['Jan', 'Feb', 'Mar', 'Apr', 'Mei'][i]}</div></div>;
                })}
              </div>
            </div>
          </div>

          {/* SETTINGS PAGE */}
          <div className={activePage === 'settings' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-5">
                <div className="text-sm font-bold mb-4">Profil Bisnis</div>
                <div className="mb-4"><label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Nama Bisnis</label><input defaultValue="PT Karya Digital Nusantara" className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]" /></div>
                <div className="mb-4"><label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Email</label><input defaultValue="admin@blazcrm.id" className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]" /></div>
                <div className="mb-4"><label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Nomor WA Bisnis</label><input defaultValue="+62 812-3456-7890" className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]" /></div>
                <button onClick={() => showToast('✅ Profil disimpan!', 'success')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-[var(--green)] text-white hover:bg-[var(--green2)]">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {/* Import Modal */}
      {modals.import && (
        <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center" onClick={(e) => e.target === e.currentTarget && closeModal('import')}>
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-7 w-[480px] max-w-[90vw] max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5"><div className="text-base font-bold">📁 Import Kontak dari CSV</div><button onClick={() => closeModal('import')} className="bg-transparent border-none text-[var(--muted)] text-lg cursor-pointer p-1 rounded-md transition-colors hover:text-[var(--text)]">✕</button></div>
            <div className="border-2 border-dashed border-[var(--border)] rounded-[var(--rl)] p-8 text-center cursor-pointer transition-all hover:border-[var(--green)] hover:bg-[var(--greenp)]" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => document.getElementById('csv-file-input').click()}>
              <div className="text-3xl mb-2.5">📄</div>
              <p><strong>Klik atau drag & drop</strong> file CSV di sini</p>
              <p className="mt-1 text-[var(--muted)] text-[13px]">Format: nama, nomor_wa, kota, grup</p>
            </div>
            <input id="csv-file-input" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            <div className="mt-4 bg-[var(--bg3)] rounded-[var(--r)] p-3"><div className="text-xs font-bold text-[var(--muted)] mb-2">FORMAT CSV:</div><code className="font-['DM_Mono',monospace] text-xs text-[var(--green)]">nama,nomor_wa,kota,grup<br />Budi Santoso,08123456789,Jakarta,Pelanggan</code></div>
            <div className="flex gap-2.5 mt-4"><button onClick={() => closeModal('import')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-transparent text-[var(--text)] border border-[var(--border)]">Batal</button><button onClick={() => { closeModal('import'); showToast('✅ 342 kontak berhasil diimport!', 'success'); }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-[var(--green)] text-white">Upload & Import</button></div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {modals.addContact && (
        <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center" onClick={(e) => e.target === e.currentTarget && closeModal('addContact')}>
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-7 w-[480px] max-w-[90vw] max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5"><div className="text-base font-bold">+ Tambah Kontak</div><button onClick={() => closeModal('addContact')} className="bg-transparent border-none text-[var(--muted)] text-lg cursor-pointer p-1 rounded-md transition-colors hover:text-[var(--text)]">✕</button></div>
            <div className="mb-4"><label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Nama Lengkap</label><input placeholder="Contoh: Budi Santoso" className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]" /></div>
            <div className="mb-4"><label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Nomor WhatsApp</label><input placeholder="Contoh: 08123456789" className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]" /></div>
            <div className="mb-4"><label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Kota</label><input placeholder="Contoh: Jakarta" className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]" /></div>
            <div className="flex gap-2.5"><button onClick={() => closeModal('addContact')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-transparent text-[var(--text)] border border-[var(--border)]">Batal</button><button onClick={addContact} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-[var(--green)] text-white">Simpan Kontak</button></div>
          </div>
        </div>
      )}

      {/* Add Deal Modal */}
      {modals.addDeal && (
        <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center" onClick={(e) => e.target === e.currentTarget && closeModal('addDeal')}>
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-7 w-[480px] max-w-[90vw] max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5"><div className="text-base font-bold">+ Deal Baru</div><button onClick={() => closeModal('addDeal')} className="bg-transparent border-none text-[var(--muted)] text-lg cursor-pointer p-1 rounded-md transition-colors hover:text-[var(--text)]">✕</button></div>
            <div className="mb-4"><label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Nama Perusahaan</label><input placeholder="Contoh: PT Maju Bersama" className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]" /></div>
            <div className="mb-4"><label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Nilai Deal (Rp)</label><input type="number" placeholder="Contoh: 50000000" className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]" /></div>
            <div className="flex gap-2.5"><button onClick={() => closeModal('addDeal')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-transparent text-[var(--text)] border border-[var(--border)]">Batal</button><button onClick={() => { closeModal('addDeal'); showToast('✅ Deal baru ditambahkan!', 'success'); }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-[var(--green)] text-white">Simpan Deal</button></div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {modals.preview && (
        <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center" onClick={(e) => e.target === e.currentTarget && closeModal('preview')}>
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--rl)] p-7 w-[380px] max-w-[90vw] max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5"><div className="text-base font-bold">👁 Preview Blast</div><button onClick={() => closeModal('preview')} className="bg-transparent border-none text-[var(--muted)] text-lg cursor-pointer p-1 rounded-md transition-colors hover:text-[var(--text)]">✕</button></div>
            <div className="bg-[#075E54] rounded-[var(--rl)] p-3.5"><div className="bg-[#DCF8C6] rounded-[8px_8px_8px_0] p-2.5 text-[13px] text-[#111] whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: getPreviewText() }}></div></div>
            <button onClick={() => closeModal('preview')} className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold bg-transparent text-[var(--text)] border border-[var(--border)] mt-3">Tutup</button>
          </div>
        </div>
      )}

      {/* Animation Keyframes */}
      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 85%; }
          100% { top: 10%; }
        }
        @keyframes slide-in {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;