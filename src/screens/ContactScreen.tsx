import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MainTabParamList } from '../types/NavigationTypes';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from "react-native-safe-area-context";
import Card from '../components/ui/card/index';
import CardContent from '../components/ui/card/content';
// Anggap Anda memiliki komponen ikon yang diimpor, misalnya dari 'react-native-vector-icons/Ionicons'
// import Ionicons from 'react-native-vector-icons/Ionicons'; 

type ContactScreenProps = BottomTabScreenProps<MainTabParamList, 'Contact'>;

// Komponen Item Kontak sederhana untuk reusabilitas
type ContactItemProps = {
    iconName?: string;
    title: string;
    value: string;
};
const ContactItem: React.FC<ContactItemProps> = ({ iconName, title, value }) => (
    <View style={contactStyles.item}>
        {/* Placeholder untuk Ikon */}
        <View style={contactStyles.info}>
            <Text style={contactStyles.title}>{title}</Text>
            <Text style={contactStyles.value}>{value}</Text>
        </View>
    </View>
);

const ContactScreen: React.FC<ContactScreenProps> = ({ navigation, route }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hubungi Kami</Text>
                <Text style={styles.headerSubtitle}>Kami siap membantu pertanyaan Anda.</Text>
            </View>

            <View style={styles.content}>
                <Card style={styles.contactCard}>
                    <CardContent style={styles.cardContentStyle}>
                        <ContactItem
                            title="Cabang Denpasar"
                            value="techinnovationindonesia@gmail.com"
                            iconName="mail-outline"
                        />
                        <ContactItem
                            title="Front Office"
                            value="(+62) 987 654 321"
                            iconName="call-outline"
                        />
                        <View style={contactStyles.divider} />
                        <ContactItem
                            title="Company Phone"
                            value="(+62) 123 456 789"
                            iconName="call-outline"
                        />
                        <ContactItem
                            title="IT Support"
                            value="(+62) 000 111 222"
                            iconName="call-outline"
                        />
                        <View style={contactStyles.divider} />
                        <ContactItem
                            title="Alamat"
                            value="Jl. Perusahaan No. 123, Jakarta"
                            iconName="location-outline"
                        />
                    </CardContent>
                </Card>
            </View>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        paddingTop: 30,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: '#f8fafc',
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#94a3b8',
        marginTop: 4,
    },
    content: {
        flex: 1,
        padding: 24,
        backgroundColor: '#ffffff',
    },
    contactCard: {
        // Menggunakan lebar penuh dalam padding 24
        width: '100%',
        borderRadius: 16,
        backgroundColor: '#f8fafc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    cardContentStyle: {
        padding: 24,
    },
});

const contactStyles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    iconPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e7ff', // Warna latar belakang ikon
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 2,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1d04d9ff', // Warna utama
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 8,
    }
});

export default ContactScreen;