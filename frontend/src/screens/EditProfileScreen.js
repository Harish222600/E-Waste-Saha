import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://192.168.29.146:5000/api';

export default function EditProfileScreen({ navigation }) {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        organizationName: user?.organizationName || '',
    });
    const [profileImage, setProfileImage] = useState(user?.profilePicture || null);
    const [newImage, setNewImage] = useState(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera roll permissions to upload a profile picture');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            setNewImage(result.assets[0]);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'Please login again');
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('address', formData.address);

            if (user?.role === 'organization') {
                formDataToSend.append('organizationName', formData.organizationName);
            }

            if (newImage) {
                formDataToSend.append('profilePicture', {
                    uri: newImage.uri,
                    type: 'image/jpeg',
                    name: 'profile.jpg',
                });
            }

            const response = await axios.put(
                `${API_URL}/auth/profile`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                // Update user context
                updateUser(response.data.data);
                Alert.alert('Success', 'Profile updated successfully');
                navigation.goBack();
            }
        } catch (error) {
            console.error('Update profile error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit Profile</Text>
                </View>

                {/* Profile Picture */}
                <View style={styles.imageSection}>
                    <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <Text style={styles.placeholderText}>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                        <View style={styles.cameraIcon}>
                            <Text style={styles.cameraIconText}>📷</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.imageHint}>Tap to change profile picture</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            placeholder="Enter your name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={user?.email}
                            editable={false}
                        />
                        <Text style={styles.hint}>Email cannot be changed</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            placeholder="Enter phone number"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.address}
                            onChangeText={(text) => setFormData({ ...formData, address: text })}
                            placeholder="Enter your address"
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {user?.role === 'organization' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Organization Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.organizationName}
                                onChangeText={(text) => setFormData({ ...formData, organizationName: text })}
                                placeholder="Enter organization name"
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                        onPress={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Changes</Text>
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
        paddingBottom: 40,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
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
    imageSection: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    cameraIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    cameraIconText: {
        fontSize: 20,
    },
    imageHint: {
        fontSize: 13,
        color: '#666',
    },
    form: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
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
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#999',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    hint: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 12,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
