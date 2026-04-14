import { Package, AlertTriangle, Users, Calendar, TrendingUp, Clock } from 'lucide-react';

export function DashboardInventory() {
  const stats = [
    {
      label: 'Total Barang',
      value: '1,247',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12%',
    },
    {
      label: 'Barang Rusak',
      value: '23',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: '-5%',
    },
    {
      label: 'Sedang Dipinjam',
      value: '156',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: '+8%',
    },
    {
      label: 'Jadwal Servis',
      value: '8',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '3 hari ini',
    },
  ];

  const peminjaman = [
    {
      peminjam: 'Ahmad Fauzi',
      barang: 'Proyektor Portable',
      tanggal: '10 Apr - 13 Apr 2026',
      status: 'Aktif',
    },
    {
      peminjam: 'UKM Musik',
      barang: 'Sound System JBL',
      tanggal: '12 Apr - 15 Apr 2026',
      status: 'Aktif',
    },
    {
      peminjam: 'Siti Nurhaliza',
      barang: 'Kamera DSLR Canon',
      tanggal: '11 Apr - 14 Apr 2026',
      status: 'Aktif',
    },
    {
      peminjam: 'UKM Fotografi',
      barang: 'Tenda Dome',
      tanggal: '09 Apr - 12 Apr 2026',
      status: 'Terlambat',
    },
  ];

  const aktivitasTerbaru = [
    {
      aksi: 'Pengembalian barang',
      detail: 'Proyektor Epson EB-X41 dikembalikan oleh Budi Santoso',
      waktu: '2 jam yang lalu',
      icon: Package,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      aksi: 'Peminjaman baru',
      detail: 'UKM Olahraga meminjam Bola Futsal',
      waktu: '3 jam yang lalu',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      aksi: 'Laporan kerusakan',
      detail: 'Gitar Akustik dilaporkan rusak oleh Ahmad Fauzi',
      waktu: '5 jam yang lalu',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      aksi: 'Perbaikan selesai',
      detail: 'AC Daikin 2 PK telah selesai diperbaiki',
      waktu: '1 hari yang lalu',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Smart-Inventory</h1>
        <p className="text-gray-600">Selamat datang di sistem manajemen inventori kampus STTR</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <TrendingUp size={14} />
                  <span>{stat.trend}</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Peminjaman Aktif */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="text-emerald-600" size={24} />
            Peminjaman Aktif
          </h2>
          <div className="space-y-3">
            {peminjaman.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.peminjam}</p>
                  <p className="text-sm text-gray-600">{item.barang}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.tanggal}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'Aktif'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="text-[#0F172A]" size={24} />
            Aktivitas Terbaru
          </h2>
          <div className="space-y-4">
            {aktivitasTerbaru.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex gap-3">
                  <div className={`${item.bgColor} ${item.color} p-2 rounded-lg h-fit`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{item.aksi}</p>
                    <p className="text-sm text-gray-600">{item.detail}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.waktu}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-left transition-all">
            <Package size={24} className="mb-2" />
            <p className="font-semibold">Tambah Barang Baru</p>
            <p className="text-xs text-gray-300 mt-1">Input data barang inventori</p>
          </button>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-left transition-all">
            <Users size={24} className="mb-2" />
            <p className="font-semibold">Lihat Peminjaman</p>
            <p className="text-xs text-gray-300 mt-1">Kelola approval peminjaman</p>
          </button>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-left transition-all">
            <AlertTriangle size={24} className="mb-2" />
            <p className="font-semibold">Lapor Kerusakan</p>
            <p className="text-xs text-gray-300 mt-1">Laporkan barang rusak</p>
          </button>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-left transition-all">
            <Calendar size={24} className="mb-2" />
            <p className="font-semibold">Jadwal Servis</p>
            <p className="text-xs text-gray-300 mt-1">Lihat jadwal maintenance</p>
          </button>
        </div>
      </div>
    </div>
  );
}
