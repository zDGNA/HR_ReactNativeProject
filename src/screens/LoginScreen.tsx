import { Text } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
    ViewStyle,
    Alert,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackNavigationProp } from '../types/NavigationTypes';
import { useUser } from '../context/UserContext';
import { authAPI } from '../services/api';
import Card from '../components/ui/card/index';
import CardContent from '../components/ui/card/content';

const LoginScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const { setUser, setUsername } = useUser();

    const [username, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        // ===== VALIDASI INPUT - JANGAN DIHAPUS! =====
        if (!username.trim()) {
            Alert.alert('Error', 'Username tidak boleh kosong');
            return; // STOP jika username kosong
        }

        if (!password.trim()) {
            Alert.alert('Error', 'Password tidak boleh kosong');
            return; // STOP jika password kosong
        }

        setIsLoading(true);

        try {
            console.log('Attempting login...');
            console.log('Username:', username);

            // ===== PANGGIL API LOGIN =====
            const response = await authAPI.login(username, password);

            console.log('Response:', response);

            // ===== CEK RESPONSE DARI SERVER =====
            if (response.success) {
                // LOGIN BERHASIL
                console.log('Login successful!');

                // Simpan data user ke context
                setUser(response.data);
                setUsername(response.data.username);

                // Tampilkan pesan sukses
                Alert.alert(
                    'Login Berhasil',
                    `Selamat datang, ${response.data.username}!`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Reset form
                                setUsernameInput('');
                                setPassword('');
                                // Navigate ke Main
                                navigation.navigate('Main');
                            }
                        }
                    ]
                );
            } else {
                // LOGIN GAGAL - response.success = false
                console.log('Login failed:', response.message);
                Alert.alert('Login Gagal', response.message || 'Username atau password salah');
            }
        } catch (error: any) {
            // ===== ERROR HANDLING =====
            console.error('Login error:', error);

            let errorMessage = 'Terjadi kesalahan saat login';

            if (error.response) {
                // Server merespon dengan status error (4xx, 5xx)
                console.log('Error response:', error.response.data);
                errorMessage = error.response.data.message || 'Username atau password salah';
            } else if (error.request) {
                // Request dibuat tapi tidak ada response dari server
                console.log('No response from server');
                errorMessage = 'Tidak dapat terhubung ke server. Pastikan backend berjalan di ' +
                    'http://localhost:3000 atau cek IP address jika pakai HP fisik.';
            } else {
                // Error lainnya
                errorMessage = error.message || 'Terjadi kesalahan';
            }

            Alert.alert('Error', errorMessage);
        } finally {
            // Set loading ke false setelah proses selesai
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Card style={styles.logoCard}>
                    <CardContent style={styles.logoCardContent}>
                        <Text style={styles.logoText}>HRD</Text>
                    </CardContent>
                </Card>
                <Text style={styles.headerTitle}>Welcome Back!</Text>
                <Text style={styles.headerSubtitle}>Silakan login untuk melanjutkan</Text>
            </View>

            <View style={styles.body}>
                <View style={styles.formContainer}>
                    <Card style={StyleSheet.flatten([styles.card, styles.shadow, { width: '100%' }]) as ViewStyle}>
                        <CardContent style={StyleSheet.flatten([styles.cardContent, { paddingVertical: 32 }]) as ViewStyle}>

                            {/* INPUT USERNAME */}
                            <TextInput
                                placeholder="Username"
                                placeholderTextColor="#94a3b8"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="next"
                                onChangeText={setUsernameInput}
                                value={username}
                                editable={!isLoading}
                            />

                            {/* INPUT PASSWORD */}
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#94a3b8"
                                secureTextEntry
                                style={styles.input}
                                autoCapitalize="none"
                                returnKeyType="done"
                                onChangeText={setPassword}
                                value={password}
                                editable={!isLoading}
                                onSubmitEditing={handleSignIn}
                            />

                            {/* TOMBOL SIGN IN */}
                            <Pressable
                                style={[
                                    styles.signInButton,
                                    isLoading && styles.buttonDisabled
                                ]}
                                android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
                                onPress={handleSignIn}
                                disabled={isLoading}
                                accessibilityRole="button"
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text style={styles.signInButtonText}>SIGN IN</Text>
                                )}
                            </Pressable>

                            {/* INFO AKUN TEST */}
                            <View style={styles.testInfoContainer}>
                                <Text style={styles.testInfoTitle}>Akun Test:</Text>
                                <Text style={styles.testInfoText}>Username: admin</Text>
                                <Text style={styles.testInfoText}>Password: admin123</Text>
                                <Text style={styles.testInfoHint}>
                                    Pastikan backend sudah running!
                                </Text>
                            </View>
                        </CardContent>
                    </Card>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>PT Tech Innovation Indonesia</Text>
                <Text style={styles.footerText}>&copy; {new Date().getFullYear()}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1d04d9ff',
        marginTop: 16,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 8,
    },
    logoCard: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#1d04d9ff',
        opacity: 0.9,
    },
    logoCardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    body: {
        flex: 2,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    card: {},
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5.46,
        elevation: 10,
    },
    cardContent: {},
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#ffffff',
    },
    signInButton: {
        backgroundColor: '#1d04d9ff',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
        shadowColor: '#1d04d9ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    buttonDisabled: {
        backgroundColor: '#94a3b8',
        opacity: 0.7,
    },
    signInButtonText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 18,
    },
    testInfoContainer: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#1d04d9ff',
    },
    testInfoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1d04d9ff',
        marginBottom: 8,
    },
    testInfoText: {
        fontSize: 13,
        color: '#475569',
        marginBottom: 4,
        fontFamily: 'monospace',
    },
    testInfoHint: {
        fontSize: 11,
        color: '#94a3b8',
        marginTop: 8,
        fontStyle: 'italic',
    },
    footer: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    footerText: {
        color: '#94a3b8',
        fontSize: 12,
    },
});

export default LoginScreen;