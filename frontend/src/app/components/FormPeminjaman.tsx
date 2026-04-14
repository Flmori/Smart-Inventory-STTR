import { useState } from 'react';
import { User, Users, Calendar, CheckCircle } from 'lucide-react';

export function FormPeminjaman() {
  const [peminjamType, setPeminjamType] = useState<'mahasiswa' | 'ukm'>('mahasiswa');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nim: '',
    nama: '',
    noWa: '',
    aset: '',
    tanggalPinjam: '',
    tanggalKembali: '',
    keperluan: '',
  });

  const availableAssets = [
    'Proyektor Portable',
    'Bola Futsal',
    'Tenda Dome 6 Orang',
    'Microphone Wireless',
    'Banner Stand',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (peminjamType === 'ukm') {
      alert('Silakan login dengan akun UKM Anda');
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        nim: '',
        nama: '',
        noWa: '',
        aset: '',
        tanggalPinjam: '',
        tanggalKembali: '',
        keperluan: '',
      });
    }, 4000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Peminjaman Aset</h1>
        <p className="text-gray-600">Ajukan peminjaman aset kampus untuk kegiatan Anda</p>
      </div>

      <div className="max-w-2xl">
        {isSubmitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="font-medium text-green-900">Pengajuan berhasil dikirim!</p>
              <p className="text-sm text-green-700">
                Tim Sarpras akan meninjau pengajuan Anda. Anda akan dihubungi melalui WhatsApp.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-900 mb-3">Tipe Peminjam</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPeminjamType('mahasiswa')}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                  peminjamType === 'mahasiswa'
                    ? 'border-[#1E3A8A] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    peminjamType === 'mahasiswa' ? 'border-[#1E3A8A]' : 'border-gray-300'
                  }`}
                >
                  {peminjamType === 'mahasiswa' && <div className="w-3 h-3 bg-[#1E3A8A] rounded-full" />}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={18} className="text-gray-600" />
                    <span className="font-medium text-gray-900">Mahasiswa</span>
                  </div>
                  <p className="text-xs text-gray-500">Peminjaman individu</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPeminjamType('ukm')}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                  peminjamType === 'ukm'
                    ? 'border-[#1E3A8A] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    peminjamType === 'ukm' ? 'border-[#1E3A8A]' : 'border-gray-300'
                  }`}
                >
                  {peminjamType === 'ukm' && <div className="w-3 h-3 bg-[#1E3A8A] rounded-full" />}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={18} className="text-gray-600" />
                    <span className="font-medium text-gray-900">UKM</span>
                  </div>
                  <p className="text-xs text-gray-500">Peminjaman organisasi</p>
                </div>
              </button>
            </div>
          </div>

          {peminjamType === 'mahasiswa' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nim" className="block text-sm font-medium text-gray-900 mb-2">
                    NIM <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nim"
                    required
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                    placeholder="Contoh: 210401001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-900 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nama"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Nama lengkap Anda"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="noWa" className="block text-sm font-medium text-gray-900 mb-2">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="noWa"
                  required
                  value={formData.noWa}
                  onChange={(e) => setFormData({ ...formData, noWa: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="aset" className="block text-sm font-medium text-gray-900 mb-2">
                  Pilih Aset <span className="text-red-500">*</span>
                </label>
                <select
                  id="aset"
                  required
                  value={formData.aset}
                  onChange={(e) => setFormData({ ...formData, aset: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih aset yang ingin dipinjam --</option>
                  {availableAssets.map((asset, index) => (
                    <option key={index} value={asset}>
                      {asset}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tanggalPinjam" className="block text-sm font-medium text-gray-900 mb-2">
                    Tanggal Pinjam <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      id="tanggalPinjam"
                      required
                      value={formData.tanggalPinjam}
                      onChange={(e) => setFormData({ ...formData, tanggalPinjam: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="tanggalKembali" className="block text-sm font-medium text-gray-900 mb-2">
                    Tanggal Kembali <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      id="tanggalKembali"
                      required
                      value={formData.tanggalKembali}
                      onChange={(e) => setFormData({ ...formData, tanggalKembali: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="keperluan" className="block text-sm font-medium text-gray-900 mb-2">
                  Keperluan Peminjaman <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="keperluan"
                  required
                  value={formData.keperluan}
                  onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
                  placeholder="Jelaskan keperluan peminjaman aset..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
              >
                Kirim Pengajuan
              </button>
            </form>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto mb-4 text-[#1E3A8A]" size={64} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Login Akun UKM</h3>
              <p className="text-gray-600 mb-6">
                Untuk peminjaman atas nama UKM, silakan login menggunakan akun UKM yang telah terdaftar.
              </p>
              <button className="bg-[#1E3A8A] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors">
                Login Akun UKM
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Belum punya akun? Hubungi Admin Sarpras untuk pendaftaran.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
