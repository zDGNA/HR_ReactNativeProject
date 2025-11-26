import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, Alert } from "react-native";
import { MainTabParamList } from '../types/NavigationTypes';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from '../context/UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

type HomeScreenProps = BottomTabScreenProps<MainTabParamList, 'Home'>;

const { width } = Dimensions.get('window');

// Sample data untuk announcements
const announcementsData = [
    {
        id: '1',
        type: 'contract_ending',
        employeeName: 'Budi Santoso',
        contractEndDate: '2025-02-15',
        daysLeft: 5,
        status: 'urgent',
        icon: 'document-text'
    },
    {
        id: '2',
        type: 'contract_ending',
        employeeName: 'Siti Nurhaliza',
        contractEndDate: '2025-02-20',
        daysLeft: 10,
        status: 'warning',
        icon: 'document-text'
    },
    {
        id: '3',
        type: 'contract_ending',
        employeeName: 'Ahmad Wijaya',
        contractEndDate: '2025-03-01',
        daysLeft: 21,
        status: 'normal',
        icon: 'document-text'
    },
    {
        id: '4',
        type: 'contract_ended',
        employeeName: 'Eka Putri',
        contractEndDate: '2025-01-31',
        daysLeft: -5,
        status: 'expired',
        icon: 'alert-circle'
    },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
    // Ambil username dari context
    const { username } = useUser();
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const handleDivisionPress = () => {
        navigation.navigate('Division' as any);
    };

    const handleProfileImagePress = () => {
        Alert.alert(
            'Upload Photo',
            'Pilih sumber gambar',
            [
                { text: 'Batal', style: 'cancel' },
                { text: 'Dari Galeri', onPress: () => handleSelectImage() },
                { text: 'Dari Kamera', onPress: () => handleCameraImage() }
            ]
        );
    };

    const handleSelectImage = () => {
        Alert.alert('Info', 'Fitur galeri akan diintegrasikan dengan library image picker');
    };

    const handleCameraImage = () => {
        Alert.alert('Info', 'Fitur kamera akan diintegrasikan dengan library camera');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'urgent':
                return '#ef4444';
            case 'warning':
                return '#f59e0b';
            case 'normal':
                return '#3b82f6';
            case 'expired':
                return '#6b7280';
            default:
                return '#64748b';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'urgent':
                return 'MENDESAK';
            case 'warning':
                return 'PERINGATAN';
            case 'normal':
                return 'NORMAL';
            case 'expired':
                return 'BERAKHIR';
            default:
                return status;
        }
    };

    const renderAnnouncementItem = ({ item }: any) => (
        <View style={[styles.announcementItem, { borderLeftColor: getStatusColor(item.status) }]}>
            <View style={styles.announcementIcon}>
                <Ionicons name={item.icon as any} size={28} color={getStatusColor(item.status)} />
            </View>

            <View style={styles.announcementContent}>
                <Text style={styles.announcementTitle}>{item.employeeName}</Text>
                <Text style={styles.announcementDate}>
                    Kontrak berakhir: {new Date(item.contractEndDate).toLocaleDateString('id-ID')}
                </Text>
                <View style={styles.announcementFooter}>
                    <Text style={[styles.announcementStatus, { color: getStatusColor(item.status) }]}>
                        {getStatusLabel(item.status)}
                    </Text>
                    <Text style={styles.daysLeft}>
                        {item.daysLeft > 0 ? `${item.daysLeft} hari lagi` : `${Math.abs(item.daysLeft)} hari lalu`}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <SafeAreaView style={styles.container}>
                {/* Header dengan Profile */}
                <View style={styles.header}>
                    <View style={styles.profileSection}>
                        <TouchableOpacity
                            style={styles.profileImageContainer}
                            onPress={handleProfileImagePress}
                        >
                            {profileImage ? (
                                <Image
                                    source={{ uri: profileImage }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <View style={styles.profileImagePlaceholder}>
                                    <Ionicons name="person" size={40} color="#1d04d9ff" />
                                </View>
                            )}
                            <View style={styles.cameraIcon}>
                                <Ionicons name="camera" size={16} color="white" />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.profileInfo}>
                            <Text style={styles.greeting}>Selamat Datang</Text>
                            <Text style={styles.username}>{username}</Text>
                            <Text style={styles.role}>Administrator HRD</Text>
                        </View>
                    </View>
                </View>

                {/* Bagian Announcement dengan Scroll */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Pengumuman Kontrak</Text>
                    </View>

                    <FlatList
                        data={announcementsData}
                        keyExtractor={(item) => item.id}
                        renderItem={renderAnnouncementItem}
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        contentContainerStyle={styles.announcementList}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                {/* Bagian Division */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Division</Text>
                    <TouchableOpacity
                        style={styles.bannerContainer}
                        onPress={handleDivisionPress}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.bannerText}>
                            View All Division
                        </Text>
                        <Text style={styles.arrowIcon}>→</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        paddingVertical: 24,
        paddingHorizontal: 20,
        backgroundColor: '#f8fafc',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImageContainer: {
        position: 'relative',
        marginRight: 16,
    },
    profileImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1d04d9ff',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#1d04d9ff',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1d04d9ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#ffffff',
    },
    profileInfo: {
        flex: 1,
    },
    greeting: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
    username: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1d04d9ff',
        marginVertical: 4,
    },
    role: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    sectionContainer: {
        marginTop: 28,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    seeAll: {
        fontSize: 14,
        color: '#1d04d9ff',
        fontWeight: '600',
    },
    announcementList: {
        marginBottom: 12,
    },
    announcementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    announcementIcon: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    announcementContent: {
        flex: 1,
    },
    announcementTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    announcementDate: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 8,
    },
    announcementFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    announcementStatus: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    daysLeft: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
    announcementAction: {
        paddingLeft: 12,
    },
    bannerContainer: {
        backgroundColor: '#1d04d9ff',
        borderRadius: 16,
        minHeight: 140,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 30,
    },
    bannerText: {
        color: '#ffffff',
        textAlign: 'center',
        padding: 20,
        fontSize: 18,
        fontWeight: '600',
    },
    arrowIcon: {
        color: '#ffffff',
        fontSize: 28,
        marginTop: 8,
    },
});

export default HomeScreen;