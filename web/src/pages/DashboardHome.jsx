import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleLabel } from "../lib/roles";

export default function DashboardHome() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Hoş geldiniz
        </h1>
        <p className="mt-2 text-slate-400">
          Hesabınızın yetkisine göre menüdeki bölümler açılır.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/40 p-6 shadow-xl">
          <p className="text-xs font-medium uppercase tracking-wider text-indigo-300/90">
            Hesap
          </p>
          <p className="mt-2 text-lg font-semibold text-white">{user?.email}</p>
          <p className="mt-1 text-sm text-slate-400">{roleLabel(user?.role)}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-xl">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Hızlı erişim
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                to="/dashboard/universities"
                className="font-medium text-indigo-300 hover:text-indigo-200"
              >
                Kayıtlı üniversiteleri listele →
              </Link>
            </li>
            {isAdmin ? (
              <li>
                <Link
                  to="/dashboard/universities/new"
                  className="font-medium text-indigo-300 hover:text-indigo-200"
                >
                  Yeni üniversite ekle →
                </Link>
              </li>
            ) : (
              <li className="text-slate-500">
                Üniversite ekleme / silme yalnızca sistem yöneticisine açıktır.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
