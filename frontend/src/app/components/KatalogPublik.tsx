import { useState } from 'react';
import { Search, Package, MapPin } from 'lucide-react';

export function KatalogPublik() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Semua', 'Elektronik', 'Olahraga', 'Kesenian', 'Dokumentasi', 'Lainnya'];

  const assets = [
    {
      id: 1,
      name: 'Proyektor Portable',
      category: 'Elektronik',
      location: 'Gudang Sarpras',
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400',
      status: 'Tersedia',
    },
    {
      id: 2,
      name: 'Sound System',
      category: 'Elektronik',
      location: 'Gedung Serbaguna',
      image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400',
      status: 'Dipinjam oleh UKM Musik',
    },
    {
      id: 3,
      name: 'Bola Futsal',
      category: 'Olahraga',
      location: 'Gudang Olahraga',
      image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400',
      status: 'Tersedia',
    },
    {
      id: 4,
      name: 'Kamera DSLR Canon',
      category: 'Dokumentasi',
      location: 'Ruang Media',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      status: 'Dipinjam oleh UKM Fotografi',
    },
    {
      id: 5,
      name: 'Tenda Dome 6 Orang',
      category: 'Lainnya',
      location: 'Gudang Sarpras',
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400',
      status: 'Tersedia',
    },
    {
      id: 6,
      name: 'Gitar Akustik',
      category: 'Kesenian',
      location: 'Ruang Musik',
      image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400',
      status: 'Dalam Perbaikan',
    },
    {
      id: 7,
      name: 'Microphone Wireless',
      category: 'Elektronik',
      location: 'Gedung Serbaguna',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
      status: 'Tersedia',
    },
    {
      id: 8,
      name: 'Banner Stand',
      category: 'Lainnya',
      location: 'Gudang Sarpras',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
      status: 'Tersedia',
    },
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = selectedCategory === 'Semua' || asset.category === selectedCategory;
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'Tersedia') {
      return 'bg-green-100 text-green-700 border-green-200';
    } else if (status.startsWith('Dipinjam')) {
      return 'bg-blue-100 text-blue-700 border-blue-200';
    } else {
      return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Aset Kampus</h1>
        <p className="text-gray-600">Lihat dan ajukan peminjaman aset untuk kegiatan Anda</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari aset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48 bg-gray-100">
              <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                    asset.status
                  )}`}
                >
                  {asset.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-2 mb-2">
                <Package className="text-gray-400 mt-0.5" size={18} />
                <h3 className="font-bold text-gray-900 flex-1">{asset.name}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <MapPin size={16} />
                <span>{asset.location}</span>
              </div>
              <button
                disabled={asset.status !== 'Tersedia'}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  asset.status === 'Tersedia'
                    ? 'bg-[#1E3A8A] text-white hover:bg-blue-900'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {asset.status === 'Tersedia' ? 'Ajukan Peminjaman' : 'Tidak Tersedia'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Package className="mx-auto mb-4 text-gray-300" size={64} />
          <p>Tidak ada aset yang sesuai dengan pencarian.</p>
        </div>
      )}
    </div>
  );
}
