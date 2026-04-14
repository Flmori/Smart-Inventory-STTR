import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  DoorOpen,
  ShoppingCart,
  RotateCcw,
  CheckSquare,
  Users,
  AlertCircle,
  Wrench,
  Calculator,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import logoSttr from '../../imports/logosttr.png';

export function SidebarInventory() {
  const location = useLocation();

  const menuSections = [
    {
      title: 'Dashboard',
      items: [{ path: '/', icon: LayoutDashboard, label: 'Dashboard Utama' }],
    },
    {
      title: 'Katalog & Peminjaman',
      items: [
        { path: '/katalog-inventori', icon: Package, label: 'Katalog' },
        { path: '/form-peminjaman', icon: ShoppingCart, label: 'Form Peminjaman' },
      ],
    },
    {
      title: 'Manajemen',
      items: [
        { path: '/manajemen-akun', icon: Users, label: 'Manajemen Akun' },
        { path: '/katalog', icon: ClipboardList, label: 'Data Aset' },
        { path: '/approval-queue', icon: CheckSquare, label: 'Approval Queue' },
      ],
    },
    {
      title: 'Perbaikan & Servis',
      items: [
        { path: '/lapor-kerusakan', icon: AlertCircle, label: 'Lapor Kerusakan' },
        { path: '/daftar-perbaikan', icon: Wrench, label: 'Daftar Perbaikan' },
        { path: '/form-anggaran', icon: Calculator, label: 'Form Anggaran' },
        { path: '/log-perbaikan', icon: Wrench, label: 'Log Perbaikan' },
        { path: '/form-pengembalian', icon: RotateCcw, label: 'Form Pengembalian' },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-[#0F172A] to-[#1E293B] min-h-screen flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <img src={logoSttr} alt="Logo STTR" className="w-12 h-12" />
          <div>
            <h1 className="text-white font-bold text-lg">Smart-Inventory</h1>
            <p className="text-emerald-300 text-sm font-medium">STTR</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        {menuSections.map((section, index) => (
          <div key={section.title} className={index > 0 ? 'mt-6' : ''}>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 px-4">
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
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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

      <div className="p-4 border-t border-gray-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
        <p className="text-gray-500 text-xs text-center mt-4">© 2026 STTR</p>
      </div>
    </aside>
  );
}
