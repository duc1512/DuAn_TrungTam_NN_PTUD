import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// --- CỐ ĐỊNH MÀU SẮC ---
const ACCENT_COLOR = '#007bff'; // Xanh dương chủ đạo
const PASS_COLOR = '#28a745'; // Xanh lá (Đã cấp/Đạt)
const WARNING_COLOR = '#ffc107'; // Vàng (Sẵn sàng in)

// --- INTERFACE VÀ DỮ LIỆU GIẢ ĐỊNH ---
interface Certificate {
    id: string;
    courseName: string;
    grade: number; // Điểm cuối khóa
    status: 'Issued' | 'Ready' | 'Expired'; // Đã cấp, Sẵn sàng, Hết hạn
    issueDate: string; // YYYY-MM-DD
    certificateID: string;
}

const CERTIFICATE_DATA: Certificate[] = [
    { id: 'C001', courseName: 'IELTS Mastery 7.0', grade: 8.5, status: 'Issued', issueDate: '2025-05-15', certificateID: 'TDD-IEL-987' },
    { id: 'C002', courseName: 'TOEIC Cấp tốc 600+', grade: 7.0, status: 'Ready', issueDate: '2025-06-01', certificateID: 'N/A' },
    { id: 'C003', courseName: 'Giao Tiếp Cơ Bản (A1)', grade: 6.2, status: 'Expired', issueDate: '2023-01-01', certificateID: 'TDD-A1-100' },
    { id: 'C004', courseName: 'Business English B2', grade: 9.1, status: 'Issued', issueDate: '2025-08-20', certificateID: 'TDD-B2-045' },
    { id: 'C005', courseName: 'Ngữ Pháp Nâng Cao', grade: 7.8, status: 'Ready', issueDate: '2025-09-01', certificateID: 'N/A' },
];

const STATUS_FILTERS = ['Tất cả', 'Issued', 'Ready', 'Expired'];

const getStatusInfo = (status: Certificate['status']) => {
    switch (status) {
        case 'Issued': return { label: 'Đã cấp', background: ACCENT_COLOR, icon: 'check-circle-outline' };
        case 'Ready': return { label: 'Sẵn sàng in', background: WARNING_COLOR, icon: 'printer-outline' };
        case 'Expired': return { label: 'Hết hạn', background: '#6c757d', icon: 'clock-remove-outline' };
        default: return { label: 'Không rõ', background: '#ccc', icon: 'help-circle-outline' };
    }
};


// --- COMPONENT PHỤ: THẺ CHỨNG CHỈ ---
const CertificateCard: React.FC<{ item: Certificate, onPress: (id: string) => void }> = ({ item, onPress }) => {
    const statusInfo = getStatusInfo(item.status);
    const gradeColor = item.grade >= 7.5 ? PASS_COLOR : (item.status === 'Expired' ? '#999' : WARNING_COLOR);

    return (
        <TouchableOpacity 
            style={[styles.certItem, { borderLeftColor: statusInfo.background }]} 
            onPress={() => onPress(item.id)}
        >
            <View style={styles.gradeCircle}>
                <Text style={styles.gradeText}>{item.grade.toFixed(1)}</Text>
            </View>
            
            <View style={styles.certInfo}>
                <Text style={styles.certCourseName} numberOfLines={1}>{item.courseName}</Text>
                <Text style={styles.certDate}>Ngày cấp: {item.issueDate === 'N/A' ? 'Chờ' : item.issueDate}</Text>
            </View>

            <View style={styles.certStatus}>
                <Text style={[styles.statusTag, { backgroundColor: statusInfo.background, color: statusInfo.background === WARNING_COLOR ? '#333' : 'white' }]}>
                    {statusInfo.label}
                </Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#ccc" style={{marginLeft: 10}} />
            </View>
        </TouchableOpacity>
    );
};


// --- COMPONENT CHÍNH ---
export default function HocVienCertificatesScreen() {
    const router = useRouter(); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Tất cả');
    
    // --- LOGIC LỌC DỮ LIỆU ---
    const filteredCertificates = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return CERTIFICATE_DATA.filter(cert => {
            const matchesSearch = cert.courseName.toLowerCase().includes(term);
            const matchesStatus = filterStatus === 'Tất cả' || cert.status === filterStatus; 
            
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, filterStatus]);

    const handleViewDetails = (certificateId: string) => {
        router.push(`/hocvien/certificate_details?id=${certificateId}`);
    };


    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Chứng chỉ Đạt được' }} />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hồ sơ Chứng chỉ Cá nhân</Text>
            </View>

            {/* CONTROL BAR: Tìm kiếm */}
            <View style={styles.controls}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Tìm theo tên khóa học..."
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                />
            </View>

            {/* LỌC THEO TRẠNG THÁI */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {STATUS_FILTERS.map((status) => {
                        const info = getStatusInfo(status as Certificate['status']);
                        const label = status === 'Tất cả' ? status : info.label;
                        return (
                            <TouchableOpacity 
                                key={status} 
                                style={[styles.filterButton, filterStatus === status && styles.filterButtonActive]}
                                onPress={() => setFilterStatus(status)}
                            >
                                <Text style={[styles.filterText, filterStatus === status && styles.filterTextActive]}>
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Danh sách Chứng chỉ */}
            <FlatList
                data={filteredCertificates}
                renderItem={({ item }) => <CertificateCard item={item} onPress={handleViewDetails} />}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={() => (
                    <Text style={styles.listHeader}>
                        Tổng số chứng chỉ: {filteredCertificates.length}
                    </Text>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                         <MaterialCommunityIcons name="certificate-outline" size={40} color="#ccc" />
                         <Text style={styles.emptyText}>Bạn chưa đạt được chứng chỉ nào.</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    header: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: ACCENT_COLOR },

    // Controls and Search
    controls: { flexDirection: 'row', padding: 15, alignItems: 'center', backgroundColor: 'white' },
    searchInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, marginRight: 10, backgroundColor: '#f9f9f9' },

    // Filters
    filterContainer: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 10 },
    filterButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#eee', marginRight: 10, borderWidth: 1, borderColor: '#eee' },
    filterButtonActive: { backgroundColor: ACCENT_COLOR, borderColor: ACCENT_COLOR },
    filterText: { color: '#333', fontWeight: '500', fontSize: 13 },
    filterTextActive: { color: 'white' },
    listHeader: { fontSize: 14, fontWeight: 'bold', color: '#555', paddingBottom: 10, paddingHorizontal: 5 },

    // List Styles
    list: { flex: 1, paddingHorizontal: 15 },
    listContent: { paddingBottom: 20 },
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#666', marginTop: 10, fontSize: 16 },

    // Certificate Card
    certItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10,
        borderLeftWidth: 5, // Viền màu trạng thái
        elevation: 2,
        shadowOpacity: 0.05,
    },
    gradeCircle: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#e6f0ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 2,
        borderColor: PASS_COLOR,
    },
    gradeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    certInfo: { flex: 1, marginRight: 10 },
    certCourseName: { fontSize: 16, fontWeight: '600', color: '#333' },
    certDate: { fontSize: 12, color: '#999', marginTop: 3 },
    
    certStatus: { flexDirection: 'row', alignItems: 'center' },
    statusTag: { 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 15, 
        fontSize: 10, 
        fontWeight: 'bold',
        overflow: 'hidden'
    },
});