import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function BottomNav({ navigation, currentRoute }) {
    const { user } = useAuth();

    const getNavItems = () => {
        switch (user?.role) {
            case 'user':
                return [
                    { name: 'Dashboard', icon: '🏠', label: 'Home', route: 'Dashboard' },
                    { name: 'MyEWaste', icon: '📋', label: 'My Posts', route: 'MyEWaste' },
                    { name: 'PostEWaste', icon: '➕', label: 'Post', route: 'PostEWaste' },
                    { name: 'Profile', icon: '👤', label: 'Profile', route: 'Profile' },
                ];
            case 'collector':
                return [
                    { name: 'AllEWaste', icon: '🔍', label: 'Browse', route: 'AllEWaste' },
                    { name: 'MyBulkPosts', icon: '📊', label: 'My Posts', route: 'MyBulkPosts' },
                    { name: 'PostBulkEWaste', icon: '➕', label: 'Post', route: 'PostBulkEWaste' },
                    { name: 'Profile', icon: '👤', label: 'Profile', route: 'Profile' },
                ];
            case 'organization':
                return [
                    { name: 'AllBulkPosts', icon: '🔍', label: 'Browse', route: 'AllBulkPosts' },
                    { name: 'Profile', icon: '👤', label: 'Profile', route: 'Profile' },
                ];
            case 'admin':
                return [
                    { name: 'Dashboard', icon: '🏠', label: 'Dashboard', route: 'Dashboard' },
                    { name: 'Profile', icon: '👤', label: 'Profile', route: 'Profile' },
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                {navItems.map((item) => {
                    const isActive = currentRoute === item.route;
                    return (
                        <TouchableOpacity
                            key={item.name}
                            style={[styles.navItem, isActive && styles.activeNavItem]}
                            onPress={() => navigation.navigate(item.route)}
                        >
                            {item.name === 'Profile' ? (
                                <View style={styles.profileImageContainer}>
                                    {user?.profilePicture ? (
                                        <Image
                                            source={{ uri: user.profilePicture }}
                                            style={[styles.profileImage, isActive && styles.activeProfileImage]}
                                        />
                                    ) : (
                                        <View style={[styles.profilePlaceholder, isActive && styles.activeProfilePlaceholder]}>
                                            <Text style={styles.profileInitial}>
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <Text style={[styles.navIcon, isActive && styles.iconActive]}>{item.icon}</Text>
                            )}
                            <Text style={[styles.navLabel, isActive && styles.labelActive]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
    navBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
    },
    activeNavItem: {
        // Can add background or other active styles here if needed
    },
    navIcon: {
        fontSize: 24,
        marginBottom: 2,
        opacity: 0.6,
    },
    iconActive: {
        opacity: 1,
    },
    navLabel: {
        fontSize: 11,
        color: '#666',
        fontWeight: '500',
    },
    activeNavLabel: {
        color: '#007AFF',
    },
    profileImageContainer: {
        width: 24,
        height: 24,
        marginBottom: 4,
    },
    profileImage: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    activeProfileImage: {
        borderColor: '#007AFF',
        borderWidth: 2,
    },
    profilePlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    activeProfilePlaceholder: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
        borderWidth: 2,
    },
    profileInitial: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    labelActive: {
        color: '#007AFF',
        fontWeight: '600',
    },
});
