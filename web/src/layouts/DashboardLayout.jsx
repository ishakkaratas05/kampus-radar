import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BRAND_LOGO_SRC } from "../lib/brand.js";
import { roleLabel } from "../lib/roles";

function navClass({ isActive }) {
  return [
    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
    isActive
      ? "bg-indigo-500/20 text-white ring-1 ring-indigo-400/35 shadow-sm shadow-indigo-500/10"
      : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100",
  ].join(" ");
}

export default function DashboardLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex flex-col md:flex-row">
        <aside className="border-b border-white/10 bg-slate-900/90 backdrop-blur-xl md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-b-0 md:border-r md:border-white/10">
          <div className="flex flex-col gap-1 p-4">
            <div className="mb-4 flex items-center gap-3 px-2 py-2">
              <img
                src={BRAND_LOGO_SRC}
                alt=""
                width={120}
                height={32}
                className="h-8 w-auto max-w-[min(100%,140px)] shrink-0 object-contain"
                decoding="async"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">KampüsRadar</p>
                <p className="text-xs text-slate-500">Yönetim</p>
              </div>
            </div>

            <nav className="flex flex-row gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
              <NavLink to="/dashboard" end className={navClass}>
                <span className="text-lg opacity-90" aria-hidden>
                  ◎
                </span>
                Genel bakış
              </NavLink>
              <NavLink to="/dashboard/universities" className={navClass}>
                <span className="text-lg opacity-90" aria-hidden>
                  ⌂
                </span>
                Üniversiteler
              </NavLink>
              {isAdmin ? (
                <NavLink
                  to="/dashboard/universities/new"
                  className={navClass}
                >
                  <span className="text-lg opacity-90" aria-hidden>
                    +
                  </span>
                  Yeni üniversite
                </NavLink>
              ) : null}
            </nav>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col md:pl-64">
          <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-md md:px-8">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
              <p className="truncate text-sm text-slate-400">
                <span className="hidden sm:inline">Oturum açık — </span>
                <span className="font-medium text-slate-200">{user?.email}</span>
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-200 sm:inline">
                  {roleLabel(user?.role)}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10"
                >
                  Çıkış
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
