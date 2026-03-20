import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('dreamUser');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('dreamUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
    localStorage.setItem('dreamUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    localStorage.setItem('dreamUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('dreamUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);