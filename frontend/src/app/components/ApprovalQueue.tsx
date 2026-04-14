import { useState } from 'react';
import { Clock, CheckCircle, XCircle, User, Users, Calendar, MessageSquare } from 'lucide-react';

interface PengajuanItem {
  id: number;
  peminjam: string;
  type: 'Mahasiswa' | 'UKM';
  nim?: string;
  aset: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  keperluan: string;
  noWa: string;
  diajukanPada: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
}

export function ApprovalQueue() {
  const [pengajuanList, setPengajuanList] = useState<PengajuanItem[]>([
    {
      id: 1,
      peminjam: 'Ahmad Fauzi',
      type: 'Mahasiswa',
      nim: '210401001',
      aset: 'Proyektor Portable',
      tanggalPinjam: '2026-04-15',
      tanggalKembali: '2026-04-17',
      keperluan: 'Presentasi Tugas Akhir di Ruang Seminar',
      noWa: '081234567890',
      diajukanPada: '2026-04-13 10:30',
      status: 'Menunggu',
    },
    {
      id: 2,
      peminjam: 'UKM Olahraga',
      type: 'UKM',
      aset: 'Bola Futsal',
      tanggalPinjam: '2026-04-14',
      tanggalKembali: '2026-04-14',
      keperluan: 'Turnamen Futsal Antar Fakultas',
      noWa: '082345678901',
      diajukanPada: '2026-04-13 09:15',
      status: 'Menunggu',
    },
    {
      id: 3,
      peminjam: 'Siti Nurhaliza',
      type: 'Mahasiswa',
      nim: '210401025',
      aset: 'Microphone Wireless',
      tanggalPinjam: '2026-04-16',
      tanggalKembali: '2026-04-16',
      keperluan: 'Acara Webinar Nasional di Auditorium',
      noWa: '083456789012',
      diajukanPada: '2026-04-13 08:45',
      status: 'Menunggu',
    },
    {
      id: 4,
      peminjam: 'UKM Fotografi',
      type: 'UKM',
      aset: 'Tenda Dome 6 Orang',
      tanggalPinjam: '2026-04-20',
      tanggalKembali: '2026-04-22',
      keperluan: 'Kegiatan Camping Fotografi Alam di Gunung Salak',
      noWa: '084567890123',
      diajukanPada: '2026-04-12 16:20',
      status: 'Menunggu',
    },
  ]);

  const [selectedTab, setSelectedTab] = useState<'Menunggu' | 'Disetujui' | 'Ditolak'>('Menunggu');

  const handleApprove = (id: number) => {
    setPengajuanList(
      pengajuanList.map((item) => (item.id === id ? { ...item, status: 'Disetujui' as const } : item))
    );
  };

  const handleReject = (id: number) => {
    setPengajuanList(
      pengajuanList.map((item) => (item.id === id ? { ...item, status: 'Ditolak' as const } : item))
    );
  };

  const filteredPengajuan = pengajuanList.filter((item) => item.status === selectedTab);

  const getStatusCount = (status: 'Menunggu' | 'Disetujui' | 'Ditolak') => {
    return pengajuanList.filter((item) => item.status === status).length;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Approval Queue</h1>
        <p className="text-gray-600">Kelola pengajuan peminjaman aset kampus</p>
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
          onClick={() => setSelectedTab('Disetujui')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            selectedTab === 'Disetujui'
              ? 'bg-[#1E3A8A] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <CheckCircle size={20} />
          <span>Disetujui</span>
          <span
            className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              selectedTab === 'Disetujui' ? 'bg-white text-[#1E3A8A]' : 'bg-green-100 text-green-700'
            }`}
          >
            {getStatusCount('Disetujui')}
          </span>
        </button>

        <button
          onClick={() => setSelectedTab('Ditolak')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            selectedTab === 'Ditolak'
              ? 'bg-[#1E3A8A] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <XCircle size={20} />
          <span>Ditolak</span>
          <span
            className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              selectedTab === 'Ditolak' ? 'bg-white text-[#1E3A8A]' : 'bg-red-100 text-red-700'
            }`}
          >
            {getStatusCount('Ditolak')}
          </span>
        </button>
      </div>

      <div className="space-y-4">
        {filteredPengajuan.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Clock className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-gray-500">Tidak ada pengajuan dengan status "{selectedTab}"</p>
          </div>
        ) : (
          filteredPengajuan.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-lg ${
                      item.type === 'Mahasiswa' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                    }`}
                  >
                    {item.type === 'Mahasiswa' ? <User size={24} /> : <Users size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{item.peminjam}</h3>
                    <p className="text-sm text-gray-500">
                      {item.type === 'Mahasiswa' ? `NIM: ${item.nim}` : 'Organisasi Kemahasiswaan'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Diajukan pada</p>
                  <p className="text-sm font-medium text-gray-900">{item.diajukanPada}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Aset yang Dipinjam</p>
                  <p className="font-medium text-gray-900">{item.aset}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tanggal Pinjam</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <p className="font-medium text-gray-900">
                      {new Date(item.tanggalPinjam).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tanggal Kembali</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <p className="font-medium text-gray-900">
                      {new Date(item.tanggalKembali).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={16} className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">Keperluan:</p>
                </div>
                <p className="text-gray-900 pl-6">{item.keperluan}</p>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">No. WhatsApp:</span> {item.noWa}
                </p>
              </div>

              {item.status === 'Menunggu' ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={20} />
                    <span>Terima</span>
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    <XCircle size={20} />
                    <span>Tolak</span>
                  </button>
                </div>
              ) : (
                <div
                  className={`py-3 px-4 rounded-lg text-center font-medium ${
                    item.status === 'Disetujui'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.status === 'Disetujui' ? '✓ Pengajuan Disetujui' : '✗ Pengajuan Ditolak'}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
