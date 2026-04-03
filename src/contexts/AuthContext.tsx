import React, { createContext, useEffect, useState, ReactNode } from 'react';
import {
  getSession,
  initializePassword,
  removeSession,
  saveSession,
  validatePassword,
} from '../services/authService';

type AuthContextData = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuth() {
      await initializePassword();
      const sessionExists = await getSession();

      setIsAuthenticated(sessionExists);
      setIsLoading(false);
    }

    loadAuth();
  }, []);

  async function login(password: string) {
    const isValid = await validatePassword(password);

    if (isValid) {
      await saveSession();
      setIsAuthenticated(true);
      return true;
    }

    return false;
  }

  async function logout() {
    await removeSession();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}