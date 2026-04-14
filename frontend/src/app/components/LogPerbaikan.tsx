import { useState } from 'react';
import { Wrench, CheckCircle } from 'lucide-react';

export function LogPerbaikan() {
  const [formData, setFormData] = useState({
    kodeAset: '',
    namaBarang: '',
    teknisi: '',
    deskripsiPerbaikan: '',
    biayaPerbaikan: '',
    statusAkhir: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const damagedAssets = [
    { code: 'AST-2024-002', name: 'Kursi Kuliah Lipat - Ruang D102' },
    { code: 'AST-2024-007', name: 'Papan Tulis Whiteboard - Ruang A205' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        kodeAset: '',
        namaBarang: '',
        teknisi: '',
        deskripsiPerbaikan: '',
        biayaPerbaikan: '',
        statusAkhir: '',
      });
    }, 3000);
  };

  const handleAssetChange = (code: string) => {
    const asset = damagedAssets.find((a) => a.code === code);
    setFormData({
      ...formData,
      kodeAset: code,
      namaBarang: asset ? asset.name : '',
    });
  };

  const repairHistory = [
    {
      code: 'AST-2024-001',
      item: 'Proyektor Epson EB-X41',
      date: '10 Apr 2026',
      technician: 'Andi Pratama',
      cost: 'Rp 250.000',
      status: 'Selesai - Baik',
    },
    {
      code: 'AST-2024-004',
      item: 'AC Daikin 2 PK',
      date: '08 Apr 2026',
      technician: 'Budi Santoso',
      cost: 'Rp 450.000',
      status: 'Selesai - Baik',
    },
    {
      code: 'AST-2024-006',
      item: 'Komputer PC Dell Optiplex',
      date: '05 Apr 2026',
      technician: 'Andi Pratama',
      cost: 'Rp 150.000',
      status: 'Selesai - Baik',
    },
    {
      code: 'AST-2024-003',
      item: 'Mikroskop Olympus CX23',
      date: '02 Apr 2026',
      technician: 'Dewi Lestari',
      cost: 'Rp 800.000',
      status: 'Selesai - Baik',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Log Perbaikan</h1>
        <p className="text-gray-600">Input data perbaikan dan riwayat pemeliharaan aset</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {isSubmitted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="font-medium text-green-900">Data perbaikan berhasil disimpan!</p>
                <p className="text-sm text-green-700">Status aset telah diperbarui.</p>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                <Wrench size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Input Data Perbaikan</h2>
                <p className="text-sm text-gray-600">Khusus teknisi</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="kodeAset" className="block text-sm font-medium text-gray-900 mb-2">
                  Pilih Aset Rusak <span className="text-red-500">*</span>
                </label>
                <select
                  id="kodeAset"
                  required
                  value={formData.kodeAset}
                  onChange={(e) => handleAssetChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih aset yang diperbaiki --</option>
                  {damagedAssets.map((asset) => (
                    <option key={asset.code} value={asset.code}>
                      {asset.code} - {asset.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="teknisi" className="block text-sm font-medium text-gray-900 mb-2">
                  Nama Teknisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="teknisi"
                  required
                  value={formData.teknisi}
                  onChange={(e) => setFormData({ ...formData, teknisi: e.target.value })}
                  placeholder="Masukkan nama teknisi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="deskripsiPerbaikan" className="block text-sm font-medium text-gray-900 mb-2">
                  Deskripsi Perbaikan <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="deskripsiPerbaikan"
                  required
                  value={formData.deskripsiPerbaikan}
                  onChange={(e) => setFormData({ ...formData, deskripsiPerbaikan: e.target.value })}
                  placeholder="Jelaskan pekerjaan perbaikan yang dilakukan..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label htmlFor="biayaPerbaikan" className="block text-sm font-medium text-gray-900 mb-2">
                  Biaya Perbaikan (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="biayaPerbaikan"
                  required
                  value={formData.biayaPerbaikan}
                  onChange={(e) => setFormData({ ...formData, biayaPerbaikan: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="statusAkhir" className="block text-sm font-medium text-gray-900 mb-2">
                  Status Akhir Barang <span className="text-red-500">*</span>
                </label>
                <select
                  id="statusAkhir"
                  required
                  value={formData.statusAkhir}
                  onChange={(e) => setFormData({ ...formData, statusAkhir: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih status akhir --</option>
                  <option value="Baik">Selesai - Baik</option>
                  <option value="Tidak Dapat Diperbaiki">Tidak Dapat Diperbaiki</option>
                  <option value="Perlu Sparepart">Menunggu Sparepart</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
              >
                Simpan Data Perbaikan
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Riwayat Perbaikan</h2>
          <div className="space-y-4">
            {repairHistory.map((repair, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-mono text-sm text-gray-600 mb-1">{repair.code}</p>
                    <p className="font-medium text-gray-900">{repair.item}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-medium rounded">
                    {repair.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-gray-500">Teknisi</p>
                    <p className="font-medium text-gray-900">{repair.technician}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Biaya</p>
                    <p className="font-medium text-gray-900">{repair.cost}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Tanggal</p>
                    <p className="font-medium text-gray-900">{repair.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
