import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login';
import { SidebarInventory } from './components/SidebarInventory';
import { DashboardInventory } from './components/DashboardInventory';
import { KatalogInventori } from './components/KatalogInventori';
import { KatalogAset } from './components/KatalogAset';
import { LaporKerusakan } from './components/LaporKerusakan';
import { LogPerbaikan } from './components/LogPerbaikan';
import { FormPeminjaman } from './components/FormPeminjaman';
import { FormPengembalian } from './components/FormPengembalian';
import { ManajemenAkun } from './components/ManajemenAkun';
import { ApprovalQueue } from './components/ApprovalQueue';
import { DaftarPerbaikan } from './components/DaftarPerbaikan';
import { FormAnggaran } from './components/FormAnggaran';

export default function App() {
  // Mock authentication - in production, use proper auth state management
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        <SidebarInventory />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardInventory />} />
            <Route path="/katalog-inventori" element={<KatalogInventori />} />
            <Route path="/katalog-ruangan" element={<KatalogInventori />} />
            <Route path="/form-peminjaman" element={<FormPeminjaman />} />
            <Route path="/approval-queue" element={<ApprovalQueue />} />
            <Route path="/form-pengembalian" element={<FormPengembalian />} />
            <Route path="/manajemen-akun" element={<ManajemenAkun />} />
            <Route path="/katalog" element={<KatalogAset />} />
            <Route path="/lapor-kerusakan" element={<LaporKerusakan />} />
            <Route path="/daftar-perbaikan" element={<DaftarPerbaikan />} />
            <Route path="/form-anggaran" element={<FormAnggaran />} />
            <Route path="/log-perbaikan" element={<LogPerbaikan />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}