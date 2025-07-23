import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate login with different user types
    if (email === 'admin@company.com' && password === 'admin123') {
      setUser({
        id: '1',
        name: 'System Administrator',
        email: email,
        role: 'Admin',
        department: 'Administration'
      });
    } else if (email === 'manager@company.com' && password === 'manager123') {
      setUser({
        id: '2',
        name: 'Department Manager',
        email: email,
        role: 'Manager',
        department: 'Operations'
      });
    } else if (email === 'employee@company.com' && password === 'employee123') {
      setUser({
        id: '3',
        name: 'John Employee',
        email: email,
        role: 'Employee',
        department: 'IT'
      });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}