import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, AlertCircle, Wrench, ShoppingCart, Users, CheckSquare, Calculator, List } from 'lucide-react';
import logoSttr from '../../imports/logosttr.png';

export function Sidebar() {
  const location = useLocation();

  const menuSections = [
    {
      title: 'Dashboard',
      items: [{ path: '/', icon: LayoutDashboard, label: 'Dashboard Utama' }],
    },
    {
      title: 'Peminjaman Aset',
      items: [
        { path: '/katalog-publik', icon: Package, label: 'Katalog Publik' },
        { path: '/form-peminjaman', icon: ShoppingCart, label: 'Form Peminjaman' },
      ],
    },
    {
      title: 'Admin Sarpras',
      items: [
        { path: '/katalog', icon: List, label: 'Katalog Aset' },
        { path: '/user-management', icon: Users, label: 'User Management' },
        { path: '/approval-queue', icon: CheckSquare, label: 'Approval Queue' },
      ],
    },
    {
      title: 'Teknisi',
      items: [
        { path: '/lapor-kerusakan', icon: AlertCircle, label: 'Lapor Kerusakan' },
        { path: '/daftar-perbaikan', icon: Wrench, label: 'Daftar Perbaikan' },
        { path: '/form-anggaran', icon: Calculator, label: 'Form Anggaran' },
        { path: '/log-perbaikan', icon: Wrench, label: 'Log Perbaikan' },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#1E3A8A] min-h-screen flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <img src={logoSttr} alt="Logo STTR" className="w-12 h-12" />
          <div>
            <h1 className="text-white font-bold text-lg">Smart-Assets</h1>
            <p className="text-blue-200 text-sm">STTR</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        {menuSections.map((section, index) => (
          <div key={section.title} className={index > 0 ? 'mt-6' : ''}>
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2 px-4">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-white text-[#1E3A8A]'
                          : 'text-blue-100 hover:bg-blue-800'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-700">
        <p className="text-blue-200 text-sm text-center">© 2026 STTR</p>
      </div>
    </aside>
  );
}
