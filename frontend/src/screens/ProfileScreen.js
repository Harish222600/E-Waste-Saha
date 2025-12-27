import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
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
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>Profile</Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <Text style={styles.editButtonText}>✏️ Edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Profile Avatar */}
                <View style={styles.avatarContainer}>
                    {user?.profilePicture ? (
                        <Image
                            source={{ uri: user.profilePicture }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <Text style={styles.userName}>{user?.name}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user?.role) }]}>
                        <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
                    </View>
                </View>

                {/* User Info Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Account Information</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{user?.email}</Text>
                    </View>

                    {user?.phone && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Phone</Text>
                            <Text style={styles.value}>{user.phone}</Text>
                        </View>
                    )}

                    {user?.address && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Address</Text>
                            <Text style={styles.value}>{user.address}</Text>
                        </View>
                    )}

                    {user?.organizationName && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Organization</Text>
                            <Text style={styles.value}>{user.organizationName}</Text>
                        </View>
                    )}
                </View>

                {/* Role Info Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        {user?.role === 'admin' && '🔐 Admin Dashboard'}
                        {user?.role === 'collector' && '♻️ Collector Portal'}
                        {user?.role === 'organization' && '🏢 Organization Panel'}
                        {user?.role === 'user' && '👤 User Dashboard'}
                    </Text>
                    <Text style={styles.roleDescription}>
                        {user?.role === 'admin' && 'You have full access to manage the system.'}
                        {user?.role === 'collector' && 'Manage collections and schedules.'}
                        {user?.role === 'organization' && 'Manage your organization and members.'}
                        {user?.role === 'user' && 'Access your personal dashboard and services.'}
                    </Text>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    header: {
        marginBottom: 24,
    },
    backButton: {
        fontSize: 16,
        color: '#007AFF',
        marginBottom: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    roleBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    roleText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
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
    roleDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    logoutButton: {
        backgroundColor: '#F44336',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
