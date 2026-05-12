import React, { useState, useEffect } from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Table from '../components/common/Table';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        revenue: 0,
        activeDeals: 0,
        totalBlastSent: 0,
        avgOpenRate: 0
    });
    const [recentDeals, setRecentDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revenueData] = useState([42, 58, 71, 63, 88, 79, 95]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsRes, dealsRes] = await Promise.all([
                getDashboardStats(),
                getRecentDeals()
            ]);
            setStats(statsRes.data);
            setRecentDeals(dealsRes.data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const dealColumns = [
        { key: 'company_name', header: 'Perusahaan', render: (val) => <span className="font-semibold">{val}</span> },
        { key: 'pic_name', header: 'PIC', render: (val) => <span className="text-[#7D8590]">{val || '-'}</span> },
        { key: 'value', header: 'Nilai', render: (val) => <span className="text-[#00C853] font-semibold">{formatCurrency(val)}</span> },
        {
            key: 'stage', header: 'Stage', render: (val) => {
                const variant = val === 'Closing' ? 'success' : val === 'Negosiasi' ? 'warning' : 'info';
                return <Badge variant={variant}>{val || 'Prospek Baru'}</Badge>;
            }
        },
        { key: 'id', header: 'Aksi', render: () => <Button variant="whatsapp" size="sm">💬 WA</Button> }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-[#21262D] border-t-[#00C853] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#7D8590]">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Metrics Row */}
            <div className="grid grid-cols-4 gap-3.5 mb-5">
                <MetricCard title="Revenue Bulan Ini" value={stats.revenue} color="green" trend="up" trendValue="23% vs bulan lalu" />
                <MetricCard title="Deal Aktif" value={stats.activeDeals} trend="up" trendValue="8 deal baru minggu ini" />
                <MetricCard title="Pesan WA Terkirim" value={stats.totalBlastSent} color="blue" trend="up" trendValue="3 blast aktif" />
                <MetricCard title="Open Rate Rata-rata" value={`${stats.avgOpenRate}%`} color="yellow" trend="up" trendValue="2.1% vs minggu lalu" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <Card title="Blast Aktif" action={<Button variant="secondary" size="sm">+ Buat Baru</Button>}>
                    <Table
                        columns={[
                            {
                                key: 'name', header: 'Nama', render: (val, row) => (
                                    <div>
                                        <span className="font-semibold">{val}</span>
                                        <br />
                                        <span className="text-[11px] text-[#7D8590]">{row.target_count} kontak</span>
                                    </div>
                                )
                            },
                            {
                                key: 'progress', header: 'Progress', render: (_, row) => (
                                    <div className="w-[140px]">
                                        <div className="bg-[#21262D] rounded-full h-2 overflow-hidden">
                                            <div className="h-full rounded-full bg-[#00C853]" style={{ width: `${row.sent_count / row.target_count * 100}%` }}></div>
                                        </div>
                                        <span className="text-[11px] text-[#7D8590]">{row.sent_count} / {row.target_count}</span>
                                    </div>
                                )
                            },
                            { key: 'status', header: 'Status', render: (val) => <Badge variant={val === 'Selesai' ? 'success' : 'warning'}>{val}</Badge> }
                        ]}
                        data={activeBlasts}
                    />
                </Card>

                <Card title="Revenue 7 Hari Terakhir">
                    <div className="flex items-end gap-1.5 h-20 px-0.5">
                        {revenueData.map((v, i) => {
                            const max = Math.max(...revenueData);
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full rounded-t-md bg-[#00C853] opacity-70 transition-opacity hover:opacity-100"
                                        style={{ height: `${Math.max(8, Math.round(v / max * 100))}px` }}
                                    ></div>
                                    <div className="text-[9px] text-[#7D8590]">{i + 1}</div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Recent Deals */}
            <Card title="Deal Terbaru" action={<Button variant="secondary" size="sm">Lihat Semua</Button>}>
                <Table columns={dealColumns} data={recentDeals.slice(0, 5)} />
            </Card>
        </div>
    );
};

export default DashboardPage;