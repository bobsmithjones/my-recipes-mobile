import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, getMe } from '../api/auth';

type User = {
  id: number;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load, check if token exists
  useEffect(() => {
    const init = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        if (token) {
          const me = await getMe(token);
          setUser(me);
        }
      } catch (err) {
        console.log('Auth init error', err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Login calls the backend
  const login = async (email: string, password: string) => {
    const { access_token } = await apiLogin(email, password);
    await SecureStore.setItemAsync('access_token', access_token);

    const me = await getMe(access_token);
    setUser(me);
  };

  // Logout clears the token
  const logout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
