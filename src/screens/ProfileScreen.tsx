import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, ScrollView, ActivityIndicator } from "react-native";
import { MainTabParamList } from '../types/NavigationTypes';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from '../types/NavigationTypes';
import { useUser } from '../context/UserContext';
import Card from '../components/ui/card/index';
import CardContent from '../components/ui/card/content';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from "react-native";
import api from "../services/api";

type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
    const rootNavigation = useNavigation<RootStackNavigationProp>();
    const { user, username, setUsername: setGlobalUsername, setUser, logout } = useUser();

    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [editUsername, setEditUsername] = useState(username);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleEditUsername = async () => {
        if (editUsername.trim().length < 3) {
            Alert.alert('Error', 'Username minimal 3 karakter');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.put('/users/update-username', {
                userId: user?.id,
                newUsername: editUsername
            });

            if (response.data.success) {
                setGlobalUsername(editUsername);
                if (user) setUser({ ...user, username: editUsername });
                setShowEditModal(false);
                Alert.alert('Success', 'Username berhasil diubah');
            }
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Gagal terhubung ke server');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!oldPassword) {
            Alert.alert('Error', 'Password lama harus diisi');
            return;
        }
        if (!newPassword || !confirmPassword) {
            Alert.alert('Error', 'Password baru dan konfirmasi harus diisi');
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password minimal 6 karakter');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Password baru dan konfirmasi tidak cocok');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.put('/users/update-password', {
                userId: user?.id,
                oldPassword: oldPassword,
                newPassword: newPassword
            });

            if (response.data.success) {
                setShowPasswordModal(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                Alert.alert('Success', 'Password berhasil diubah');
            }
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Password lama tidak sesuai');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Apakah Anda yakin ingin keluar?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        rootNavigation.navigate('LoginScreen');
                    }
                }
            ]
        );
    };

    const resetEditModal = () => {
        setEditUsername(username);
        setShowEditModal(false);
    };

    const resetPasswordModal = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        setShowPasswordModal(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profil Saya</Text>
                </View>

                <View style={styles.content}>
                    <Card style={styles.profileCard}>
                        <CardContent style={styles.cardContentStyle}>
                            <View style={styles.profileHeader}>
                                <Image
                                    source={require('../assets/profile-picture.jpg')}
                                    style={styles.profileImage}
                                />
                                <View style={styles.userInfo}>
                                    <Text style={styles.usernameDisplay}>{username}</Text>
                                    <Text style={styles.roleDisplay}>{user?.role || 'Administrator HRD'}</Text>
                                    <Text style={styles.emailDisplay}>{user?.email || 'admin@perusahaan.com'}</Text>
                                </View>
                            </View>
                        </CardContent>
                    </Card>

                    <Card style={styles.settingsCard}>
                        <CardContent style={styles.cardContentStyle}>
                            <Text style={styles.settingsTitle}>Pengaturan Akun</Text>

                            <TouchableOpacity
                                style={styles.settingItem}
                                onPress={() => setShowEditModal(true)}
                            >
                                <View style={styles.settingItemLeft}>
                                    <View style={styles.settingIcon}>
                                        <Ionicons name="person-outline" size={24} color="#1d04d9ff" />
                                    </View>
                                    <View style={styles.settingText}>
                                        <Text style={styles.settingLabel}>Ubah Username</Text>
                                        <Text style={styles.settingValue}>{username}</Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
                            </TouchableOpacity>

                            <View style={styles.divider} />

                            <TouchableOpacity
                                style={styles.settingItem}
                                onPress={() => setShowPasswordModal(true)}
                            >
                                <View style={styles.settingItemLeft}>
                                    <View style={styles.settingIcon}>
                                        <Ionicons name="lock-closed-outline" size={24} color="#1d04d9ff" />
                                    </View>
                                    <View style={styles.settingText}>
                                        <Text style={styles.settingLabel}>Ubah Password</Text>
                                        <Text style={styles.settingValue}>••••••••</Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
                            </TouchableOpacity>
                        </CardContent>
                    </Card>

                    <Card style={styles.infoCard}>
                        <CardContent style={styles.cardContentStyle}>
                            <Text style={styles.companyName}>Tentang Perusahaan</Text>
                            <Text style={styles.profileText}>
                                Perusahaan kami berkomitmen untuk memberikan layanan terbaik kepada pelanggan.
                                Didirikan pada tahun 2025, kami selalu berusaha meningkatkan kualitas produk
                                dan layanan untuk memenuhi kebutuhan Anda.
                            </Text>
                        </CardContent>
                    </Card>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={24} color="white" />
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        © {new Date().getFullYear()} PT Tech Innovation Indonesia
                    </Text>
                </View>
            </ScrollView>

            <Modal
                visible={showEditModal}
                transparent
                animationType="slide"
                onRequestClose={resetEditModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={resetEditModal}>
                                <Text style={styles.modalHeaderButton}>Batal</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Ubah Username</Text>
                            <TouchableOpacity onPress={handleEditUsername} disabled={isLoading}>
                                {isLoading ? <ActivityIndicator size="small" color="#1d04d9ff" /> : <Text style={styles.modalHeaderButtonSave}>Simpan</Text>}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.inputLabel}>Username Baru</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Masukkan username baru"
                                placeholderTextColor="#94a3b8"
                                value={editUsername}
                                onChangeText={setEditUsername}
                                autoFocus
                            />
                            <Text style={styles.inputHint}>
                                Username minimal 3 karakter dan hanya dapat menggunakan huruf, angka, dan underscore.
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showPasswordModal}
                transparent
                animationType="slide"
                onRequestClose={resetPasswordModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={resetPasswordModal}>
                                <Text style={styles.modalHeaderButton}>Batal</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Ubah Password</Text>
                            <TouchableOpacity onPress={handleChangePassword} disabled={isLoading}>
                                {isLoading ? <ActivityIndicator size="small" color="#1d04d9ff" /> : <Text style={styles.modalHeaderButtonSave}>Simpan</Text>}
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.inputLabel}>Password Lama</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={styles.textInputPassword}
                                    placeholder="Masukkan password lama"
                                    placeholderTextColor="#94a3b8"
                                    secureTextEntry={!showOldPassword}
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowOldPassword(!showOldPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showOldPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color="#94a3b8"
                                    />
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.inputLabel, { marginTop: 16 }]}>Password Baru</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={styles.textInputPassword}
                                    placeholder="Masukkan password baru"
                                    placeholderTextColor="#94a3b8"
                                    secureTextEntry={!showNewPassword}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color="#94a3b8"
                                    />
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.inputLabel, { marginTop: 16 }]}>Konfirmasi Password</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={styles.textInputPassword}
                                    placeholder="Konfirmasi password baru"
                                    placeholderTextColor="#94a3b8"
                                    secureTextEntry={!showConfirmPassword}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color="#94a3b8"
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.inputHint}>
                                Password minimal 6 karakter.
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        paddingTop: 20,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: '#f8fafc',
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1d04d9ff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    profileCard: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#1d04d9ff',
        marginRight: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImageContainer: {
        position: 'relative',
        marginRight: 16,
    },
    cardContentStyle: {
        padding: 24,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 20,
    },
    userInfo: {
        flex: 1,
    },
    usernameDisplay: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    roleDisplay: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 2,
    },
    emailDisplay: {
        fontSize: 12,
        color: '#94a3b8',
    },
    settingsCard: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    settingsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingText: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    settingValue: {
        fontSize: 13,
        color: '#94a3b8',
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 12,
    },
    infoCard: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    companyName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    profileText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#475569',
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#ef4444',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        backgroundColor: '#ffffff',
    },
    footerText: {
        fontSize: 12,
        color: '#94a3b8',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    modalHeaderButton: {
        fontSize: 16,
        color: '#94a3b8',
        fontWeight: '600',
    },
    modalHeaderButtonSave: {
        fontSize: 16,
        color: '#1d04d9ff',
        fontWeight: '700',
    },
    modalBody: {
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
        marginBottom: 12,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        paddingRight: 12,
        marginBottom: 12,
    },
    textInputPassword: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
    },
    eyeIcon: {
        padding: 8,
    },
    inputHint: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 8,
    },
});

export default ProfileScreen;