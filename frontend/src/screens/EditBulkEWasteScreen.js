
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { bulkEWasteAPI } from '../services/api';

const CATEGORIES = [
    'Electronics',
    'Appliances',
    'Computers',
    'Mobile Devices',
    'Batteries',
    'Mixed',
    'Other',
];

const CONDITIONS = [
    { value: 'working', label: 'Working', icon: '✅', color: '#4CAF50' },
    { value: 'not working', label: 'Not Working', icon: '⚠️', color: '#FF9800' },
    { value: 'damaged', label: 'Damaged', icon: '❌', color: '#F44336' },
    { value: 'mixed', label: 'Mixed', icon: '🔀', color: '#9C27B0' },
];

export default function EditBulkEWasteScreen({ route, navigation }) {
    const { item } = route.params;

    const [formData, setFormData] = useState({
        title: item.title,
        description: item.description,
        category: item.category,
        condition: item.condition,
        weightInKg: item.weightInKg.toString(),
        pricePerKg: item.pricePerKg ? item.pricePerKg.toString() : '',
        location: item.location || '',
    });
    const [existingImages, setExistingImages] = useState(item.images || []);
    const [newImages, setNewImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const pickImages = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant camera roll permissions');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
                selectionLimit: 5,
            });

            if (!result.canceled) {
                const selected = result.assets || [result];
                const totalImages = existingImages.length + newImages.length + selected.length;

                if (totalImages > 5) {
                    Alert.alert('Limit Exceeded', 'You can have maximum 5 images total');
                    return;
                }
                setNewImages([...newImages, ...selected]);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'Failed to pick images');
        }
    };

    const removeExistingImage = (index) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const removeNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    const calculateTotalPrice = () => {
        const weight = parseFloat(formData.weightInKg);
        const price = parseFloat(formData.pricePerKg);
        if (weight && price) {
            return (weight * price).toFixed(2);
        }
        return '0.00';
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.title || !formData.description || !formData.weightInKg) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (parseFloat(formData.weightInKg) < 0.1) {
            Alert.alert('Error', 'Weight must be at least 0.1 kg');
            return;
        }

        const totalImages = existingImages.length + newImages.length;
        if (totalImages === 0) {
            Alert.alert('Error', 'Please have at least one image');
            return;
        }

        setLoading(true);

        try {
            // Create FormData
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('condition', formData.condition);
            data.append('weightInKg', formData.weightInKg);
            if (formData.pricePerKg) {
                data.append('pricePerKg', formData.pricePerKg);
            }
            data.append('location', formData.location);

            // Add new images
            newImages.forEach((image) => {
                const uri = image.uri;
                const filename = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                data.append('images', {
                    uri,
                    name: filename,
                    type,
                });
            });

            await bulkEWasteAPI.update(item._id, data);

            Alert.alert('Success', 'Bulk e-waste updated successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Navigate back to detail screen, which will then go back to list
                        navigation.goBack();
                    },
                },
            ]);
        } catch (error) {
            console.error('Update bulk e-waste error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to update bulk e-waste');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.backButton}>← Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Edit Bulk E-Waste</Text>
                    </View>

                    {/* Condition Selector */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Condition *</Text>
                        <View style={styles.conditionContainer}>
                            {CONDITIONS.map((cond) => (
                                <TouchableOpacity
                                    key={cond.value}
                                    style={[
                                        styles.conditionButton,
                                        formData.condition === cond.value && {
                                            borderColor: cond.color,
                                            backgroundColor: `${cond.color}15`,
                                        },
                                    ]}
                                    onPress={() => updateField('condition', cond.value)}
                                    disabled={loading}
                                >
                                    <Text style={styles.conditionIcon}>{cond.icon}</Text>
                                    <Text
                                        style={[
                                            styles.conditionText,
                                            formData.condition === cond.value && { color: cond.color, fontWeight: 'bold' },
                                        ]}
                                    >
                                        {cond.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Title */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Title *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Mixed Electronics - 50kg"
                            value={formData.title}
                            onChangeText={(value) => updateField('title', value)}
                            editable={!loading}
                        />
                    </View>

                    {/* Category */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Category *</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.categoryContainer}>
                                {CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[
                                            styles.categoryButton,
                                            formData.category === cat && styles.categoryButtonActive,
                                        ]}
                                        onPress={() => updateField('category', cat)}
                                        disabled={loading}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                formData.category === cat && styles.categoryTextActive,
                                            ]}
                                        >
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Weight and Price */}
                    <View style={styles.row}>
                        <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Weight (kg) *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0.0"
                                value={formData.weightInKg}
                                onChangeText={(value) => updateField('weightInKg', value)}
                                keyboardType="decimal-pad"
                                editable={!loading}
                            />
                        </View>
                        <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Price/kg (₹)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                value={formData.pricePerKg}
                                onChangeText={(value) => updateField('pricePerKg', value)}
                                keyboardType="decimal-pad"
                                editable={!loading}
                            />
                        </View>
                    </View>

                    {/* Total Price Display */}
                    {formData.weightInKg && formData.pricePerKg && (
                        <View style={styles.totalPriceCard}>
                            <Text style={styles.totalPriceLabel}>Total Price:</Text>
                            <Text style={styles.totalPriceValue}>₹{calculateTotalPrice()}</Text>
                        </View>
                    )}

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Description *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe the bulk items..."
                            value={formData.description}
                            onChangeText={(value) => updateField('description', value)}
                            multiline
                            numberOfLines={4}
                            editable={!loading}
                        />
                    </View>

                    {/* Location */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Your location"
                            value={formData.location}
                            onChangeText={(value) => updateField('location', value)}
                            editable={!loading}
                        />
                    </View>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.label}>Current Images</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.imagePreviewContainer}>
                                    {existingImages.map((image, index) => (
                                        <View key={`existing-${index}`} style={styles.imagePreview}>
                                            <Image source={{ uri: image }} style={styles.previewImage} />
                                            <TouchableOpacity
                                                style={styles.removeImageButton}
                                                onPress={() => removeExistingImage(index)}
                                                disabled={loading}
                                            >
                                                <Text style={styles.removeImageText}>✕</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {/* New Images */}
                    <View style={styles.section}>
                        <Text style={styles.label}>
                            Add More Images ({existingImages.length + newImages.length}/5)
                        </Text>
                        <TouchableOpacity
                            style={styles.imagePickerButton}
                            onPress={pickImages}
                            disabled={loading || (existingImages.length + newImages.length >= 5)}
                        >
                            <Text style={styles.imagePickerIcon}>📷</Text>
                            <Text style={styles.imagePickerText}>
                                {newImages.length === 0 ? 'Add Images' : `${newImages.length} new image(s)`}
                            </Text>
                        </TouchableOpacity>

                        {newImages.length > 0 && (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.imagePreviewContainer}>
                                    {newImages.map((image, index) => (
                                        <View key={`new-${index}`} style={styles.imagePreview}>
                                            <Image source={{ uri: image.uri }} style={styles.previewImage} />
                                            <TouchableOpacity
                                                style={styles.removeImageButton}
                                                onPress={() => removeNewImage(index)}
                                                disabled={loading}
                                            >
                                                <Text style={styles.removeImageText}>✕</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        )}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Update Bulk E-Waste</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
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
    section: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    conditionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    conditionButton: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    conditionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    conditionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    categoryContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    categoryButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    categoryButtonActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    categoryText: {
        fontSize: 14,
        color: '#666',
    },
    categoryTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    totalPriceCard: {
        backgroundColor: '#E8F5E9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalPriceLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2E7D32',
    },
    totalPriceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1B5E20',
    },
    imagePickerButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#007AFF',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
    },
    imagePickerIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    imagePickerText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    imagePreview: {
        position: 'relative',
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#F44336',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeImageText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
