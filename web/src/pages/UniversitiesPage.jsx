import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function UniversitiesPage() {
  const { withAuth, isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await withAuth("/api/universities");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Liste yüklenemedi");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [withAuth]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id, name) {
    if (
      !window.confirm(
        `“${name}” üniversitesini silmek istediğinize emin misiniz? Bağlı etkinlikler de kaldırılır.`
      )
    ) {
      return;
    }
    setBusyId(id);
    setError("");
    try {
      await withAuth(`/api/universities/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(e.message || "Silinemedi");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Üniversiteler</h1>
          <p className="mt-1 text-sm text-slate-400">
            Sistemde kayıtlı kurumlar. Sayıları kullanıcı ve etkinlik özetidir.
          </p>
        </div>
        {isAdmin ? (
          <Link
            to="/dashboard/universities/new"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-violet-500"
          >
            Yeni üniversite
          </Link>
        ) : null}
      </div>

      {error ? (
        <div
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-slate-400">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400" />
            Yükleniyor…
          </div>
        ) : items.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-slate-500">
            Henüz üniversite yok. Sistem yöneticisi yeni kayıt ekleyebilir.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Üniversite</th>
                  <th className="px-5 py-4">Şehir</th>
                  <th className="px-5 py-4">Slug</th>
                  <th className="px-5 py-4 text-right">Kullanıcı</th>
                  <th className="px-5 py-4 text-right">Etkinlik</th>
                  <th className="px-5 py-4">Kayıt</th>
                  {isAdmin ? (
                    <th className="px-5 py-4 text-right">İşlem</th>
                  ) : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((u) => (
                  <tr
                    key={u.id}
                    className="transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4 font-medium text-white">
                      {u.name}
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {u.city || "—"}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">
                      {u.slug || "—"}
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-slate-300">
                      {u._count?.users ?? 0}
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-slate-300">
                      {u._count?.events ?? 0}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(u.createdAt)}
                    </td>
                    {isAdmin ? (
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          disabled={busyId === u.id}
                          onClick={() => handleDelete(u.id, u.name)}
                          className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20 disabled:opacity-50"
                        >
                          {busyId === u.id ? "…" : "Sil"}
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
