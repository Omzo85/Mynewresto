import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const login = (email, password) => {
    // Simulation d'une vérification d'authentification
    if (email === "test@example.com" && password === "password123") {
      setUser({ email });
      setError('');
      return true;
    } else {
      setError('Email ou mot de passe incorrect');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}