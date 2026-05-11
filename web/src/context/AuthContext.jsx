import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { apiFetch } from "../lib/api";

const STORAGE_TOKEN = "kampus_radar_token";
const STORAGE_USER = "kampus_radar_user";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(STORAGE_TOKEN) || ""
  );
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback(async (email, password) => {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (data?.token && data?.user) {
      localStorage.setItem(STORAGE_TOKEN, data.token);
      localStorage.setItem(STORAGE_USER, JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    setToken("");
    setUser(null);
  }, []);

  const withAuth = useCallback(
    (path, opts = {}) => apiFetch(path, { ...opts, token }),
    [token]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      withAuth,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "SYSTEM_ADMIN",
    }),
    [token, user, login, logout, withAuth]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth yalnızca AuthProvider içinde kullanılabilir");
  return ctx;
}
