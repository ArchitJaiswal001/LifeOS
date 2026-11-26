import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiClient, getStoredToken, setStoredToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('lifeos:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('lifeos:unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    let active = true;
    async function hydrateSession() {
      const token = getStoredToken();
      if (!token) {
        if (active) setLoading(false);
        return;
      }

      try {
        const res = await apiClient.get('/auth/me');
        if (active) setUser(res.data.data.user);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          setStoredToken(null);
        }
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    hydrateSession();
    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    const { user: nextUser, token } = res.data.data;
    setStoredToken(token);
    setUser(nextUser);
    return nextUser;
  };

  const register = async (payload) => {
    const res = await apiClient.post('/auth/register', payload);
    const { user: nextUser, token } = res.data.data;
    setStoredToken(token);
    setUser(nextUser);
    return nextUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

