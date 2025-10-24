import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// --- DỮ LIỆU GIẢ ĐỊNH ---
interface Certificate {
    id: string;
    studentName: string;
    courseName: string;
    issueDate: string; // YYYY-MM-DD
    status: 'Ready' | 'Issued' | 'Pending'; // Sẵn sàng, Đã cấp, Chờ
    grade: number; // Điểm cuối khóa
}

// Dữ liệu mẫu (Giả định)
const CERTIFICATE_DATA: Certificate[] = [
    { id: 'C001', studentName: 'Nguyễn Văn A', courseName: 'IELTS Mastery 7.0', issueDate: '2025-05-15', status: 'Issued', grade: 8.5 },
    { id: 'C002', studentName: 'Trần Thị B', courseName: 'TOEIC Cấp tốc 600+', issueDate: '2025-06-01', status: 'Ready', grade: 7.0 },
    { id: 'C003', studentName: 'Lê Văn C', courseName: 'Giao Tiếp Cơ Bản (A1)', issueDate: 'N/A', status: 'Pending', grade: 6.2 },
    { id: 'C004', studentName: 'Phạm Thị D', courseName: 'Business English B2', issueDate: '2025-08-20', status: 'Issued', grade: 9.1 },
    { id: 'C005', studentName: 'Võ Minh E', courseName: 'IELTS Mastery 7.0', issueDate: 'N/A', status: 'Ready', grade: 8.8 },
];

const STATUS_FILTERS = ['Tất cả', 'Ready', 'Issued', 'Pending'];

const STATUS_COLORS_MAP = {
    'Ready': { background: '#28a745', text: 'white', label: 'Sẵn sàng' },
    'Issued': { background: '#007bff', text: 'white', label: 'Đã cấp' },
    'Pending': { background: '#ffc107', text: '#333', label: 'Chờ điểm' },
};

export default function AdminCertificatesScreen() {
    const router = useRouter(); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Tất cả');
    
    // --- HÀM ĐIỀU HƯỚNG ---
    const handleViewCertificate = (certificateId: string) => {
        router.push(`/admin/certificate_details?id=${certificateId}`);
    };

    const handleAction = (type: 'issue' | 'send_email') => {
        alert(`Thực hiện hành động: ${type}`);
    };

    // --- LOGIC LỌC DỮ LIỆU ---
    const filteredCertificates = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return CERTIFICATE_DATA.filter(cert => {
            const matchesSearch = cert.studentName.toLowerCase().includes(term) || 
                                  cert.courseName.toLowerCase().includes(term);
            const matchesStatus = filterStatus === 'Tất cả' || cert.status === filterStatus; 
            
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, filterStatus]);

    // --- HÀM RENDER ITEM ---
    const renderCertificateItem = ({ item }: { item: Certificate }) => {
        const statusInfo = STATUS_COLORS_MAP[item.status];
        
        return (
            <TouchableOpacity 
                style={styles.certItem} 
                onPress={() => handleViewCertificate(item.id)}
            >
                <View style={[styles.statusLine, { backgroundColor: statusInfo.background }]} /> 
                <View style={styles.certInfo}>
                    <Text style={styles.certStudentName}>{item.studentName}</Text>
                    <Text style={styles.certCourseName}>{item.courseName}</Text>
                </View>
                <View style={styles.certStats}>
                    <Text style={styles.certGrade}>
                        {item.grade.toFixed(1)} <Text style={{fontSize: 10, color: '#666'}}>Điểm</Text>
                    </Text>
                    <Text style={[styles.statusTag, { backgroundColor: statusInfo.background, color: statusInfo.text }]}>
                        {statusInfo.label}
                    </Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#ccc" style={{marginLeft: 10}} />
                </View>
            </TouchableOpacity>
        );
    };
    
    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Quản lý Chứng Chỉ' }} />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Giám sát Cấp phát Chứng chỉ</Text>
            </View>

            {/* CONTROL BAR: Tìm kiếm và Hành động nhanh */}
            <View style={styles.controls}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Tìm theo Học viên, Khóa học..."
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                />
                
            </View>

            {/* LỌC THEO TRẠNG THÁI */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {STATUS_FILTERS.map((status) => {
                        const statusLabel = status === 'Tất cả' ? status : STATUS_COLORS_MAP[status].label;
                        return (
                            <TouchableOpacity 
                                key={status} 
                                style={[styles.filterButton, filterStatus === status && styles.filterButtonActive]}
                                onPress={() => setFilterStatus(status)}
                            >
                                <Text style={[styles.filterText, filterStatus === status && styles.filterTextActive]}>
                                    {statusLabel}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Danh sách Chứng chỉ */}
            <Text style={styles.listHeader}>
                Tổng số Chứng chỉ: {filteredCertificates.length}
            </Text>
            
            <FlatList
                data={filteredCertificates}
                renderItem={renderCertificateItem}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                initialNumToRender={10}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>Không tìm thấy chứng chỉ nào.</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },
    
    // Controls and Search
    controls: { flexDirection: 'row', padding: 15, alignItems: 'center', backgroundColor: '#fff' },
    searchInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, marginRight: 10, backgroundColor: '#fff' },
    actionButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
    actionButtonText: { color: 'white', marginLeft: 5, fontWeight: 'bold' },

    // Filters
    filterContainer: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    filterButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#eee', marginRight: 10 },
    filterButtonActive: { backgroundColor: '#007bff' },
    filterText: { color: '#333', fontWeight: '500', fontSize: 13 },
    filterTextActive: { color: 'white' },

    // List Styles
    listHeader: { fontSize: 14, fontWeight: 'bold', color: '#555', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff' },
    list: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
    listContent: { paddingBottom: 20 },

    certItem: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        position: 'relative'
    },
    statusLine: { width: 5, height: '100%', borderRadius: 5, position: 'absolute', left: 0, top: 0 },
    certInfo: { flex: 1, marginRight: 10 },
    certStudentName: { fontSize: 16, fontWeight: '600', color: '#333' },
    certCourseName: { fontSize: 12, color: '#999', marginTop: 3 },
    certStats: { flexDirection: 'row', alignItems: 'center' },
    certGrade: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#007bff', 
        marginRight: 15,
        borderRightWidth: 1,
        borderRightColor: '#eee',
        paddingRight: 15,
    },
    statusTag: { 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 15, 
        fontSize: 10, 
        fontWeight: 'bold',
        overflow: 'hidden'
    },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
});