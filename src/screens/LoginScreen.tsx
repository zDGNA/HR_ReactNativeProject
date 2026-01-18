import { Text } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackNavigationProp } from '../types/NavigationTypes';
import Card from '../components/ui/card/index';
import CardContent from '../components/ui/card/content';

const LoginScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp>();

    // 1. Tambahkan state untuk input
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        // Logika autentikasi di sini
        console.log('Username:', username);
        console.log('Password:', password);
        navigation.navigate('Main');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Card style={styles.logoCard}>
                    <CardContent style={styles.logoCardContent}>
                        <Text style={styles.logoText}></Text>
                    </CardContent>
                </Card>
                <Text style={styles.headerTitle}>Welcome Back!</Text>
            </View>

            <View style={styles.body}>
                <View style={styles.formContainer}>
                    <Card style={StyleSheet.flatten([styles.card, styles.shadow, { width: '100%' }]) as ViewStyle}>
                        <CardContent style={StyleSheet.flatten([styles.cardContent, { paddingVertical: 32 }]) as ViewStyle}>
                            <TextInput
                                placeholder="Username"
                                placeholderTextColor="#94a3b8"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                returnKeyType="next"
                                onChangeText={setUsername}
                                value={username}
                            />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#94a3b8"
                                secureTextEntry
                                style={styles.input}
                                autoCapitalize="none"
                                returnKeyType="done"
                                onChangeText={setPassword}
                                value={password}
                            />

                            <Pressable
                                style={styles.signInButton}
                                android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
                                onPress={handleSignIn}
                                accessibilityRole="button"
                            >
                                <Text style={styles.signInButtonText}>SIGN IN</Text>
                            </Pressable>

                            <Pressable
                                style={styles.signUpButton}
                                android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
                                onPress={() => console.log('Sign Up pressed')}
                                accessibilityRole="button"
                            >
                                <Text style={styles.signUpButtonText}>SIGN UP</Text>
                            </Pressable>
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
    formContainer: { // Container baru untuk centering form
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    card: {

    },
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
    cardContent: {

    },
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
        fontSize: 16,
        color: '#333',
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
    signInButtonText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 18,
    },
    signUpButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#1d04d9ff',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
    },
    signUpButtonText: {
        fontWeight: '700',
        fontSize: 18,
        color: '#1d04d9ff',
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