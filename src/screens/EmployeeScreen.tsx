import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, Platform } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../services/api";
import { Employee } from "../types/NavigationTypes";

type RootStackParamList = {
    Employee: {
        divisionId: string;
        divisionName: string;
        divisionIcon: string;
        divisionColor: string;
        employeeCount: number;
    };
    Division: undefined;
};

type EmployeeScreenProps = NativeStackScreenProps<RootStackParamList, 'Employee'>;

const EmployeeScreen: React.FC<EmployeeScreenProps> = ({ navigation, route }) => {
    const { divisionId, divisionName, divisionIcon, divisionColor } = route.params;

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        position: "",
        age: "",
        email: "",
        phone: "",
        address: "",
        contract_end_date: new Date(),
        status: "Active",
        division_id: parseInt(divisionId)
    });

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/employees/division/${divisionId}`);
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
    }, [divisionId]);

    const resetForm = () => {
        setFormData({
            id: 0,
            name: "",
            position: "",
            age: "",
            email: "",
            phone: "",
            address: "",
            contract_end_date: new Date(),
            status: "Active",
            division_id: parseInt(divisionId)
        });
        setEditMode(false);
    };

    const openAddModal = () => {
        resetForm();
        setModalVisible(true);
    };

    const openEditModal = (employee: Employee) => {
        setFormData({
            id: employee.id,
            name: employee.name,
            position: employee.position,
            age: employee.age.toString(),
            email: employee.email,
            phone: employee.phone,
            address: employee.address,
            contract_end_date: employee.contract_end_date ? new Date(employee.contract_end_date) : new Date(),
            status: employee.status,
            division_id: parseInt(divisionId)
        });
        setEditMode(true);
        setModalVisible(true);
    };

    const handleSaveEmployee = async () => {
        if (!formData.name.trim()) {
            Alert.alert("Error", "Nama wajib diisi");
            return;
        }
        if (!formData.position.trim()) {
            Alert.alert("Error", "Jabatan wajib diisi");
            return;
        }
        if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 17) {
            Alert.alert("Error", "Umur harus diisi dengan angka minimal 17");
            return;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            Alert.alert("Error", "Email tidak valid");
            return;
        }
        if (!formData.phone.trim()) {
            Alert.alert("Error", "Nomor telepon wajib diisi");
            return;
        }

        try {
            const payload = {
                name: formData.name,
                position: formData.position,
                age: Number(formData.age),
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                contract_end_date: formData.contract_end_date.toISOString().split('T')[0],
                status: formData.status,
                division_id: formData.division_id
            };

            if (editMode) {
                await api.put(`/employees/${formData.id}`, payload);
                Alert.alert("Berhasil", "Data karyawan berhasil diperbarui");
            } else {
                await api.post("/employees", payload);
                Alert.alert("Berhasil", "Karyawan baru berhasil ditambahkan");
            }

            setModalVisible(false);
            resetForm();
            fetchEmployees();
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "Gagal menyimpan data");
        }
    };

    const handleDeleteEmployee = (id: number, name: string) => {
        Alert.alert(
            "Hapus Karyawan",
            `Apakah Anda yakin ingin menghapus ${name}?`,
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/employees/${id}`);
                            Alert.alert("Berhasil", "Karyawan berhasil dihapus");
                            fetchEmployees();
                        } catch (error) {
                            Alert.alert("Error", "Gagal menghapus karyawan");
                        }
                    }
                }
            ]
        );
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

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFormData({ ...formData, contract_end_date: selectedDate });
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={27} color="#ffffff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{divisionName}</Text>
                    <View style={{ width: 32 }} />
                </View>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#1d04d9ff" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { backgroundColor: divisionColor }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={27} color="#ffffff" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Ionicons name={divisionIcon as any} size={24} color="#ffffff" />
                    <Text style={styles.headerTitle}>{divisionName}</Text>
                </View>
                <TouchableOpacity onPress={openAddModal}>
                    <Ionicons name="add-circle" size={32} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <View style={styles.statsBar}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{employees.length}</Text>
                    <Text style={styles.statLabel}>Total Karyawan</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {employees.filter(e => e.status === 'Active').length}
                    </Text>
                    <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {employees.filter(e => e.status === 'Inactive').length}
                    </Text>
                    <Text style={styles.statLabel}>Inactive</Text>
                </View>
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

                                    <TouchableOpacity onPress={() => toggleDetail(item.id)}>
                                        <Ionicons
                                            name={expandedId === item.id ? "chevron-up" : "ellipsis-vertical"}
                                            size={24}
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {expandedId === item.id && (
                                <View style={styles.detailContainer}>
                                    <View style={styles.detailDivider} />
                                    <Text style={styles.detailTitle}>Informasi Karyawan</Text>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Jabatan:</Text>
                                        <Text style={styles.detailValue}>{item.position}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Umur:</Text>
                                        <Text style={styles.detailValue}>{item.age} tahun</Text>
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
                                            {item.contract_end_date ? new Date(item.contract_end_date).toLocaleDateString('id-ID') : '-'}
                                        </Text>
                                    </View>

                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity
                                            style={styles.btnEdit}
                                            onPress={() => openEditModal(item)}
                                        >
                                            <Ionicons name="create-outline" size={20} color="white" />
                                            <Text style={styles.btnEditText}>Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.btnDelete}
                                            onPress={() => handleDeleteEmployee(item.id, item.name)}
                                        >
                                            <Ionicons name="trash-outline" size={20} color="white" />
                                            <Text style={styles.btnDeleteText}>Hapus</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={64} color="#cbd5e1" />
                        <Text style={styles.emptyText}>Belum ada karyawan di divisi ini</Text>
                        <TouchableOpacity style={styles.emptyButton} onPress={openAddModal}>
                            <Text style={styles.emptyButtonText}>Tambah Karyawan Pertama</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editMode ? "Edit Karyawan" : `Tambah Karyawan - ${divisionName}`}
                            </Text>
                            <TouchableOpacity onPress={() => {
                                setModalVisible(false);
                                resetForm();
                            }}>
                                <Ionicons name="close" size={28} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                            <Text style={styles.label}>Nama Lengkap *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Masukkan nama lengkap"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />

                            <Text style={styles.label}>Jabatan *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: Staff IT, Manager HRD"
                                value={formData.position}
                                onChangeText={(text) => setFormData({ ...formData, position: text })}
                            />

                            <Text style={styles.label}>Umur *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Masukkan umur"
                                keyboardType="numeric"
                                value={formData.age}
                                onChangeText={(text) => setFormData({ ...formData, age: text })}
                            />

                            <Text style={styles.label}>Email *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="contoh@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                            />

                            <Text style={styles.label}>Nomor Telepon *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="08xxxxxxxxxx"
                                keyboardType="phone-pad"
                                value={formData.phone}
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            />

                            <Text style={styles.label}>Alamat</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Masukkan alamat lengkap"
                                multiline
                                numberOfLines={3}
                                value={formData.address}
                                onChangeText={(text) => setFormData({ ...formData, address: text })}
                            />

                            <Text style={styles.label}>Tanggal Kontrak Selesai *</Text>
                            <TouchableOpacity
                                style={styles.datePickerButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Ionicons name="calendar-outline" size={20} color="#1d04d9ff" />
                                <Text style={styles.datePickerText}>
                                    {formData.contract_end_date.toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={formData.contract_end_date}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onDateChange}
                                    minimumDate={new Date()}
                                />
                            )}

                            <Text style={styles.label}>Status</Text>
                            <View style={styles.statusSelector}>
                                <TouchableOpacity
                                    style={[
                                        styles.statusOption,
                                        formData.status === "Active" && styles.statusOptionActive
                                    ]}
                                    onPress={() => setFormData({ ...formData, status: "Active" })}
                                >
                                    <Text style={[
                                        styles.statusOptionText,
                                        formData.status === "Active" && styles.statusOptionTextActive
                                    ]}>
                                        Active
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.statusOption,
                                        formData.status === "Inactive" && styles.statusOptionInactive
                                    ]}
                                    onPress={() => setFormData({ ...formData, status: "Inactive" })}
                                >
                                    <Text style={[
                                        styles.statusOptionText,
                                        formData.status === "Inactive" && styles.statusOptionTextInactive
                                    ]}>
                                        Inactive
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.btnCancel}
                                onPress={() => {
                                    setModalVisible(false);
                                    resetForm();
                                }}
                            >
                                <Text style={styles.btnCancelText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.btnSave}
                                onPress={handleSaveEmployee}
                            >
                                <Text style={styles.btnSaveText}>
                                    {editMode ? "Perbarui" : "Simpan"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa" },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 10 },
    headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' },
    statsBar: { flexDirection: 'row', backgroundColor: 'white', padding: 16, marginHorizontal: 16, marginTop: 16, borderRadius: 12, elevation: 2 },
    statItem: { flex: 1, alignItems: 'center' },
    statNumber: { fontSize: 24, fontWeight: 'bold', color: '#1d04d9ff' },
    statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
    statDivider: { width: 1, backgroundColor: '#e0e0e0', marginHorizontal: 8 },
    list: { padding: 16 },
    card: { backgroundColor: 'white', borderRadius: 15, padding: 16, marginBottom: 12, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    employeeName: { fontSize: 18, fontWeight: '600', flex: 1 },
    actionContainer: { flexDirection: 'row', alignItems: 'center' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginRight: 8 },
    statusText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    detailContainer: { marginTop: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
    detailDivider: { height: 1, backgroundColor: '#eee', marginBottom: 10 },
    detailTitle: { fontSize: 14, fontWeight: 'bold', color: '#1d04d9ff', marginBottom: 10 },
    detailRow: { flexDirection: 'row', marginBottom: 5 },
    detailLabel: { width: 130, color: '#666', fontSize: 13 },
    detailValue: { flex: 1, color: '#333', fontSize: 13 },
    actionButtons: { flexDirection: 'row', marginTop: 15, gap: 10 },
    btnEdit: { flex: 1, flexDirection: 'row', backgroundColor: '#3b82f6', padding: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    btnEditText: { color: 'white', fontWeight: 'bold', marginLeft: 5 },
    btnDelete: { flex: 1, flexDirection: 'row', backgroundColor: '#ef4444', padding: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    btnDeleteText: { color: 'white', fontWeight: 'bold', marginLeft: 5 },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 16, color: '#94a3b8', marginTop: 16, marginBottom: 24 },
    emptyButton: { backgroundColor: '#1d04d9ff', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    emptyButtonText: { color: 'white', fontWeight: '600' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1d04d9ff', flex: 1 },
    modalBody: { padding: 20 },
    modalFooter: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: '#eee', gap: 10 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 12 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 15 },
    textArea: { height: 80, textAlignVertical: 'top' },
    datePickerButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, gap: 10 },
    datePickerText: { fontSize: 15, color: '#333' },
    statusSelector: { flexDirection: 'row', gap: 10 },
    statusOption: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
    statusOptionActive: { backgroundColor: '#2ecc71', borderColor: '#2ecc71' },
    statusOptionInactive: { backgroundColor: '#e74c3c', borderColor: '#e74c3c' },
    statusOptionText: { fontWeight: '600', color: '#666' },
    statusOptionTextActive: { color: 'white' },
    statusOptionTextInactive: { color: 'white' },
    btnCancel: { flex: 1, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
    btnCancelText: { fontSize: 16, fontWeight: '600', color: '#666' },
    btnSave: { flex: 1, padding: 15, borderRadius: 10, backgroundColor: '#1d04d9ff', alignItems: 'center' },
    btnSaveText: { fontSize: 16, fontWeight: '600', color: 'white' }
});

export default EmployeeScreen;