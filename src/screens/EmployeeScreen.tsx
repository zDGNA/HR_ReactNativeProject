import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from "../services/api";
import { Employee } from "../types/NavigationTypes";

const EmployeeListScreen = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState("");
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await api.get("/employees");
            if (response.data && response.data.success) {
                setEmployees(response.data.data || []);
            } else {
                setEmployees([]);
            }
        } catch (error) {
            setEmployees([]);
            Alert.alert("Error", "Gagal mengambil data karyawan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAddEmployee = async () => {
        if (!newName.trim()) return;
        try {
            await api.post("/employees", {
                name: newName,
                position: "Staff",
                status: "Active",
                age: 25,
                email: "-",
                phone: "-",
                address: "-",
                contract_end_date: "2026-01-01", // Sudah disesuaikan dengan DB
                division_id: 1
            });
            setNewName("");
            setModalVisible(false);
            fetchEmployees();
        } catch (error) {
            Alert.alert("Error", "Gagal menambah karyawan");
        }
    };

    const toggleStatus = async (id: number, currentStatus: string) => {
        const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
        try {
            await api.put(`/employees/${id}/status`, { status: nextStatus });
            fetchEmployees();
        } catch (error) {
            Alert.alert("Error", "Gagal mengubah status");
        }
    };

    const toggleDetail = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1d04d9ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Employee List</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle" size={32} color="#1d04d9ff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.list}>
                {Array.isArray(employees) && employees.length > 0 ? (
                    employees.map((item) => (
                        <View key={item.id.toString()} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.employeeName}>{item.name}</Text>
                                <View style={styles.actionContainer}>
                                    <TouchableOpacity
                                        style={[styles.statusBadge, { backgroundColor: item.status === "Active" ? "#2ecc71" : "#e74c3c" }]}
                                        onPress={() => toggleStatus(item.id, item.status)}
                                    >
                                        <Text style={styles.statusText}>{item.status}</Text>
                                    </TouchableOpacity>

                                    {/* Tombol Titik 3 untuk Detail */}
                                    <TouchableOpacity onPress={() => toggleDetail(item.id)}>
                                        <Ionicons
                                            name={expandedId === item.id ? "chevron-up" : "ellipsis-vertical"}
                                            size={24}
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* BAGIAN DETAIL (Accordion) */}
                            {expandedId === item.id && (
                                <View style={styles.detailContainer}>
                                    <View style={styles.detailDivider} />
                                    <Text style={styles.detailTitle}>Informasi Karyawan</Text>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Jabatan:</Text>
                                        <Text style={styles.detailValue}>{item.position}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Email:</Text>
                                        <Text style={styles.detailValue}>{item.email}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Telepon:</Text>
                                        <Text style={styles.detailValue}>{item.phone}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Alamat:</Text>
                                        <Text style={styles.detailValue}>{item.address}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Kontrak Selesai:</Text>
                                        <Text style={[styles.detailValue, { color: '#e74c3c', fontWeight: 'bold' }]}>
                                            {item.contract_end ? new Date(item.contract_end).toLocaleDateString('id-ID') : '-'}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.centerContainer}>
                        <Text>Tidak ada data karyawan</Text>
                    </View>
                )}
            </ScrollView>

            {/* Modal Tambah Karyawan */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Tambah Karyawan</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nama Lengkap"
                            value={newName}
                            onChangeText={setNewName}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.btnCancel}>
                                <Text>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleAddEmployee} style={styles.btnSave}>
                                <Text style={{ color: 'white' }}>Simpan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa" },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1d04d9ff' },
    list: { padding: 16 },
    card: { backgroundColor: 'white', borderRadius: 15, padding: 16, marginBottom: 12, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    employeeName: { fontSize: 18, fontWeight: '600' },
    actionContainer: { flexDirection: 'row', alignItems: 'center' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginRight: 8 },
    statusText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

    // DETAIL STYLES
    detailContainer: { marginTop: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
    detailDivider: { height: 1, backgroundColor: '#eee', marginBottom: 10 },
    detailTitle: { fontSize: 14, fontWeight: 'bold', color: '#1d04d9ff', marginBottom: 10 },
    detailRow: { flexDirection: 'row', marginBottom: 5 },
    detailLabel: { width: 110, color: '#666', fontSize: 13 },
    detailValue: { flex: 1, color: '#333', fontSize: 13 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 20 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
    btnCancel: { marginRight: 15, padding: 10 },
    btnSave: { backgroundColor: '#1d04d9ff', padding: 10, borderRadius: 8, paddingHorizontal: 20 }
});

export default EmployeeListScreen;