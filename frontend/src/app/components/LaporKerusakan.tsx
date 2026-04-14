import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

export function LaporKerusakan() {
  const [formData, setFormData] = useState({
    namaPelapor: '',
    barang: '',
    deskripsi: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const assetList = [
    'Proyektor Ruang A301',
    'Kursi Kelas D102',
    'AC Lab Komputer 1',
    'Papan Tulis Ruang A205',
    'Komputer Lab 2 Unit 5',
    'Meja Lab Fisika',
    'Lampu Koridor Lt.3',
    'Printer Administrasi',
    'Kipas Angin Ruang C201',
    'Mesin Fotokopi Gedung B',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ namaPelapor: '', barang: '', deskripsi: '' });
      setSelectedFile(null);
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lapor Kerusakan</h1>
        <p className="text-gray-600">Laporkan kerusakan aset kampus yang Anda temukan</p>
      </div>

      <div className="max-w-2xl">
        {isSubmitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="font-medium text-green-900">Laporan berhasil dikirim!</p>
              <p className="text-sm text-green-700">Tim teknisi akan segera menindaklanjuti laporan Anda.</p>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <div className="bg-red-100 text-red-600 p-3 rounded-lg">
              <AlertCircle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Form Laporan Kerusakan</h2>
              <p className="text-sm text-gray-600">Isi formulir di bawah dengan lengkap</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="namaPelapor" className="block text-sm font-medium text-gray-900 mb-2">
                Nama Pelapor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="namaPelapor"
                required
                value={formData.namaPelapor}
                onChange={(e) => setFormData({ ...formData, namaPelapor: e.target.value })}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="barang" className="block text-sm font-medium text-gray-900 mb-2">
                Pilih Barang <span className="text-red-500">*</span>
              </label>
              <select
                id="barang"
                required
                value={formData.barang}
                onChange={(e) => setFormData({ ...formData, barang: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Pilih barang yang rusak --</option>
                {assetList.map((asset, index) => (
                  <option key={index} value={asset}>
                    {asset}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-900 mb-2">
                Deskripsi Masalah <span className="text-red-500">*</span>
              </label>
              <textarea
                id="deskripsi"
                required
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="Jelaskan kerusakan yang Anda temukan secara detail..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label htmlFor="foto" className="block text-sm font-medium text-gray-900 mb-2">
                Upload Foto Bukti (Opsional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="foto"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="foto" className="cursor-pointer">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-600 mb-1">
                    {selectedFile ? selectedFile.name : 'Klik untuk upload foto'}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG hingga 5MB</p>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#1E3A8A] text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
              >
                Kirim Laporan
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ namaPelapor: '', barang: '', deskripsi: '' });
                  setSelectedFile(null);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
