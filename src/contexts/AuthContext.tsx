import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { AppState } from 'react-native';
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
  isLocked: boolean;

  login: (password: string) => Promise<boolean>;

  logout: () => Promise<void>;

  lock: () => void;
  unlock: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  function lock() {
    setIsLocked(true);
  }

  function unlock() {
    setIsLocked(false);
  }
  useEffect(() => {
    async function loadAuth() {
      await initializePassword();
      const sessionExists = await getSession();

      setIsAuthenticated(sessionExists);
      setIsLoading(false);
    }

    loadAuth();
  }, []);

  useEffect(() => {

    const subscription = AppState.addEventListener(
      'change',
      (nextState) => {

        if (nextState === 'background') {
          lock();
        }

      }
    );

    return () => {
      subscription.remove();
    };

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
        isLocked,
        lock,
        unlock,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}