// Authentication Service
class AuthService {
    constructor() {
        this.tokenKey = 'makeup_auth_token';
        this.userKey = 'makeup_user';
        this.baseUrl = process.env.API_URL || 'http://localhost:3000/api';
    }

    // User Registration
    async register(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const data = await response.json();
            this.setToken(data.token);
            this.setUser(data.user);
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // User Login
    async login(credentials) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const data = await response.json();
            this.setToken(data.token);
            this.setUser(data.user);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // User Logout
    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        // Trigger event for UI update
        window.dispatchEvent(new Event('auth:logout'));
    }

    // Token Management
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    // User Management
    getUser() {
        const user = localStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    setUser(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    // Check Authentication Status
    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        // Check if token is expired
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } catch (error) {
            return false;
        }
    }

    // Get Authentication Headers
    getAuthHeaders() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    // Update User Profile
    async updateProfile(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/user/profile`, {
                method: 'PUT',
                headers: {
                    ...this.getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const updatedUser = await response.json();
            this.setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    }

    // Password Reset Request
    async requestPasswordReset(email) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            return await response.json();
        } catch (error) {
            console.error('Password reset request error:', error);
            throw error;
        }
    }

    // Verify Email
    async verifyEmail(token) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/verify-email/${token}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            return await response.json();
        } catch (error) {
            console.error('Email verification error:', error);
            throw error;
        }
    }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
