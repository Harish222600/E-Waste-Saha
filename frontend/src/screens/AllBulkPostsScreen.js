import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { bulkEWasteAPI } from '../services/api';
import BottomNav from '../components/BottomNav';

export default function AllBulkPostsScreen({ navigation }) {
    const [bulkPosts, setBulkPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAllBulkPosts = async () => {
        try {
            const result = await bulkEWasteAPI.getAll();
            setBulkPosts(result.data);
        } catch (error) {
            console.error('Fetch all bulk posts error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchAllBulkPosts();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchAllBulkPosts();
    };

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
        >
            {item.images && item.images.length > 0 ? (
                <Image
                    source={{ uri: item.images[0] }}
                    style={styles.image}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderText}>⚖️</Text>
                </View>
            )}

            <View style={styles.cardContent}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                </Text>

                <View style={styles.badges}>
                    <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(item.condition) }]}>
                        <Text style={styles.badgeText}>{item.condition}</Text>
                    </View>
                    <View style={styles.weightBadge}>
                        <Text style={styles.weightText}>{item.weightInKg}kg</Text>
                    </View>
                </View>

                <View style={styles.userInfo}>
                    <Text style={styles.userName} numberOfLines={1}>
                        👤 {item.collector?.name || 'Unknown'}
                    </Text>
                </View>

                {item.pricePerKg && (
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>₹{item.pricePerKg}/kg</Text>
                        <Text style={styles.totalPrice}>₹{item.totalPrice}</Text>
                    </View>
                )}

                <View style={styles.footer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                    <Text style={styles.category}>{item.category}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Browse Bulk E-Waste</Text>
                    <Text style={styles.headerSubtitle}>
                        {bulkPosts.length} {bulkPosts.length === 1 ? 'listing' : 'listings'} available
                    </Text>
                </View>
            </View>

            <FlatList
                data={bulkPosts}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.row}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No bulk posts available</Text>
                        <Text style={styles.emptySubtext}>
                            Check back later for new listings from collectors
                        </Text>
                    </View>
                }
            />

            <BottomNav navigation={navigation} currentRoute="AllBulkPosts" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#fff',
        padding: 16,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#666',
    },
    listContent: {
        padding: 8,
        paddingBottom: 90, // Space for bottom nav
    },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        width: '48%',
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    image: {
        width: '100%',
        height: 140,
        backgroundColor: '#f0f0f0',
    },
    imagePlaceholder: {
        width: '100%',
        height: 140,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 40,
    },
    cardContent: {
        padding: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        lineHeight: 18,
    },
    badges: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 8,
    },
    conditionBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        flex: 1,
    },
    badgeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
    weightBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    weightText: {
        fontSize: 10,
        color: '#007AFF',
        fontWeight: '600',
    },
    userInfo: {
        marginBottom: 4,
    },
    userName: {
        fontSize: 11,
        color: '#666',
        fontWeight: '500',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        padding: 6,
        borderRadius: 6,
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 11,
        color: '#2E7D32',
        fontWeight: '600',
    },
    totalPrice: {
        fontSize: 13,
        color: '#1B5E20',
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
    },
    category: {
        fontSize: 10,
        color: '#999',
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        width: '100%',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 13,
        color: '#999',
        textAlign: 'center',
    },
});
