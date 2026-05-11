import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BRAND_LOGO_SRC } from "../lib/brand.js";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
      setPassword("");
    } catch (err) {
      setError(err.message || "Giriş yapılamadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.18),transparent)]"
        aria-hidden
      />

      <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Sol: marka + logo */}
        <section className="relative flex min-h-0 flex-[1.12] flex-col justify-center bg-gradient-to-br from-slate-900/95 via-indigo-950/40 to-slate-950 px-5 py-6 sm:px-8 lg:px-10 lg:py-8 xl:px-12">
          <div
            className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-indigo-600/22 blur-3xl lg:h-80 lg:w-80"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-violet-600/12 blur-3xl"
            aria-hidden
          />

          <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-xl flex-col items-center gap-5 text-center lg:max-w-none">
            <div className="flex w-full shrink-0 justify-center px-2">
              <img
                src={BRAND_LOGO_SRC}
                alt="KampüsRadar"
                width={620}
                height={200}
                className="h-auto max-h-[min(34vh,280px)] w-full max-w-[min(100%,480px)] object-contain object-center drop-shadow-[0_0_40px_rgba(129,140,248,0.35)] sm:max-h-[min(38vh,320px)] sm:max-w-[min(100%,520px)] lg:max-h-[min(42vh,360px)] lg:max-w-[min(100%,560px)] xl:max-h-[min(46vh,400px)] xl:max-w-[min(100%,620px)]"
                decoding="async"
              />
            </div>

            <div className="max-w-lg shrink px-2">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                KampüsRadar
              </h1>
              <p className="mt-2 text-sm leading-snug text-slate-400 sm:text-[15px]">
                Etkinlikleri yönetin, kampüsü görünür kılın.
              </p>
            </div>
          </div>
        </section>

        {/* Sağ: giriş formu */}
        <section className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-4 py-6 sm:px-6 lg:overflow-y-visible lg:px-10 lg:py-8 xl:px-12">
          <div className="mx-auto w-full max-w-md shrink-0">
            <div className="mb-5 lg:mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300/90">
                Oturum aç
              </p>
              <h2 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">
                Hoş geldiniz
              </h2>
              <p className="mt-1.5 text-sm text-slate-400">
                Kurumsal e-posta ve şifre ile giriş.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/40 backdrop-blur-xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                  >
                    E-posta
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    placeholder="yonetici@kurum.gov.tr"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Şifre
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    placeholder="••••••••"
                  />
                </div>

                {error ? (
                  <p
                    className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2.5 text-sm text-red-200"
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-violet-500 disabled:opacity-55"
                >
                  {loading ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white"
                        aria-hidden
                      />
                      Giriş yapılıyor…
                    </>
                  ) : (
                    "Giriş yap"
                  )}
                </button>
              </form>
            </div>

            <p className="mt-4 text-center text-[11px] text-slate-600 lg:text-left">
              Yetkiniz menüdeki işlemleri belirler.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
