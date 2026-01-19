import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipe data untuk User
interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

// Tipe data untuk Context
interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    username: string;
    setUsername: (username: string) => void;
    logout: () => void;
}

// Buat Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState('Admin HRD');

    const logout = () => {
        setUser(null);
        setUsername('Admin HRD');
    };

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            username,
            setUsername,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom Hook untuk menggunakan Context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser harus digunakan dalam UserProvider');
    }
    return context;
};