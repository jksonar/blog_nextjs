'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/utils/apiClient';
import Cookies from 'js-cookie';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const api = apiClient;

    useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      const token = Cookies.get('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Verify token and get user info
        const response = await api.get('/users/me/');
        setUser(response.data);
      } catch (error) {
        // Token might be invalid or expired
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/token/', {
         username,
         password,
       });

      const { access, refresh } = response.data;
      
      // Store tokens in cookies
      Cookies.set('access_token', access, { expires: 1/48 }); // 30 minutes
      Cookies.set('refresh_token', refresh, { expires: 1 }); // 1 day

      // Get user info
      const userResponse = await api.get('/users/me/');

      setUser(userResponse.data);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setUser(null);
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await api.post('/auth/register/', {
        username,
        email,
        password,
      });
      
      // Login after successful registration
      await login(username, password);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}