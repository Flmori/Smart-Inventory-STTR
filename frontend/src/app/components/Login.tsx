import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, Lock, Mail } from 'lucide-react';
import logoSttr from '../../imports/logosttr.png';

export function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'staff' | 'ukm'>('staff');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in production, this would authenticate
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] p-8 text-center">
            <img src={logoSttr} alt="Logo STTR" className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-1">Smart-Inventory STTR</h1>
            <p className="text-blue-200 text-sm">Sistem Manajemen Inventori Kampus</p>
          </div>

          {/* Login Type Selection */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">Login Sebagai:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLoginType('staff')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  loginType === 'staff'
                    ? 'border-[#0F172A] bg-[#0F172A] text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <User size={20} />
                <span className="font-medium text-sm">Admin/Staff/Teknisi</span>
              </button>

              <button
                type="button"
                onClick={() => setLoginType('ukm')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  loginType === 'ukm'
                    ? 'border-[#059669] bg-[#059669] text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <Users size={20} />
                <span className="font-medium text-sm">UKM</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  {loginType === 'staff' ? 'Email/Username' : 'Username UKM'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="username"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder={loginType === 'staff' ? 'admin@sttr.ac.id' : 'ukm_musik'}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-[#0F172A] border-gray-300 rounded focus:ring-[#0F172A]" />
                  <span className="ml-2 text-gray-600">Ingat saya</span>
                </label>
                <a href="#" className="text-[#0F172A] hover:underline font-medium">
                  Lupa password?
                </a>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
                  loginType === 'staff'
                    ? 'bg-[#0F172A] hover:bg-[#1E293B]'
                    : 'bg-[#059669] hover:bg-[#047857]'
                }`}
              >
                Login
              </button>
            </form>

            {loginType === 'ukm' && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Belum punya akun UKM? Hubungi Admin Sarpras untuk pendaftaran.
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-white text-sm mt-6">
          © 2026 Sekolah Tinggi Teknologi Roket. All rights reserved.
        </p>
      </div>
    </div>
  );
}
