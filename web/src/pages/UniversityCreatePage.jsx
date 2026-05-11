import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UniversityCreatePage() {
  const { withAuth } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        city: city.trim() || undefined,
      };
      await withAuth("/api/universities", { method: "POST", body });
      navigate("/dashboard/universities", { replace: true });
    } catch (err) {
      setError(err.message || "Kayıt oluşturulamadı");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link
          to="/dashboard/universities"
          className="text-sm font-medium text-indigo-300 hover:text-indigo-200"
        >
          ← Üniversitelere dön
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-white">Yeni üniversite</h1>
        <p className="mt-1 text-sm text-slate-400">
          Ad zorunlu; slug ve şehir isteğe bağlı.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-xl"
      >
        {error ? (
          <p
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div>
          <label
            htmlFor="uni-name"
            className="mb-1.5 block text-sm font-medium text-slate-300"
          >
            Üniversite adı *
          </label>
          <input
            id="uni-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/40"
            placeholder="Örn. İstanbul Teknik Üniversitesi"
          />
        </div>
        <div>
          <label
            htmlFor="uni-slug"
            className="mb-1.5 block text-sm font-medium text-slate-300"
          >
            Slug (URL)
          </label>
          <input
            id="uni-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/40"
            placeholder="itu"
          />
        </div>
        <div>
          <label
            htmlFor="uni-city"
            className="mb-1.5 block text-sm font-medium text-slate-300"
          >
            Şehir
          </label>
          <input
            id="uni-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/40"
            placeholder="İstanbul"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-60"
          >
            {loading ? "Kaydediliyor…" : "Kaydet"}
          </button>
          <Link
            to="/dashboard/universities"
            className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-slate-300 hover:bg-white/5"
          >
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
