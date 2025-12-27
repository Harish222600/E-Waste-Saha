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
import { eWasteAPI } from '../services/api';
import BottomNav from '../components/BottomNav';

export default function AllEWasteScreen({ navigation }) {
    const [eWastes, setEWastes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAllEWastes = async () => {
        try {
            const result = await eWasteAPI.getAll();
            setEWastes(result.data);
        } catch (error) {
            console.error('Fetch all e-wastes error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchAllEWastes();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchAllEWastes();
    };

    const getConditionColor = (condition) => {
        const colors = {
            working: '#4CAF50',
            'not working': '#FF9800',
            damaged: '#F44336',
        };
        return colors[condition] || '#666';
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#2196F3',
            collected: '#4CAF50',
            cancelled: '#F44336',
        };
        return colors[status] || '#666';
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EWasteDetail', { item })}
        >
            {item.images && item.images.length > 0 ? (
                <Image
                    source={{ uri: item.images[0] }}
                    style={styles.image}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderText}>📦</Text>
                </View>
            )}

            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

                <View style={styles.badges}>
                    <View style={[styles.badge, { backgroundColor: getConditionColor(item.condition) }]}>
                        <Text style={styles.badgeText}>{item.condition}</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>×{item.quantity}</Text>
                    </View>
                </View>

                <View style={styles.priceRow}>
                    <Text style={[styles.priceText, !item.price && styles.freeText]}>
                        {item.price ? `₹${item.price}` : 'FREE'}
                    </Text>
                </View>

                <View style={styles.userInfo}>
                    <Text style={styles.userName} numberOfLines={1}>
                        👤 {item.user?.name || 'Unknown'}
                    </Text>
                </View>

                {item.location && (
                    <Text style={styles.location} numberOfLines={1}>
                        📍 {item.location}
                    </Text>
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
                    <Text style={styles.headerTitle}>Browse E-Waste Posts</Text>
                    <Text style={styles.headerSubtitle}>
                        {eWastes.length} {eWastes.length === 1 ? 'post' : 'posts'} available
                    </Text>
                </View>
            </View>

            <FlatList
                data={eWastes}
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
                        <Text style={styles.emptyText}>No e-waste posts available</Text>
                        <Text style={styles.emptySubtext}>
                            Check back later for new posts from users
                        </Text>
                    </View>
                }
            />

            <BottomNav navigation={navigation} currentRoute="AllEWaste" />
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
    cardImage: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    cardInfo: {
        padding: 10,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    badges: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 6,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        backgroundColor: '#007AFF',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#fff',
    },
    priceRow: {
        marginTop: 6,
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    priceText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    freeText: {
        color: '#FF9800',
    },
    userInfo: {
        marginBottom: 4,
    },
    userName: {
        fontSize: 11,
        color: '#666',
        fontWeight: '500',
    },
    location: {
        fontSize: 11,
        color: '#999',
        marginBottom: 8,
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
