import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const userData = localStorage.getItem('adminUser');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser?.token) {
          try {
            const response = await api.get('/users/profile');
            // Kiểm tra role admin
            if (response.data.role === 'admin') {
              setUser(parsedUser);
            } else {
              logout();
            }
          } catch (error) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (userData) => {
    if (userData?.token && userData?.role === 'admin') {
      setUser(userData);
      localStorage.setItem('adminUser', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);