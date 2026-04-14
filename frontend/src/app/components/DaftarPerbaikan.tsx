import { useState } from 'react';
import { Wrench, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface BarangRusak {
  id: number;
  kodeAset: string;
  namaBarang: string;
  lokasi: string;
  pelapor: string;
  tanggalLapor: string;
  deskripsiKerusakan: string;
  status: 'Menunggu' | 'Sedang Diperbaiki' | 'Selesai';
  teknisi?: string;
  biaya?: string;
}

export function DaftarPerbaikan() {
  const [barangRusak, setBarangRusak] = useState<BarangRusak[]>([
    {
      id: 1,
      kodeAset: 'AST-2024-002',
      namaBarang: 'Kursi Kuliah Lipat',
      lokasi: 'Ruang D102',
      pelapor: 'Ahmad Fauzi',
      tanggalLapor: '2026-04-12',
      deskripsiKerusakan: 'Kaki kursi patah dan tidak stabil ketika diduduki',
      status: 'Menunggu',
    },
    {
      id: 2,
      kodeAset: 'AST-2024-007',
      namaBarang: 'Papan Tulis Whiteboard',
      lokasi: 'Ruang A205',
      pelapor: 'Siti Nurhaliza',
      tanggalLapor: '2026-04-12',
      deskripsiKerusakan: 'Permukaan papan tulis rusak, tidak bisa dihapus dengan bersih',
      status: 'Sedang Diperbaiki',
      teknisi: 'Budi Santoso',
    },
    {
      id: 3,
      kodeAset: 'AST-2024-015',
      namaBarang: 'Lampu Koridor Lt.3',
      lokasi: 'Gedung C Lantai 3',
      pelapor: 'Budi Santoso',
      tanggalLapor: '2026-04-11',
      deskripsiKerusakan: 'Lampu tidak menyala, kemungkinan ballast rusak',
      status: 'Menunggu',
    },
    {
      id: 4,
      kodeAset: 'AST-2024-001',
      namaBarang: 'Proyektor Epson EB-X41',
      lokasi: 'Ruang A301',
      pelapor: 'Dewi Lestari',
      tanggalLapor: '2026-04-08',
      deskripsiKerusakan: 'Lampu proyektor sudah saatnya diganti (lebih dari 2000 jam)',
      status: 'Selesai',
      teknisi: 'Andi Pratama',
      biaya: 'Rp 250.000',
    },
  ]);

  const [selectedTab, setSelectedTab] = useState<'Menunggu' | 'Sedang Diperbaiki' | 'Selesai'>('Menunggu');

  const handleStartRepair = (id: number) => {
    setBarangRusak(
      barangRusak.map((item) =>
        item.id === id ? { ...item, status: 'Sedang Diperbaiki' as const, teknisi: 'Teknisi Aktif' } : item
      )
    );
  };

  const filteredBarang = barangRusak.filter((item) => item.status === selectedTab);

  const getStatusCount = (status: 'Menunggu' | 'Sedang Diperbaiki' | 'Selesai') => {
    return barangRusak.filter((item) => item.status === status).length;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-700';
      case 'Sedang Diperbaiki':
        return 'bg-blue-100 text-blue-700';
      case 'Selesai':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Perbaikan</h1>
        <p className="text-gray-600">Kelola perbaikan aset yang rusak</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedTab('Menunggu')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            selectedTab === 'Menunggu'
              ? 'bg-[#1E3A8A] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Clock size={20} />
          <span>Menunggu</span>
          <span
            className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              selectedTab === 'Menunggu' ? 'bg-white text-[#1E3A8A]' : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {getStatusCount('Menunggu')}
          </span>
        </button>

        <button
          onClick={() => setSelectedTab('Sedang Diperbaiki')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            selectedTab === 'Sedang Diperbaiki'
              ? 'bg-[#1E3A8A] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Wrench size={20} />
          <span>Sedang Diperbaiki</span>
          <span
            className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              selectedTab === 'Sedang Diperbaiki' ? 'bg-white text-[#1E3A8A]' : 'bg-blue-100 text-blue-700'
            }`}
          >
            {getStatusCount('Sedang Diperbaiki')}
          </span>
        </button>

        <button
          onClick={() => setSelectedTab('Selesai')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            selectedTab === 'Selesai'
              ? 'bg-[#1E3A8A] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <CheckCircle size={20} />
          <span>Selesai</span>
          <span
            className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              selectedTab === 'Selesai' ? 'bg-white text-[#1E3A8A]' : 'bg-green-100 text-green-700'
            }`}
          >
            {getStatusCount('Selesai')}
          </span>
        </button>
      </div>

      <div className="space-y-4">
        {filteredBarang.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Wrench className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-gray-500">Tidak ada barang dengan status "{selectedTab}"</p>
          </div>
        ) : (
          filteredBarang.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 text-red-600 p-3 rounded-lg">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{item.namaBarang}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-mono">{item.kodeAset}</span> • {item.lokasi}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Dilaporkan</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(item.tanggalLapor).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Deskripsi Kerusakan:</p>
                <p className="text-gray-900">{item.deskripsiKerusakan}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pelapor</p>
                  <p className="font-medium text-gray-900">{item.pelapor}</p>
                </div>
                {item.teknisi && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Teknisi</p>
                    <p className="font-medium text-gray-900">{item.teknisi}</p>
                  </div>
                )}
                {item.biaya && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Biaya Perbaikan</p>
                    <p className="font-medium text-gray-900">{item.biaya}</p>
                  </div>
                )}
              </div>

              {item.status === 'Menunggu' && (
                <button
                  onClick={() => handleStartRepair(item.id)}
                  className="w-full flex items-center justify-center gap-2 bg-[#1E3A8A] text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
                >
                  <Wrench size={20} />
                  <span>Mulai Perbaikan</span>
                </button>
              )}

              {item.status === 'Sedang Diperbaiki' && (
                <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  <CheckCircle size={20} />
                  <span>Tandai Selesai & Input Anggaran</span>
                </button>
              )}

              {item.status === 'Selesai' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-green-700">✓ Perbaikan telah selesai</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
