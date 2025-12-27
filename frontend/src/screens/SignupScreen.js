import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const ROLES = [
    { value: 'user', label: 'User' },
    { value: 'collector', label: 'Collector' },
    { value: 'organization', label: 'Organization' },
];

export default function SignupScreen({ navigation }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        phone: '',
        address: '',
        organizationName: '',
    });
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSignup = async () => {
        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (formData.password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (formData.role === 'organization' && !formData.organizationName) {
            Alert.alert('Error', 'Organization name is required');
            return;
        }

        setLoading(true);

        // Prepare data
        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            phone: formData.phone,
            address: formData.address,
        };

        if (formData.role === 'organization') {
            userData.organizationName = formData.organizationName;
        }

        const result = await signup(userData);
        setLoading(false);

        if (!result.success) {
            Alert.alert('Signup Failed', result.error);
        }
        // Navigation will be handled automatically by App.js based on auth state
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Sign up to get started</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Role Selection */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Select Role *</Text>
                            <View style={styles.roleContainer}>
                                {ROLES.map((role) => (
                                    <TouchableOpacity
                                        key={role.value}
                                        style={[
                                            styles.roleButton,
                                            formData.role === role.value && styles.roleButtonActive,
                                        ]}
                                        onPress={() => updateField('role', role.value)}
                                        disabled={loading}
                                    >
                                        <Text
                                            style={[
                                                styles.roleButtonText,
                                                formData.role === role.value && styles.roleButtonTextActive,
                                            ]}
                                        >
                                            {role.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Name */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChangeText={(value) => updateField('name', value)}
                                editable={!loading}
                            />
                        </View>

                        {/* Email */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                value={formData.email}
                                onChangeText={(value) => updateField('email', value)}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!loading}
                            />
                        </View>

                        {/* Organization Name (only for organization role) */}
                        {formData.role === 'organization' && (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Organization Name *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter organization name"
                                    value={formData.organizationName}
                                    onChangeText={(value) => updateField('organizationName', value)}
                                    editable={!loading}
                                />
                            </View>
                        )}

                        {/* Phone */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Phone</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChangeText={(value) => updateField('phone', value)}
                                keyboardType="phone-pad"
                                editable={!loading}
                            />
                        </View>

                        {/* Address */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your address"
                                value={formData.address}
                                onChangeText={(value) => updateField('address', value)}
                                editable={!loading}
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter password (min 6 characters)"
                                value={formData.password}
                                onChangeText={(value) => updateField('password', value)}
                                secureTextEntry
                                editable={!loading}
                            />
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChangeText={(value) => updateField('confirmPassword', value)}
                                secureTextEntry
                                editable={!loading}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            disabled={loading}
                        >
                            <Text style={styles.linkText}>Login</Text>
                        </TouchableOpacity>
                    </View>
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
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    form: {
        marginBottom: 24,
    },
    inputContainer: {
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
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
    },
    roleContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    roleButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    roleButtonActive: {
        borderColor: '#007AFF',
        backgroundColor: '#E3F2FD',
    },
    roleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    roleButtonTextActive: {
        color: '#007AFF',
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
    linkText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
});
