import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { bulkEWasteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function BulkEWasteDetailScreen({ route, navigation }) {
    const { item: initialItem } = route.params;
    const { user } = useAuth();
    const [item, setItem] = useState(initialItem);
    const [loading, setLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollViewRef = useRef(null);

    // Check if current user is the owner (collector) of this bulk post
    const isOwner = user?._id === item?.collector?._id;

    // Refresh item data when screen comes into focus (e.g., after editing)
    useFocusEffect(
        useCallback(() => {
            const fetchItemDetails = async () => {
                try {
                    setLoading(true);
                    const result = await bulkEWasteAPI.getById(initialItem._id);
                    setItem(result.data);
                } catch (error) {
                    console.error('Fetch bulk item details error:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchItemDetails();
        }, [initialItem._id])
    );

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

    const handleScroll = (event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
        setCurrentImageIndex(index);
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this bulk post?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await bulkEWasteAPI.delete(item._id);
                            Alert.alert('Success', 'Bulk post deleted successfully');
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete post');
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    {isOwner && (
                        <>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => navigation.navigate('EditBulkEWaste', { item })}
                            >
                                <Text style={styles.editButtonText}>✏️ Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={handleDelete}
                            >
                                <Text style={styles.deleteButtonText}>🗑️</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <>
                    {/* Image Slider */}
                    {item.images && item.images.length > 0 && (
                        <View style={styles.imageSliderContainer}>
                            <ScrollView
                                ref={scrollViewRef}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onScroll={handleScroll}
                                scrollEventThrottle={16}
                            >
                                {item.images.map((image, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri: image }}
                                        style={styles.sliderImage}
                                        resizeMode="cover"
                                    />
                                ))}
                            </ScrollView>
                            {item.images.length > 1 && (
                                <View style={styles.pagination}>
                                    {item.images.map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.paginationDot,
                                                currentImageIndex === index && styles.paginationDotActive,
                                            ]}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Content */}
                    <View style={styles.content}>
                        {/* Title */}
                        <Text style={styles.title}>{item.title}</Text>

                        {/* Badges */}
                        <View style={styles.badgeContainer}>
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

                        {/* Price Card */}
                        <View style={styles.priceCard}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Weight:</Text>
                                <Text style={styles.priceValue}>{item.weightInKg} kg</Text>
                            </View>
                            {item.pricePerKg && (
                                <>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.priceLabel}>Price per kg:</Text>
                                        <Text style={styles.priceValue}>₹{item.pricePerKg}</Text>
                                    </View>
                                    <View style={styles.priceDivider} />
                                    <View style={styles.priceRow}>
                                        <Text style={styles.totalLabel}>Total Price:</Text>
                                        <Text style={styles.totalValue}>₹{item.totalPrice}</Text>
                                    </View>
                                </>
                            )}
                        </View>

                        {/* Description */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>

                        {/* Details */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Details</Text>

                            {item.location && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Location:</Text>
                                    <Text style={styles.detailValue}>{item.location}</Text>
                                </View>
                            )}

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Posted:</Text>
                                <Text style={styles.detailValue}>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </Text>
                            </View>

                            {item.soldTo && (
                                <>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Sold To:</Text>
                                        <Text style={styles.detailValue}>{item.soldTo.name}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Sold On:</Text>
                                        <Text style={styles.detailValue}>
                                            {new Date(item.soldAt).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
    },
    backButton: {
        fontSize: 16,
        color: '#007AFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
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
    deleteButton: {
        backgroundColor: '#F44336',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    deleteButtonText: {
        fontSize: 16,
    },
    imageSliderContainer: {
        position: 'relative',
    },
    sliderImage: {
        width: width,
        height: 300,
        backgroundColor: '#f0f0f0',
    },
    pagination: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    paginationDotActive: {
        backgroundColor: '#fff',
        width: 24,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    badge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 6,
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
    priceCard: {
        backgroundColor: '#E8F5E9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 14,
        color: '#2E7D32',
        fontWeight: '600',
    },
    priceValue: {
        fontSize: 14,
        color: '#1B5E20',
        fontWeight: '600',
    },
    priceDivider: {
        height: 1,
        backgroundColor: '#C8E6C9',
        marginVertical: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1B5E20',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
    },
});
