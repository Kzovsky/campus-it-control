import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários padrão do sistema
const defaultUsers = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin' as const },
  { id: '2', username: 'ti.admin', password: 'ti2024', role: 'admin' as const },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('ti-system-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    console.log('Tentativa de login:', { username, password });
    console.log('Usuários disponíveis:', defaultUsers);
    
    const foundUser = defaultUsers.find(
      u => u.username === username && u.password === password
    );

    console.log('Usuário encontrado:', foundUser);

    if (foundUser) {
      const userData = { 
        id: foundUser.id, 
        username: foundUser.username, 
        role: foundUser.role 
      };
      setUser(userData);
      localStorage.setItem('ti-system-user', JSON.stringify(userData));
      console.log('Login bem-sucedido, dados salvos:', userData);
      return true;
    }
    console.log('Login falhou - usuário não encontrado');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ti-system-user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}