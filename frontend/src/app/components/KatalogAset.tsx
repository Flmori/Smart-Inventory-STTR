import { useState } from 'react';
import { Search, QrCode, Filter } from 'lucide-react';

export function KatalogAset() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Semua', 'Elektronik', 'Furniture', 'Alat Lab', 'Kendaraan', 'Lainnya'];

  const assets = [
    {
      code: 'AST-2024-001',
      name: 'Proyektor Epson EB-X41',
      location: 'Ruang A301',
      category: 'Elektronik',
      status: 'Baik',
    },
    {
      code: 'AST-2024-002',
      name: 'Kursi Kuliah Lipat',
      location: 'Ruang D102',
      category: 'Furniture',
      status: 'Rusak',
    },
    {
      code: 'AST-2024-003',
      name: 'Mikroskop Olympus CX23',
      location: 'Lab Biologi',
      category: 'Alat Lab',
      status: 'Baik',
    },
    {
      code: 'AST-2024-004',
      name: 'AC Daikin 2 PK',
      location: 'Lab Komputer 1',
      category: 'Elektronik',
      status: 'Baik',
    },
    {
      code: 'AST-2024-005',
      name: 'Meja Kerja Kayu Jati',
      location: 'Ruang Dosen',
      category: 'Furniture',
      status: 'Dipinjam',
    },
    {
      code: 'AST-2024-006',
      name: 'Komputer PC Dell Optiplex',
      location: 'Lab Komputer 2',
      category: 'Elektronik',
      status: 'Baik',
    },
    {
      code: 'AST-2024-007',
      name: 'Papan Tulis Whiteboard',
      location: 'Ruang A205',
      category: 'Lainnya',
      status: 'Rusak',
    },
    {
      code: 'AST-2024-008',
      name: 'Motor Honda Supra X',
      location: 'Garasi Kampus',
      category: 'Kendaraan',
      status: 'Baik',
    },
    {
      code: 'AST-2024-009',
      name: 'Mesin Fotokopi Canon',
      location: 'Gedung B Lt.1',
      category: 'Elektronik',
      status: 'Baik',
    },
    {
      code: 'AST-2024-010',
      name: 'Rak Buku Besi',
      location: 'Perpustakaan',
      category: 'Furniture',
      status: 'Baik',
    },
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = selectedCategory === 'Semua' || asset.category === selectedCategory;
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Baik':
        return 'bg-green-100 text-green-700';
      case 'Rusak':
        return 'bg-red-100 text-red-700';
      case 'Dipinjam':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Aset</h1>
        <p className="text-gray-600">Daftar lengkap aset kampus STTR</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, kode, atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-900 transition-colors">
            <QrCode size={20} />
            <span>Cetak Label QR</span>
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Filter size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter Kategori:</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Kode Aset</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Nama Barang</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Lokasi (Ruangan)</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Kategori</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.code} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm text-gray-900">{asset.code}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{asset.name}</td>
                  <td className="py-3 px-4 text-gray-600">{asset.location}</td>
                  <td className="py-3 px-4 text-gray-600">{asset.category}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Tidak ada data aset yang sesuai dengan pencarian.</p>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          Menampilkan {filteredAssets.length} dari {assets.length} aset
        </div>
      </div>
    </div>
  );
}
