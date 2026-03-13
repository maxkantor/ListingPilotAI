import React from 'react';
import { apiService } from '../services/api';
import type {
  AuthResult,
  AuthSession,
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  SignUpRequest,
} from '../types';
import { clearStoredAuth, getStoredTokens, getStoredUser, storeTokens, storeUser } from './authStorage';

interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (payload: LoginRequest, adminOnly?: boolean) => Promise<AuthResult>;
  signUp: (payload: SignUpRequest) => Promise<AuthResult>;
  confirmEmail: (payload: ConfirmEmailRequest) => Promise<AuthResult>;
  forgotPassword: (payload: ForgotPasswordRequest) => Promise<AuthResult>;
  resetPassword: (payload: ResetPasswordRequest) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = React.useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshSession = React.useCallback(async () => {
    try {
      const sessionData = await apiService.getAuthSession();
      if (!sessionData.currentUser && getStoredUser()) {
        sessionData.currentUser = getStoredUser();
      }
      setSession(sessionData);
    } catch {
      setSession(null);
    }
  }, []);

  React.useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (!getStoredTokens() && !getStoredUser()) {
          setSession(await apiService.getAuthSession());
        } else {
          await refreshSession();
        }
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [refreshSession]);

  const handleAuthResult = React.useCallback(async (resultPromise: Promise<AuthResult>) => {
    const result = await resultPromise;
    if (result.tokens) {
      storeTokens(result.tokens);
    }
    if (result.user) {
      storeUser(result.user);
    }
    await refreshSession();
    return result;
  }, [refreshSession]);

  const login = React.useCallback((payload: LoginRequest, adminOnly = false) => {
    return handleAuthResult(adminOnly ? apiService.adminLogin(payload) : apiService.login(payload));
  }, [handleAuthResult]);

  const signUp = React.useCallback((payload: SignUpRequest) => handleAuthResult(apiService.signUp(payload)), [handleAuthResult]);
  const confirmEmail = React.useCallback((payload: ConfirmEmailRequest) => handleAuthResult(apiService.confirmEmail(payload)), [handleAuthResult]);
  const forgotPassword = React.useCallback((payload: ForgotPasswordRequest) => apiService.forgotPassword(payload), []);
  const resetPassword = React.useCallback((payload: ResetPasswordRequest) => apiService.resetPassword(payload), []);

  const logout = React.useCallback(async () => {
    const tokens = getStoredTokens();
    try {
      if (tokens?.accessToken) {
        await apiService.logout(tokens.accessToken);
      }
    } finally {
      clearStoredAuth();
      setSession(await apiService.getAuthSession());
    }
  }, []);

  const value = React.useMemo<AuthContextValue>(() => ({
    session,
    isLoading,
    isAuthenticated: Boolean(session?.currentUser),
    isAdmin: session?.currentUser?.role === 'admin' || session?.groups?.includes('admin') === true,
    login,
    signUp,
    confirmEmail,
    forgotPassword,
    resetPassword,
    logout,
    refreshSession,
  }), [session, isLoading, login, signUp, confirmEmail, forgotPassword, resetPassword, logout, refreshSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
