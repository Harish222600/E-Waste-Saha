import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { bulkEWasteAPI } from '../services/api';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';

export default function MyBulkPostsScreen({ navigation }) {
    const { user } = useAuth();
    const [bulkEWastes, setBulkEWastes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBulkEWastes = async () => {
        try {
            const result = await bulkEWasteAPI.getMyPosts();
            setBulkEWastes(result.data);
        } catch (error) {
            console.error('Fetch bulk e-wastes error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Refresh data when screen comes into focus (e.g., after editing)
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchBulkEWastes();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchBulkEWastes();
    }, []);

    const getConditionColor = (condition) => {
        const colors = {
            working: '#4CAF50',
            'not working': '#FF9800',
            damaged: '#F44336',
            mixed: '#9C27B0',
        };
        return colors[condition] || '#666';
    };

    const getStatusColor = (status) => {
        const colors = {
            available: '#2196F3',
            sold: '#4CAF50',
            reserved: '#FF9800',
        };
        return colors[status] || '#666';
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('BulkEWasteDetail', { item })}
            activeOpacity={0.7}
        >
            {/* Image */}
            {item.images && item.images.length > 0 && (
                <Image
                    source={{ uri: item.images[0] }}
                    style={styles.cardImage}
                />
            )}

            {/* Content */}
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                    {item.description}
                </Text>

                {/* Weight and Price */}
                <View style={styles.priceContainer}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Weight:</Text>
                        <Text style={styles.priceValue}>{item.weightInKg} kg</Text>
                    </View>
                    {item.pricePerKg && (
                        <>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Price/kg:</Text>
                                <Text style={styles.priceValue}>₹{item.pricePerKg}</Text>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.totalLabel}>Total:</Text>
                                <Text style={styles.totalValue}>₹{item.totalPrice}</Text>
                            </View>
                        </>
                    )}
                </View>

                <View style={styles.cardMeta}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.category}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: getConditionColor(item.condition) }]}>
                        <Text style={styles.badgeTextWhite}>{item.condition}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.badgeTextWhite}>{item.status}</Text>
                    </View>
                </View>

                {item.location && (
                    <Text style={styles.location}>📍 {item.location}</Text>
                )}

                <Text style={styles.date}>
                    Posted: {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>My Bulk Posts</Text>
                <Text style={styles.subtitle}>{bulkEWastes.length} item(s)</Text>
            </View>

            {/* List */}
            {bulkEWastes.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📦</Text>
                    <Text style={styles.emptyText}>No bulk e-waste posted yet</Text>
                    <TouchableOpacity
                        style={styles.emptyButton}
                        onPress={() => navigation.navigate('PostBulkEWaste')}
                    >
                        <Text style={styles.emptyButtonText}>Post Your First Bulk Item</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={bulkEWastes}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}

            {/* Floating Action Button */}
            {bulkEWastes.length > 0 && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('PostBulkEWaste')}
                >
                    <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>
            )}

            <BottomNav navigation={navigation} currentRoute="MyBulkPosts" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        fontSize: 16,
        color: '#007AFF',
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    list: {
        padding: 16,
        paddingBottom: 100, // Space for bottom nav
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#f0f0f0',
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    priceContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1B5E20',
    },
    cardMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    badge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '600',
    },
    badgeTextWhite: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    location: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    date: {
        fontSize: 12,
        color: '#999',
        marginTop: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 100, // Adjusted for bottom nav
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    fabIcon: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
    },
});
