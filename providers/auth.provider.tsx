'use client';

import { SessionProvider } from "next-auth/react";
import React, { useState, useEffect, useContext, createContext } from 'react';
import { Dialog } from '@headlessui/react';
import { handleLogin } from "@/action/login-actions";
import { toast } from "sonner"
import { useRouter } from 'next/navigation';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
   

    const login = async (email: string, password: string) => {

        handleLogin(email, password).then((token) => {
            if (token) { 
                router.push('/dashboard');
                toast.success("Successfully logged in");
            }
        }).catch((err: unknown) => {
            if (err instanceof Error) {
                toast.error(err.message); // Exibe a mensagem de erro
            } else {
                toast.error("An unexpected error occurred.");
            }
        });
    };


    const logout = async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    const handleCloseDialog = () => setIsDialogOpen(false);    

    return (        
        <SessionProvider>
            {children}            
        </SessionProvider>        
    );
};

export default AuthProvider;