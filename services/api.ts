import { User } from '../types';

const API_BASE = 'http://localhost:5000/api';

export const authService = {
    async register(data: any): Promise<{ token: string; user: User }> {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        return response.json();
    },

    async login(data: any): Promise<{ token: string; user: User }> {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        return response.json();
    }
};

export const userService = {
    async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
        const response = await fetch(`${API_BASE}/users/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...updates }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Update failed');
        }
        return response.json();
    }
};
