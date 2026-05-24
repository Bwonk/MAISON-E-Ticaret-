/* ═══════════════════════════════════════════════════
   AUTH CONTEXT — Global authentication state
   ═══════════════════════════════════════════════════
   Wraps the app. Provides user, login, logout,
   register, and resend-verification actions.
   Guest checkout is always available (auth optional).
   ═══════════════════════════════════════════════════ */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
  login as apiLogin,
  register as apiRegister,
  resendVerification as apiResend,
  getToken,
  getStoredUser,
  clearSession,
} from "../utils/auth";

// ─── Context shape ───────────────────────────────────

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<string>;
  resendVerification: (email: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

// ─── Provider ────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await apiLogin(payload);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await apiRegister(payload);
    return res.message;
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    const res = await apiResend(email);
    return res.message;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        resendVerification,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
