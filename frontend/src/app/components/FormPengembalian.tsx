import { useState } from 'react';
import { Search, Package, User, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

interface PeminjamanData {
  idPeminjaman: string;
  nim: string;
  namaPeminjam: string;
  namaBarang: string;
  kodeBarang: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  status: string;
}

export function FormPengembalian() {
  const [searchType, setSearchType] = useState<'id' | 'nim'>('id');
  const [searchQuery, setSearchQuery] = useState('');
  const [peminjamanData, setPeminjamanData] = useState<PeminjamanData | null>(null);
  const [kondisiBarang, setKondisiBarang] = useState<'baik' | 'rusak' | ''>('');
  const [kelengkapan, setKelengkapan] = useState({
    kabel: true,
    adaptor: true,
    tas: true,
    manual: true,
  });
  const [catatan, setCatatan] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock data - in production, this would be from API
  const mockPeminjaman: { [key: string]: PeminjamanData } = {
    'PJM-2024-001': {
      idPeminjaman: 'PJM-2024-001',
      nim: '210401001',
      namaPeminjam: 'Ahmad Fauzi',
      namaBarang: 'Proyektor Portable Epson',
      kodeBarang: 'BRG-2024-001',
      tanggalPinjam: '2026-04-10',
      tanggalKembali: '2026-04-13',
      status: 'Dipinjam',
    },
    '210401001': {
      idPeminjaman: 'PJM-2024-001',
      nim: '210401001',
      namaPeminjam: 'Ahmad Fauzi',
      namaBarang: 'Proyektor Portable Epson',
      kodeBarang: 'BRG-2024-001',
      tanggalPinjam: '2026-04-10',
      tanggalKembali: '2026-04-13',
      status: 'Dipinjam',
    },
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const data = mockPeminjaman[searchQuery];
    if (data) {
      setPeminjamanData(data);
      setKondisiBarang('');
      setCatatan('');
      setKelengkapan({ kabel: true, adaptor: true, tas: true, manual: true });
    } else {
      setPeminjamanData(null);
      alert('Data peminjaman tidak ditemukan');
    }
  };

  const handleKonfirmasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kondisiBarang) {
      alert('Pilih kondisi barang terlebih dahulu');
      return;
    }
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setPeminjamanData(null);
      setSearchQuery('');
      setKondisiBarang('');
      setCatatan('');
    }, 3000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Pengembalian Barang</h1>
        <p className="text-gray-600">Proses pengembalian barang yang dipinjam</p>
      </div>

      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="text-emerald-600" size={24} />
          <div>
            <p className="font-medium text-emerald-900">Pengembalian berhasil dikonfirmasi!</p>
            <p className="text-sm text-emerald-700">Status barang telah diperbarui menjadi "Tersedia".</p>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Cari Data Peminjaman</h2>

        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setSearchType('id')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              searchType === 'id'
                ? 'bg-[#0F172A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Package size={18} />
            <span>ID Peminjaman</span>
          </button>
          <button
            type="button"
            onClick={() => setSearchType('nim')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              searchType === 'nim'
                ? 'bg-[#0F172A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User size={18} />
            <span>NIM</span>
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchType === 'id' ? 'Masukkan ID Peminjaman (e.g., PJM-2024-001)' : 'Masukkan NIM (e.g., 210401001)'}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#059669] text-white rounded-lg font-medium hover:bg-[#047857] transition-colors"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Peminjaman Data Display */}
      {peminjamanData && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Data Peminjaman</h2>

          <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">ID Peminjaman</p>
              <p className="font-mono font-semibold text-gray-900">{peminjamanData.idPeminjaman}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">NIM</p>
              <p className="font-mono font-semibold text-gray-900">{peminjamanData.nim}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Nama Peminjam</p>
              <p className="font-semibold text-gray-900">{peminjamanData.namaPeminjam}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Barang yang Dipinjam</p>
              <p className="font-semibold text-gray-900">{peminjamanData.namaBarang}</p>
              <p className="text-xs font-mono text-gray-500 mt-0.5">{peminjamanData.kodeBarang}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Tanggal Pinjam</p>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <p className="font-medium text-gray-900">
                  {new Date(peminjamanData.tanggalPinjam).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Batas Pengembalian</p>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <p className="font-medium text-gray-900">
                  {new Date(peminjamanData.tanggalKembali).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleKonfirmasi} className="space-y-6">
            {/* Kondisi Barang */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Kondisi Barang <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setKondisiBarang('baik')}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                    kondisiBarang === 'baik'
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      kondisiBarang === 'baik' ? 'border-emerald-600' : 'border-gray-300'
                    }`}
                  >
                    {kondisiBarang === 'baik' && <div className="w-3 h-3 bg-emerald-600 rounded-full" />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle size={20} className="text-emerald-600" />
                      <span className="font-semibold text-gray-900">Baik</span>
                    </div>
                    <p className="text-sm text-gray-600">Tidak ada kerusakan</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setKondisiBarang('rusak')}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                    kondisiBarang === 'rusak'
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      kondisiBarang === 'rusak' ? 'border-red-600' : 'border-gray-300'
                    }`}
                  >
                    {kondisiBarang === 'rusak' && <div className="w-3 h-3 bg-red-600 rounded-full" />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={20} className="text-red-600" />
                      <span className="font-semibold text-gray-900">Rusak</span>
                    </div>
                    <p className="text-sm text-gray-600">Ada kerusakan/cacat</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Checklist Kelengkapan */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Checklist Kelengkapan</label>
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                {Object.entries(kelengkapan).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setKelengkapan({ ...kelengkapan, [key]: e.target.checked })}
                      className="w-5 h-5 text-[#059669] border-gray-300 rounded focus:ring-[#059669]"
                    />
                    <span className="text-gray-900 capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Catatan */}
            <div>
              <label htmlFor="catatan" className="block text-sm font-medium text-gray-900 mb-2">
                Catatan Kelengkapan/Kerusakan
              </label>
              <textarea
                id="catatan"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tulis catatan jika ada kelengkapan yang hilang atau kerusakan yang ditemukan..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F172A] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#059669] text-white rounded-lg font-semibold hover:bg-[#047857] transition-colors text-lg"
            >
              Konfirmasi Pengembalian
            </button>
          </form>
        </div>
      )}

      {!peminjamanData && searchQuery === '' && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Package className="mx-auto mb-4 text-gray-300" size={64} />
          <p className="text-gray-500">Masukkan ID Peminjaman atau NIM untuk memulai proses pengembalian</p>
        </div>
      )}
    </div>
  );
}
