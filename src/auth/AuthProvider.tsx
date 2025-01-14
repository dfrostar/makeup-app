import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import { User, LoginCredentials, RegisterData } from '../types/auth';
import { api } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                setLoading(false);
                return;
            }

            // Verify token
            const decodedToken = jwt.decode(token);
            if (!decodedToken || typeof decodedToken === 'string') {
                throw new Error('Invalid token');
            }

            // Check token expiration
            const expirationTime = decodedToken.exp ? decodedToken.exp * 1000 : 0;
            if (Date.now() >= expirationTime) {
                throw new Error('Token expired');
            }

            // Fetch user data
            const response = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUser(response.data);
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('auth_token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;

            localStorage.setItem('auth_token', token);
            setUser(user);

            // Redirect to dashboard or previous page
            const returnUrl = router.query.returnUrl as string || '/dashboard';
            router.push(returnUrl);
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid credentials');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/auth/register', data);
            const { token, user } = response.data;

            localStorage.setItem('auth_token', token);
            setUser(user);

            router.push('/onboarding');
        } catch (err) {
            console.error('Registration failed:', err);
            setError('Registration failed. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
        router.push('/login');
    };

    const resetPassword = async (email: string) => {
        try {
            setLoading(true);
            setError(null);

            await api.post('/auth/reset-password', { email });
        } catch (err) {
            console.error('Password reset failed:', err);
            setError('Password reset failed. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                register,
                logout,
                resetPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
