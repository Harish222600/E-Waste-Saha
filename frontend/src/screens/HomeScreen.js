import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
    const { user, logout } = useAuth();

    const getRoleColor = (role) => {
        const colors = {
            user: '#4CAF50',
            collector: '#2196F3',
            admin: '#F44336',
            organization: '#FF9800',
        };
        return colors[role] || '#666';
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome!</Text>
                    <Text style={styles.name}>{user?.name}</Text>
                </View>

                {/* User Info Card */}
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{user?.email}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Role:</Text>
                        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user?.role) }]}>
                            <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
                        </View>
                    </View>

                    {user?.phone && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Phone:</Text>
                            <Text style={styles.value}>{user.phone}</Text>
                        </View>
                    )}

                    {user?.address && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Address:</Text>
                            <Text style={styles.value}>{user.address}</Text>
                        </View>
                    )}

                    {user?.organizationName && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Organization:</Text>
                            <Text style={styles.value}>{user.organizationName}</Text>
                        </View>
                    )}
                </View>

                {/* Role-specific content */}
                <View style={styles.roleContent}>
                    <Text style={styles.roleContentTitle}>
                        {user?.role === 'admin' && '🔐 Admin Dashboard'}
                        {user?.role === 'collector' && '♻️ Collector Portal'}
                        {user?.role === 'organization' && '🏢 Organization Panel'}
                        {user?.role === 'user' && '👤 User Dashboard'}
                    </Text>
                    <Text style={styles.roleContentText}>
                        {user?.role === 'admin' && 'You have full access to manage the system.'}
                        {user?.role === 'collector' && 'Manage collections and schedules.'}
                        {user?.role === 'organization' && 'Manage your organization and members.'}
                        {user?.role === 'user' && 'Access your personal dashboard and services.'}
                    </Text>
                </View>

                {/* E-Waste Actions (User only) */}
                {user?.role === 'user' && (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('PostEWaste')}
                        >
                            <Text style={styles.actionIcon}>📤</Text>
                            <Text style={styles.actionText}>Post E-Waste</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.actionButtonSecondary]}
                            onPress={() => navigation.navigate('MyEWaste')}
                        >
                            <Text style={styles.actionIcon}>📋</Text>
                            <Text style={styles.actionText}>My Posts</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 24,
        paddingTop: 60,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        color: '#666',
        marginBottom: 4,
    },
    name: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    value: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        textAlign: 'right',
    },
    roleBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    roleText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    roleContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    roleContentTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    roleContentText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButtonSecondary: {
        backgroundColor: '#2196F3',
    },
    actionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    actionText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#F44336',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
