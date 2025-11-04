import { create } from 'zustand';
import { authAPI } from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      // Handle nested data structure from backend
      const data = response.data.data || response.data;
      const token = data.token;
      const user = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      // Check if user is admin
      if (user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      localStorage.setItem('adminToken', token);
      set({ user, token, isAuthenticated: true });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      set({ isLoading: false });
      return;
    }

    const token = localStorage.getItem('adminToken');

    if (!token) {
      set({ isLoading: false, isAuthenticated: false, user: null, token: null });
      return;
    }

    try {
      const response = await authAPI.getProfile();
      // Handle nested data structure from backend
      const userData = response.data.data || response.data;

      if (userData.role !== 'admin') {
        localStorage.removeItem('adminToken');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const user = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };

      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminToken');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
