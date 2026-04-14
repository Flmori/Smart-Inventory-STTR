import { Package, AlertTriangle, Users, Calendar } from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      label: 'Total Aset',
      value: '1,247',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Barang Rusak',
      value: '23',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Sedang Dipinjam',
      value: '156',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Jadwal Servis Minggu Ini',
      value: '8',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const upcomingServices = [
    { item: 'Proyektor Ruang A301', date: '14 Apr 2026', type: 'Servis Rutin' },
    { item: 'AC Ruang Lab Komputer 1', date: '15 Apr 2026', type: 'Perbaikan' },
    { item: 'Mesin Fotokopi Gedung B', date: '16 Apr 2026', type: 'Servis Rutin' },
    { item: 'Komputer Lab 2 Unit 5', date: '17 Apr 2026', type: 'Perbaikan' },
    { item: 'Printer Administrasi', date: '18 Apr 2026', type: 'Servis Rutin' },
    { item: 'Kipas Angin Ruang C201', date: '19 Apr 2026', type: 'Perbaikan' },
  ];

  const recentDamage = [
    { item: 'Kursi Kelas D102', reporter: 'Ahmad Fauzi', date: '12 Apr 2026', status: 'Menunggu' },
    { item: 'Papan Tulis Ruang A205', reporter: 'Siti Nurhaliza', date: '12 Apr 2026', status: 'Proses' },
    { item: 'Lampu Koridor Lt.3', reporter: 'Budi Santoso', date: '11 Apr 2026', status: 'Proses' },
    { item: 'Meja Lab Fisika', reporter: 'Rina Wati', date: '10 Apr 2026', status: 'Selesai' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Ringkasan data aset kampus STTR</p>
      </div>

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
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Jadwal Servis Minggu Ini</h2>
          <div className="space-y-3">
            {upcomingServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{service.item}</p>
                  <p className="text-sm text-gray-500">{service.type}</p>
                </div>
                <div className="text-sm text-gray-600">{service.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Laporan Kerusakan Terbaru</h2>
          <div className="space-y-3">
            {recentDamage.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.item}</p>
                  <p className="text-sm text-gray-500">Dilaporkan oleh: {item.reporter}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      item.status === 'Selesai'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'Proses'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {item.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
