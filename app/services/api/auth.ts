import { LoginCredentials, SignupCredentials } from '@/app/types/auth';
import { useMutation, useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Auth API endpoints
const authApi = {
    login: async (credentials: LoginCredentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        return response.json();
    },

    signup: async (credentials: SignupCredentials) => {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Signup failed');
        }
        return response.json();
    },

    getCurrentUser: async () => {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        return response.json();
    },

    logout: async () => {
        localStorage.removeItem('token');
    },
};

// Auth Query Hooks
export const useLogin = () => {
    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
        },
    });
};

export const useSignup = () => {
    return useMutation({
        mutationFn: authApi.signup,
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
        },
    });
};

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: authApi.getCurrentUser,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: authApi.logout,
    });
};