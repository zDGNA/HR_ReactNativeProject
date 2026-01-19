import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from "../services/api";

type DivisionItem = {
    id: string;
    name: string;
    description: string;
    employee_count: number;
    icon: string;
    color: string;
};

type RootStackParamList = {
    Division: { selectedDept?: DivisionItem } | undefined;
    Employee: {
        divisionId: string;
        divisionName: string;
        divisionIcon: string;
        divisionColor: string;
        employeeCount: number;
    };
};

type DivisionScreenProps = NativeStackScreenProps<RootStackParamList, 'Division'>;

const DivisionScreen: React.FC<DivisionScreenProps> = ({ navigation, route }) => {
    const [divisions, setDivisions] = useState<DivisionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const selectedDept = route.params?.selectedDept;

    useEffect(() => {
        fetchDivisions();
    }, []);

    const fetchDivisions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/divisions');
            if (response.data && response.data.success) {
                setDivisions(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching divisions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDivisionSelect = (dept: DivisionItem) => {
        navigation.navigate('Employee', {
            divisionId: dept.id,
            divisionName: dept.name,
            divisionIcon: dept.icon,
            divisionColor: dept.color,
            employeeCount: dept.employee_count
        });
    };

    const getIconComponent = (iconName: string) => {
        return <Ionicons name={iconName as any} size={24} color="#ffffffff" />;
    };

    const renderDivisionDetail = (dept: DivisionItem) => (
        <View style={styles.detailContainer}>
            <View style={[styles.detailHeader, { backgroundColor: dept.color }]}>
                <View style={styles.detailIconContainer}>
                    {getIconComponent(dept.icon)}
                </View>
                <Text style={styles.detailTitle}>{dept.name}</Text>
                <Text style={styles.detailDesc}>{dept.description}</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{dept.employee_count}</Text>
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

    const renderAllDivision = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1d04d9ff" />
                    <Text style={styles.loadingText}>Loading divisions...</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={divisions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.divisionItem}
                        onPress={() => navigation.setParams({ selectedDept: item })}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.itemIconBox, { backgroundColor: item.color }]}>
                            {getIconComponent(item.icon)}
                        </View>
                        <View style={styles.itemContent}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemDesc}>{item.description}</Text>
                            <View style={styles.employeeCountContainer}>
                                <Ionicons name="people" size={14} color="#1d04d9ff" />
                                <Text style={styles.itemEmployees}>
                                    {item.employee_count} {item.employee_count === 1 ? 'employee' : 'employees'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.arrowContainer}>
                            <Text style={styles.itemArrow}>→</Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
                refreshing={loading}
                onRefresh={fetchDivisions}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    if (selectedDept) {
                        navigation.setParams({ selectedDept: undefined });
                    } else {
                        navigation.goBack();
                    }
                }}>
                    <Ionicons name={selectedDept ? "arrow-back" : "chevron-back"} size={27} color="#1d04d9ff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{selectedDept ? selectedDept.name : 'Divisions'}</Text>
                <TouchableOpacity onPress={fetchDivisions}>
                    <Ionicons name="refresh" size={24} color="#1d04d9ff" />
                </TouchableOpacity>
            </View>

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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748b',
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
        marginBottom: 16,
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
        marginBottom: 6,
    },
    employeeCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    itemEmployees: {
        fontSize: 13,
        color: '#1d04d9ff',
        fontWeight: '600',
    },
    arrowContainer: {
        paddingLeft: 8,
    },
    itemArrow: {
        fontSize: 20,
        color: '#1d04d9ff',
    },
});

export default DivisionScreen;