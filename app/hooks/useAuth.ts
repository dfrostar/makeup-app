import React, { useState, useCallback, useEffect } from 'react';
import { User } from '../types';

const useAuth = () => {
  const [user, setUser] = useState<User|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error('Failed to check session:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real implementation, redirect to OAuth provider
      // This is a placeholder for demo purposes
      console.log('Initiating Google OAuth flow');
      
      // Mock successful login for development
      const mockUser: User = {
        id: 'user123',
        name: 'Test User',
        email: 'user@example.com',
        image: 'https://via.placeholder.com/150',
        createdAt: new Date()
      };
      
      // In production, this would be set by the OAuth callback
      setUser(mockUser);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // In production, call logout API endpoint
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    user, 
    isLoading, 
    error, 
    loginWithGoogle,
    logout,
    isAuthenticated: !!user
  };
}

export default useAuth; 