import { useState } from 'react';
import { Plus, Trash2, Calculator, CheckCircle } from 'lucide-react';

interface SparepartItem {
  id: number;
  nama: string;
  jumlah: number;
  harga: number;
}

export function FormAnggaran() {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [spareparts, setSpareparts] = useState<SparepartItem[]>([
    { id: 1, nama: '', jumlah: 1, harga: 0 },
  ]);
  const [biayaJasa, setBiayaJasa] = useState(0);
  const [teknisi, setTeknisi] = useState('');
  const [catatan, setCatatan] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const damagedAssets = [
    { code: 'AST-2024-002', name: 'Kursi Kuliah Lipat - Ruang D102' },
    { code: 'AST-2024-007', name: 'Papan Tulis Whiteboard - Ruang A205' },
    { code: 'AST-2024-015', name: 'Lampu Koridor Lt.3 - Gedung C' },
  ];

  const addSparepart = () => {
    setSpareparts([...spareparts, { id: Date.now(), nama: '', jumlah: 1, harga: 0 }]);
  };

  const removeSparepart = (id: number) => {
    if (spareparts.length > 1) {
      setSpareparts(spareparts.filter((item) => item.id !== id));
    }
  };

  const updateSparepart = (id: number, field: keyof SparepartItem, value: string | number) => {
    setSpareparts(spareparts.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const calculateTotalSpareparts = () => {
    return spareparts.reduce((total, item) => total + item.jumlah * item.harga, 0);
  };

  const calculateGrandTotal = () => {
    return calculateTotalSpareparts() + biayaJasa;
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedAsset('');
      setSpareparts([{ id: 1, nama: '', jumlah: 1, harga: 0 }]);
      setBiayaJasa(0);
      setTeknisi('');
      setCatatan('');
    }, 3000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Anggaran Perbaikan</h1>
        <p className="text-gray-600">Input detail biaya perbaikan dan sparepart yang digunakan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isSubmitted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="font-medium text-green-900">Anggaran perbaikan berhasil disimpan!</p>
                <p className="text-sm text-green-700">Data telah tersimpan di sistem.</p>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="asset" className="block text-sm font-medium text-gray-900 mb-2">
                  Pilih Aset yang Diperbaiki <span className="text-red-500">*</span>
                </label>
                <select
                  id="asset"
                  required
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih aset --</option>
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
                  value={teknisi}
                  onChange={(e) => setTeknisi(e.target.value)}
                  placeholder="Nama teknisi yang melakukan perbaikan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-900">
                    Daftar Sparepart <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addSparepart}
                    className="flex items-center gap-1 text-sm text-[#1E3A8A] hover:text-blue-900 font-medium"
                  >
                    <Plus size={16} />
                    <span>Tambah Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {spareparts.map((item, index) => (
                    <div key={item.id} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1 grid grid-cols-12 gap-3">
                        <div className="col-span-6">
                          <input
                            type="text"
                            placeholder="Nama sparepart"
                            required
                            value={item.nama}
                            onChange={(e) => updateSparepart(item.id, 'nama', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Qty"
                            required
                            min="1"
                            value={item.jumlah}
                            onChange={(e) => updateSparepart(item.id, 'jumlah', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            placeholder="Harga satuan (Rp)"
                            required
                            min="0"
                            value={item.harga}
                            onChange={(e) => updateSparepart(item.id, 'harga', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSparepart(item.id)}
                        disabled={spareparts.length === 1}
                        className={`p-2 rounded-lg transition-colors ${
                          spareparts.length === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="biayaJasa" className="block text-sm font-medium text-gray-900 mb-2">
                  Biaya Jasa Teknisi (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="biayaJasa"
                  required
                  min="0"
                  value={biayaJasa}
                  onChange={(e) => setBiayaJasa(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="catatan" className="block text-sm font-medium text-gray-900 mb-2">
                  Catatan Tambahan
                </label>
                <textarea
                  id="catatan"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Catatan atau keterangan tambahan..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
              >
                Simpan Anggaran Perbaikan
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <Calculator className="text-[#1E3A8A]" size={24} />
              <h2 className="text-lg font-bold text-gray-900">Ringkasan Biaya</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">Detail Sparepart:</p>
                {spareparts.map((item, index) =>
                  item.nama ? (
                    <div key={item.id} className="flex justify-between text-sm mb-2 pb-2 border-b border-gray-100">
                      <span className="text-gray-700">
                        {item.nama} ({item.jumlah}x)
                      </span>
                      <span className="font-medium text-gray-900">{formatRupiah(item.jumlah * item.harga)}</span>
                    </div>
                  ) : null
                )}
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Sparepart:</span>
                  <span className="font-semibold text-gray-900">{formatRupiah(calculateTotalSpareparts())}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Biaya Jasa:</span>
                  <span className="font-semibold text-gray-900">{formatRupiah(biayaJasa)}</span>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Anggaran:</span>
                  <span className="font-bold text-xl text-[#1E3A8A]">{formatRupiah(calculateGrandTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
