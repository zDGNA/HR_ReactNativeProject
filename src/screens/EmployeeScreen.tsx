import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';

const employees = [
    {
        id: '1', name: 'Anna', status: 'Active',
        biodata: { age: 25, email: 'anna@email.com', phone: '0812-1234-5678', address: 'Jl. Sudirman No. 10', position: 'Software Engineer', contractEndDate: '2026-07-20' }
    },
    {
        id: '2', name: 'Budi', status: 'Inactive',
        biodata: { age: 30, email: 'budi@email.com', phone: '0857-9876-5432', address: 'Jl. Diponegoro No. 7', position: 'HR Manager', contractEndDate: '2025-02-20' }
    },
    {
        id: '3', name: 'Carla', status: 'Active',
        biodata: { age: 29, email: 'carla@email.com', phone: '0821-2222-3333', address: 'Jl. Gatot Subroto No. 5', position: 'Marketing Lead', contractEndDate: '2026-07-20' }
    },
];

type EmployeeScreenProps = { navigation: { goBack: () => void } };

const EmployeeScreen: React.FC<EmployeeScreenProps> = ({ navigation }) => {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggleDropdown = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    const renderItem = ({ item }: { item: typeof employees[0] }) => (
        <View style={styles.itemContainer}>
            <View style={styles.labelRow}>
                <Text style={styles.employeeName}>{item.name}</Text>
                <View style={styles.actionContainer}>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: item.status === 'Active' ? '#19c37d' : '#ef4444' }
                        ]}
                    >
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleDropdown(item.id)}>
                        <Ionicons
                            name="ellipsis-vertical-outline"
                            size={28}
                            color="#000000"
                            style={styles.iconMark}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {openId === item.id && (
                <View style={styles.dropdown}>
                    <Text style={styles.dropdownTitle}>Biodata</Text>
                    <Text style={styles.dropdownText}>Nama: {item.name}</Text>
                    <Text style={styles.dropdownText}>Posisi: {item.biodata.position}</Text>
                    <Text style={styles.dropdownText}>Usia: {item.biodata.age}</Text>
                    <Text style={styles.dropdownText}>Email: {item.biodata.email}</Text>
                    <Text style={styles.dropdownText}>Telepon: {item.biodata.phone}</Text>
                    <Text style={styles.dropdownText}>Alamat: {item.biodata.address}</Text>
                    <Text style={styles.dropdownText}>Contract End Date: {item.biodata.contractEndDate}</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={27} color="#1d04d9ff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Employee List</Text>
                <View style={styles.headerSpacer} />
            </View>

            <FlatList
                data={employees}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f1f5f9" },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 18,
        justifyContent: "space-between",
    },
    headerTitle: { fontSize: 22, fontWeight: "bold", color: "#1d04d9ff", letterSpacing: 0.5 },
    headerSpacer: { width: 30 },
    listContent: { paddingHorizontal: 16, paddingBottom: 32 },
    itemContainer: { backgroundColor: "#fff", borderRadius: 16, paddingVertical: 20, paddingHorizontal: 20, elevation: 3 },
    labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    actionContainer: { flexDirection: "row", alignItems: "center" },
    employeeName: { fontSize: 18, fontWeight: "600", color: "#22223b" },
    statusBadge: { borderRadius: 100, paddingVertical: 5, paddingHorizontal: 15, minWidth: 80, alignItems: "center" },
    statusText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
    iconMark: { marginLeft: 8 },
    separator: { height: 14 },
    dropdown: { backgroundColor: "#e3eafe", marginTop: 12, borderRadius: 12, padding: 18 },
    dropdownTitle: { fontWeight: "bold", fontSize: 15, color: "#1d04d9ff", marginBottom: 8 },
    dropdownText: { fontSize: 14, color: "#343a40", marginBottom: 6 },
});

export default EmployeeScreen;