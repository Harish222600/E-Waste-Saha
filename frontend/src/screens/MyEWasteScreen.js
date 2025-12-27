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
import { eWasteAPI } from '../services/api';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';

export default function MyEWasteScreen({ navigation }) {
    const { user } = useAuth();
    const [eWastes, setEWastes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchEWastes = async () => {
        try {
            const result = await eWasteAPI.getMyPosts();
            setEWastes(result.data);
        } catch (error) {
            console.error('Fetch e-wastes error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Refresh data when screen comes into focus (e.g., after editing)
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchEWastes();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchEWastes();
    }, []);

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

                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Price:</Text>
                    <Text style={[styles.priceValue, !item.price && styles.freeText]}>
                        {item.price ? `₹${item.price}` : 'FREE'}
                    </Text>
                </View>

                {item.quantity > 1 && (
                    <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
                )}

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
                <Text style={styles.title}>My E-Waste Posts</Text>
                <Text style={styles.subtitle}>{eWastes.length} item(s)</Text>
            </View>

            {/* List */}
            {eWastes.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📦</Text>
                    <Text style={styles.emptyText}>No e-waste posted yet</Text>
                    <TouchableOpacity
                        style={styles.emptyButton}
                        onPress={() => navigation.navigate('PostEWaste')}
                    >
                        <Text style={styles.emptyButtonText}>Post Your First Item</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={eWastes}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}

            {/* Floating Action Button */}
            {eWastes.length > 0 && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('PostEWaste')}
                >
                    <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>
            )}

            <BottomNav navigation={navigation} currentRoute="MyEWaste" />
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
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    priceLabel: {
        fontSize: 13,
        color: '#666',
        marginRight: 6,
    },
    priceValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    freeText: {
        color: '#FF9800',
    },
    quantity: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
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
