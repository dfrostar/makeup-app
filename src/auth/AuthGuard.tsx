import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthProvider';
import { UserRole } from '../types/auth';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: UserRole;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
    children, 
    requiredRole 
}) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push(`/login?returnUrl=${router.asPath}`);
            } else if (requiredRole && !user.roles.includes(requiredRole)) {
                router.push('/unauthorized');
            }
        }
    }, [user, loading, requiredRole, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null;
    }

    if (requiredRole && !user.roles.includes(requiredRole)) {
        return null;
    }

    return <>{children}</>;
};
