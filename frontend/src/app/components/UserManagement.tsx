import { useState } from 'react';
import { UserPlus, Eye, EyeOff, Copy, CheckCircle, Trash2 } from 'lucide-react';

export function UserManagement() {
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    namaUkm: '',
    penanggungJawab: '',
    email: '',
    noWa: '',
  });
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);

  const [existingUsers] = useState([
    {
      id: 1,
      namaUkm: 'UKM Musik STTR',
      username: 'ukm_musik',
      penanggungJawab: 'Ahmad Fauzi',
      email: 'ukm.musik@sttr.ac.id',
      createdAt: '10 Mar 2026',
      status: 'Aktif',
    },
    {
      id: 2,
      namaUkm: 'UKM Fotografi',
      username: 'ukm_fotografi',
      penanggungJawab: 'Siti Nurhaliza',
      email: 'ukm.fotografi@sttr.ac.id',
      createdAt: '05 Mar 2026',
      status: 'Aktif',
    },
    {
      id: 3,
      namaUkm: 'UKM Olahraga',
      username: 'ukm_olahraga',
      penanggungJawab: 'Budi Santoso',
      email: 'ukm.olahraga@sttr.ac.id',
      createdAt: '01 Mar 2026',
      status: 'Aktif',
    },
  ]);

  const generateUsername = (namaUkm: string) => {
    return 'ukm_' + namaUkm.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '');
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const username = generateUsername(newUser.namaUkm);
    const password = generatePassword();
    setGeneratedCredentials({ username, password });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resetForm = () => {
    setNewUser({ namaUkm: '', penanggungJawab: '', email: '', noWa: '' });
    setGeneratedCredentials(null);
    setIsCreatingUser(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Kelola akun UKM untuk sistem peminjaman aset</p>
        </div>
        {!isCreatingUser && (
          <button
            onClick={() => setIsCreatingUser(true)}
            className="flex items-center gap-2 bg-[#1E3A8A] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
          >
            <UserPlus size={20} />
            <span>Buat Akun UKM Baru</span>
          </button>
        )}
      </div>

      {isCreatingUser && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Buat Akun UKM Baru</h2>

          {generatedCredentials ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-4">
                <CheckCircle className="text-green-600" size={24} />
                <div>
                  <p className="font-medium text-green-900">Akun berhasil dibuat!</p>
                  <p className="text-sm text-green-700">Berikan kredensial berikut kepada UKM {newUser.namaUkm}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-sm font-medium text-gray-900 mb-4">Kredensial Login UKM:</p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={generatedCredentials.username}
                        readOnly
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(generatedCredentials.username)}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={generatedCredentials.password}
                          readOnly
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm pr-10"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <button
                        onClick={() => copyToClipboard(generatedCredentials.password)}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mt-4 italic">
                  * Pastikan untuk menyimpan kredensial ini. Password hanya ditampilkan sekali.
                </p>
              </div>

              <button
                onClick={resetForm}
                className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
              >
                Selesai
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="namaUkm" className="block text-sm font-medium text-gray-900 mb-2">
                    Nama UKM <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="namaUkm"
                    required
                    value={newUser.namaUkm}
                    onChange={(e) => setNewUser({ ...newUser, namaUkm: e.target.value })}
                    placeholder="Contoh: UKM Basket"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="penanggungJawab" className="block text-sm font-medium text-gray-900 mb-2">
                    Penanggung Jawab <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="penanggungJawab"
                    required
                    value={newUser.penanggungJawab}
                    onChange={(e) => setNewUser({ ...newUser, penanggungJawab: e.target.value })}
                    placeholder="Nama ketua/koordinator UKM"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email UKM <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="ukm@sttr.ac.id"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="noWa" className="block text-sm font-medium text-gray-900 mb-2">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="noWa"
                    required
                    value={newUser.noWa}
                    onChange={(e) => setNewUser({ ...newUser, noWa: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1E3A8A] text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
                >
                  Generate Username & Password
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Daftar Akun UKM</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Nama UKM</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Username</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Penanggung Jawab</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Dibuat</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {existingUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{user.namaUkm}</td>
                  <td className="py-3 px-4 font-mono text-sm text-gray-600">{user.username}</td>
                  <td className="py-3 px-4 text-gray-600">{user.penanggungJawab}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 text-gray-600">{user.createdAt}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-red-600 hover:text-red-700 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
