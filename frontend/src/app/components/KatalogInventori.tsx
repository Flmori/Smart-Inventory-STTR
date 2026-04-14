import { useState } from 'react';
import { Search, Package, MapPin, DoorOpen } from 'lucide-react';

export function KatalogInventori() {
  const [activeTab, setActiveTab] = useState<'barang' | 'ruangan'>('barang');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const barangCategories = ['Semua', 'Elektronik', 'Olahraga', 'Kesenian', 'Dokumentasi', 'Furniture'];
  const ruanganCategories = ['Semua', 'Ruang Kelas', 'Laboratorium', 'Auditorium', 'Ruang Meeting', 'Lainnya'];

  const barangList = [
    {
      id: 1,
      nama: 'Proyektor Portable Epson',
      kode: 'BRG-2024-001',
      kategori: 'Elektronik',
      lokasi: 'Gudang Sarpras Lt.2',
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400',
      status: 'Tersedia',
    },
    {
      id: 2,
      nama: 'Sound System JBL',
      kode: 'BRG-2024-002',
      kategori: 'Elektronik',
      lokasi: 'Gedung Serbaguna',
      image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400',
      status: 'Dipinjam',
      peminjam: 'UKM Musik',
    },
    {
      id: 3,
      nama: 'Bola Futsal Mikasa',
      kode: 'BRG-2024-003',
      kategori: 'Olahraga',
      lokasi: 'Gudang Olahraga',
      image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400',
      status: 'Tersedia',
    },
    {
      id: 4,
      nama: 'Kamera DSLR Canon EOS',
      kode: 'BRG-2024-004',
      kategori: 'Dokumentasi',
      lokasi: 'Ruang Media',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      status: 'Dipinjam',
      peminjam: 'UKM Fotografi',
    },
    {
      id: 5,
      nama: 'Gitar Akustik Yamaha',
      kode: 'BRG-2024-005',
      kategori: 'Kesenian',
      lokasi: 'Ruang Musik',
      image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400',
      status: 'Perbaikan',
    },
    {
      id: 6,
      nama: 'Kursi Lipat Chitose',
      kode: 'BRG-2024-006',
      kategori: 'Furniture',
      lokasi: 'Gudang Sarpras Lt.1',
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
      status: 'Tersedia',
    },
  ];

  const ruanganList = [
    {
      id: 1,
      nama: 'Ruang Kelas A301',
      kode: 'RNG-A301',
      kategori: 'Ruang Kelas',
      kapasitas: 40,
      fasilitas: ['Proyektor', 'AC', 'Whiteboard'],
      status: 'Tersedia',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400',
    },
    {
      id: 2,
      nama: 'Lab Komputer 1',
      kode: 'RNG-LAB01',
      kategori: 'Laboratorium',
      kapasitas: 30,
      fasilitas: ['30 Unit PC', 'AC', 'Proyektor'],
      status: 'Dipinjam',
      peminjam: 'Kelas TI 3A',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    },
    {
      id: 3,
      nama: 'Auditorium Utama',
      kode: 'RNG-AUD01',
      kategori: 'Auditorium',
      kapasitas: 300,
      fasilitas: ['Sound System', 'Proyektor', 'AC Central', 'Panggung'],
      status: 'Tersedia',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400',
    },
    {
      id: 4,
      nama: 'Ruang Meeting B201',
      kode: 'RNG-B201',
      kategori: 'Ruang Meeting',
      kapasitas: 15,
      fasilitas: ['TV LED', 'AC', 'Meja Meeting'],
      status: 'Tersedia',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    },
    {
      id: 5,
      nama: 'Lab Fisika',
      kode: 'RNG-LAB02',
      kategori: 'Laboratorium',
      kapasitas: 25,
      fasilitas: ['Alat Praktikum', 'AC', 'Meja Lab'],
      status: 'Perbaikan',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
    },
  ];

  const currentCategories = activeTab === 'barang' ? barangCategories : ruanganCategories;
  const currentData = activeTab === 'barang' ? barangList : ruanganList;

  const filteredData = currentData.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.kategori === selectedCategory;
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Tersedia':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Dipinjam':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Perbaikan':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Inventori</h1>
        <p className="text-gray-600">Lihat daftar barang dan ruangan yang tersedia</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setActiveTab('barang');
            setSelectedCategory('Semua');
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'barang'
              ? 'bg-[#0F172A] text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
          }`}
        >
          <Package size={20} />
          <span>Barang</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('ruangan');
            setSelectedCategory('Semua');
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'ruangan'
              ? 'bg-[#059669] text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
          }`}
        >
          <DoorOpen size={20} />
          <span>Ruangan</span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Cari ${activeTab === 'barang' ? 'barang' : 'ruangan'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? activeTab === 'barang'
                    ? 'bg-[#0F172A] text-white'
                    : 'bg-[#059669] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48 bg-gray-100">
              <img src={item.image} alt={item.nama} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-2 mb-2">
                {activeTab === 'barang' ? (
                  <Package className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                ) : (
                  <DoorOpen className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{item.nama}</h3>
                  <p className="text-xs font-mono text-gray-500">{item.kode}</p>
                </div>
              </div>

              {activeTab === 'barang' ? (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span>{(item as any).lokasi}</span>
                  </div>
                  <p className="text-sm text-gray-500">Kategori: {item.kategori}</p>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Kapasitas:</span> {(item as any).kapasitas} orang
                  </p>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Fasilitas:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(item as any).fasilitas.map((f: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {item.status === 'Dipinjam' && (item as any).peminjam && (
                <p className="text-xs text-blue-600 mb-3">Dipinjam oleh: {(item as any).peminjam}</p>
              )}

              <button
                disabled={item.status !== 'Tersedia'}
                className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                  item.status === 'Tersedia'
                    ? activeTab === 'barang'
                      ? 'bg-[#0F172A] text-white hover:bg-[#1E293B]'
                      : 'bg-[#059669] text-white hover:bg-[#047857]'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {item.status === 'Tersedia' ? 'Ajukan Peminjaman' : 'Tidak Tersedia'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Package className="mx-auto mb-4 text-gray-300" size={64} />
          <p>Tidak ada {activeTab} yang sesuai dengan pencarian.</p>
        </div>
      )}
    </div>
  );
}
