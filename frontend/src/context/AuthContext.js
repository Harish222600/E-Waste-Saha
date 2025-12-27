import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from storage on app start
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const data = await authAPI.login(email, password);

            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);

            return { success: true, user: data.user };
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            return { success: false, error: message };
        }
    };

    const signup = async (userData) => {
        try {
            const data = await authAPI.signup(userData);

            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);

            return { success: true, user: data.user };
        } catch (error) {
            const message = error.response?.data?.error || 'Signup failed';
            return { success: false, error: message };
        }
    };

    const updateUser = async (updatedUserData) => {
        try {
            setUser(updatedUserData);
            await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
