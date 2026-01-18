import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * Mendefinisikan tipe data untuk item Divisi.
 */
type DivisionItem = {
    id: string;
    name: string;
    description: string;
    employeeCount: number;
    icon: React.ReactElement;
    color: string;
};

/**
 * Mendefinisikan tipe data untuk parameter rute DivisionScreen.
 * RootStackParamList harus didefinisikan secara global atau di file terpisah.
 * Untuk contoh ini, kita asumsikan struktur rute minimal.
 */
type RootStackParamList = {
    Division: { selectedDept?: DivisionItem } | undefined;
    Employee: { DivisionId: string; DivisionName: string; DivisionIcon: React.ReactElement; DivisionColor: string };
    // Tambahkan rute lain yang mungkin ada
};

type DivisionScreenProps = NativeStackScreenProps<RootStackParamList, 'Division'>;

const allDivision: DivisionItem[] = [
    {
        id: '1',
        name: 'IT',
        description: 'Information Technology',
        employeeCount: 25,
        icon: <Ionicons name="desktop" size={24} color="#ffffffff" />,
        color: '#3b82f6',
    },
    {
        id: '2',
        name: 'HR',
        description: 'Human Resources',
        employeeCount: 15,
        icon: <Ionicons name="people" size={24} color="#ffffffff" />,
        color: '#ec4899',
    },
    {
        id: '3',
        name: 'Finance',
        description: 'Finance Department',
        employeeCount: 20,
        icon: <Ionicons name="wallet" size={24} color="#ffffffff" />,
        color: '#10b981',
    },
    {
        id: '4',
        name: 'Marketing',
        description: 'Marketing Division',
        employeeCount: 18,
        icon: <Ionicons name="megaphone" size={24} color="#ffffffff" />,
        color: '#f59e0b',
    },
];

const DivisionScreen: React.FC<DivisionScreenProps> = ({ navigation, route }) => {
    // Menggunakan optional chaining dan default value untuk menghindari error jika route.params undefined
    const selectedDept = route.params?.selectedDept;

    const handleDivisionSelect = (dept: DivisionItem) => {
        navigation.navigate('Employee', {
            DivisionId: dept.id,
            DivisionName: dept.name,
            DivisionIcon: dept.icon,
            DivisionColor: dept.color
        });
    };

    const renderDivisionDetail = (dept: DivisionItem) => (
        <View style={styles.detailContainer}>
            <View style={[styles.detailHeader, { backgroundColor: dept.color }]}>
                {/* Render icon langsung sebagai elemen */}
                <View style={styles.detailIconContainer}>{dept.icon}</View>
                <Text style={styles.detailTitle}>{dept.name}</Text>
                <Text style={styles.detailDesc}>{dept.description}</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{dept.employeeCount}</Text>
                    <Text style={styles.statLabel}>Employees</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.viewEmployeeBtn, { backgroundColor: dept.color }]}
                onPress={() => handleDivisionSelect(dept)}
                activeOpacity={0.8}
            >
                <Text style={styles.viewEmployeeBtnText}>View Employees →</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.backToAllBtn}
                onPress={() => navigation.setParams({ selectedDept: undefined })}
                activeOpacity={0.7}
            >
                <Text style={styles.backToAllBtnText}>← Back to all Divisions</Text>
            </TouchableOpacity>
        </View>
    );

    const renderAllDivision = () => (
        <FlatList
            data={allDivision}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.divisionItem}
                    // Menyetel params untuk menampilkan detail divisi yang dipilih
                    onPress={() => navigation.setParams({ selectedDept: item })}
                    activeOpacity={0.7}
                >
                    <View style={[styles.itemIconBox, { backgroundColor: item.color }]}>
                        {/* Render icon langsung */}
                        {item.icon}
                    </View>
                    <View style={styles.itemContent}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemDesc}>{item.description}</Text>
                        <Text style={styles.itemEmployees}>{item.employeeCount} employees</Text>
                    </View>
                    <Text style={styles.itemArrow}>→</Text>
                </TouchableOpacity>
            )}
            // FlatList menangani scrolling, tidak perlu ScrollView di luar
            contentContainerStyle={styles.listContent}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    // Jika sedang melihat detail, kembali ke list, jika tidak, goBack
                    if (selectedDept) {
                        navigation.setParams({ selectedDept: undefined });
                    } else {
                        navigation.goBack();
                    }
                }}>
                    {/* Menggunakan nama icon yang berbeda jika sedang melihat detail */}
                    <Ionicons name={selectedDept ? "arrow-back" : "chevron-back"} size={27} color="#1d04d9ff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{selectedDept ? selectedDept.name : 'Divisions'}</Text>
                <View style={{ width: 27 }} />
            </View>

            {/* Jika selectedDept ada, tampilkan detail di dalam ScrollView agar bisa digulir */}
            {selectedDept
                ? <View style={styles.content}>
                    <View>{renderDivisionDetail(selectedDept)}</View>
                </View>
                : renderAllDivision()
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1d04d9ff',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
    },
    detailContainer: {
        padding: 20,
    },
    detailHeader: {
        borderRadius: 20,
        paddingVertical: 40,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    // Container untuk menampung icon agar tidak dikira teks (karena icon adalah JSX)
    detailIconContainer: {
        marginBottom: 12,
    },
    detailTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    detailDesc: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1d04d9ff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    viewEmployeeBtn: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16, // Tambahkan margin
    },
    viewEmployeeBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    backToAllBtn: {
        alignItems: 'center',
        padding: 10,
    },
    backToAllBtnText: {
        color: '#1d04d9ff',
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    listContent: {
        padding: 20,
    },
    divisionItem: {
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    itemIconBox: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    itemDesc: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 4,
    },
    itemEmployees: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
    itemArrow: {
        fontSize: 20,
        color: '#1d04d9ff',
    },
});

export default DivisionScreen;