import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

export default function DashboardScreen({ navigation }) {
    const { user } = useAuth();

    return (
        <>
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.greeting}>Welcome Back!</Text>
                        <Text style={styles.name}>{user?.name}</Text>
                    </View>

                    {/* Quick Stats */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>0</Text>
                            <Text style={styles.statLabel}>Posted Items</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>0</Text>
                            <Text style={styles.statLabel}>Collected</Text>
                        </View>
                    </View>

                    {/* Main Actions - User Only */}
                    {user?.role === 'user' && (
                        <View style={styles.actionsSection}>
                            <Text style={styles.sectionTitle}>E-Waste Management</Text>

                            <TouchableOpacity
                                style={styles.actionCard}
                                onPress={() => navigation.navigate('PostEWaste')}
                            >
                                <View style={styles.actionIconContainer}>
                                    <Text style={styles.actionIcon}>📤</Text>
                                </View>
                                <View style={styles.actionContent}>
                                    <Text style={styles.actionTitle}>Post E-Waste</Text>
                                    <Text style={styles.actionDescription}>
                                        Upload items for collection
                                    </Text>
                                </View>
                                <Text style={styles.actionArrow}>›</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionCard}
                                onPress={() => navigation.navigate('MyEWaste')}
                            >
                                <View style={styles.actionIconContainer}>
                                    <Text style={styles.actionIcon}>📋</Text>
                                </View>
                                <View style={styles.actionContent}>
                                    <Text style={styles.actionTitle}>My Posts</Text>
                                    <Text style={styles.actionDescription}>
                                        View your posted items
                                    </Text>
                                </View>
                                <Text style={styles.actionArrow}>›</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Role-specific content for admin */}
                    {user?.role === 'admin' && (
                        <View style={styles.actionsSection}>
                            <Text style={styles.sectionTitle}>🔐 Admin Dashboard</Text>
                            <View style={styles.infoCard}>
                                <Text style={styles.infoText}>
                                    Full system access and management
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            <BottomNav navigation={navigation} currentRoute="Dashboard" />
        </>
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
        paddingBottom: 100, // Space for bottom nav
    },
    header: {
        flexDirection: 'column',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 16,
        color: '#666',
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    actionsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionIcon: {
        fontSize: 24,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    actionDescription: {
        fontSize: 14,
        color: '#666',
    },
    actionArrow: {
        fontSize: 24,
        color: '#ccc',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});
