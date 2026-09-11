import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [currentRole, setCurrentRole] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored).role : 'student';
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token && !user) {
        try {
          const res = await authApi.getMe();
          const me = res.data?.user || res.data;
          setUser(me);
          setCurrentRole(me.role);
          localStorage.setItem('user', JSON.stringify(me));
        } catch (err) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { accessToken: token, refreshToken, user: loggedUser } = res.data;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      setUser(loggedUser);
      setCurrentRole(loggedUser.role);
      setAccessToken(token);
      setLoading(false);
      return loggedUser.role;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      const { accessToken: token, refreshToken, user: registeredUser } = res.data;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(registeredUser));

      setUser(registeredUser);
      setCurrentRole(registeredUser.role);
      setAccessToken(token);
      setLoading(false);
      return registeredUser.role;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setAccessToken(null);
    setCurrentRole('student');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        currentRole,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
