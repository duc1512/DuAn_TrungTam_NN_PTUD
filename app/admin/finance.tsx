import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// DỮ LIỆU MẪU ĐÃ BỔ SUNG 10 MỤC
const MOCK_DATA = {
    FINANCE: [
        // Công nợ Quá hạn
        { id: 'F001', name: 'Nguyễn Văn A', type: 'Công nợ', amount: 3500000, status: 'Quá hạn', color: '#dc3545', date: '01/10/2025' },
        // Học phí Sắp đến hạn
        { id: 'F002', name: 'Trần Thị B', type: 'Học phí', amount: 1500000, status: 'Sắp đến hạn', color: '#ffc107', date: '28/10/2025' },
        // ... (10 mục khác)
        { id: 'F004', name: 'Phạm Văn C', type: 'Công nợ', amount: 1200000, status: 'Quá hạn', color: '#dc3545', date: '05/10/2025' },
        { id: 'F005', name: 'Lê Thị D', type: 'Học phí', amount: 4800000, status: 'Đã thanh toán', color: '#28a745', date: '10/10/2025' },
        { id: 'F006', name: 'Võ Minh E', type: 'Công nợ', amount: 900000, status: 'Sắp đến hạn', color: '#ffc107', date: '01/11/2025' },
        { id: 'F007', name: 'Hoàng Thị F', type: 'Học phí', amount: 2500000, status: 'Đã thanh toán', color: '#28a745', date: '15/09/2025' },
        { id: 'F008', name: 'Đặng Văn G', type: 'Công nợ', amount: 5000000, status: 'Quá hạn', color: '#dc3545', date: '20/09/2025' },
        { id: 'F009', name: 'Mai Thị H', type: 'Học phí', amount: 3000000, status: 'Sắp đến hạn', color: '#ffc107', date: '05/11/2025' },
        { id: 'F010', name: 'Bùi Đức I', type: 'Công nợ', amount: 800000, status: 'Quá hạn', color: '#dc3545', date: '10/10/2025' },
        { id: 'F011', name: 'Trần Mỹ K', type: 'Học phí', amount: 2000000, status: 'Đã thanh toán', color: '#28a745', date: '01/10/2025' },
        { id: 'F012', name: 'Lý Văn L', type: 'Công nợ', amount: 4200000, status: 'Sắp đến hạn', color: '#ffc107', date: '15/11/2025' },
        { id: 'F013', name: 'Phan Thị M', type: 'Học phí', amount: 1800000, status: 'Quá hạn', color: '#dc3545', date: '25/09/2025' },
    ],
    GRADING: [
        { id: 'G001', name: 'Lớp IELTS T3', type: 'Nhập điểm', classId: 'L001', students: 25, status: 'Chờ nhập', color: '#007bff' },
        { id: 'G002', name: 'Lớp TOEIC Cấp Tốc', type: 'Nhập điểm', classId: 'L002', students: 18, status: 'Đã nhập', color: '#28a745' },
        { id: 'G003', name: 'Lớp Giao Tiếp A1', type: 'Nhập điểm', classId: 'L003', students: 30, status: 'Chờ nhập', color: '#007bff' },
    ],
};

const TAB_OPTIONS = {
    FINANCE: 'Tài chính (Học phí)',
    GRADING: 'Kết quả học tập (Điểm)',
};

export default function AdminFinanceScreen() {
    const router = useRouter(); 
    const [activeTab, setActiveTab] = useState('GRADING'); // Mặc định hiển thị GRADING
    const [searchTerm, setSearchTerm] = useState('');
    
    // Logic Tính toán Metrics
    const metrics = useMemo(() => {
        // Chỉ tính Công nợ Quá hạn
        const totalDebt = MOCK_DATA.FINANCE.filter(i => i.status === 'Quá hạn').length;
        const pendingGrades = MOCK_DATA.GRADING.filter(i => i.status === 'Chờ nhập').length;
        return { totalDebt, pendingGrades };
    }, []);

    // Logic Lọc Dữ liệu cho Tab hiện tại
    const filteredItems = useMemo(() => {
        const data = activeTab === 'FINANCE' ? MOCK_DATA.FINANCE : MOCK_DATA.GRADING;
        const term = searchTerm.toLowerCase();
        return data.filter(item => item.name.toLowerCase().includes(term) || item.id.includes(term));
    }, [searchTerm, activeTab]);

    // Hàm chuyển hướng chi tiết (Dùng chung cho cả 2 Tab)
    const handleViewItemDetails = (item: any) => { // Dùng any để đơn giản hóa kiểu dữ liệu cho item
        if (activeTab === 'GRADING') {
            // Chuyển hướng đến trang quản lý điểm danh của lớp học đó
            router.push({
                pathname: '/admin/grading_details',
                params: { classId: item.classId, className: item.name }
            });
        } else {
            // CHUYỂN HƯỚNG ĐẾN TRANG CHI TIẾT TÀI CHÍNH MỚI
            router.push({ pathname: '/admin/finance_details', params: { financeId: item.id } });
        }
    };

    // Hàm thêm mục mới (sẽ khác nhau tùy theo Tab)
    const handleAddItem = () => {
        if (activeTab === 'FINANCE') {
            alert('Mở form Thêm giao dịch tài chính/học phí.');
        } else {
            alert('Chuyển đến trang Quản lý Lớp học để thêm lớp mới.');
        }
    }

    // Hàm render từng mục trong danh sách
    const renderItem = ({ item }: { item: any }) => ( // Dùng any để đơn giản hóa kiểu dữ liệu
        <TouchableOpacity 
            style={[styles.listItem, styles.cardShadow]} 
            onPress={() => handleViewItemDetails(item)}
        >
            <View style={[styles.statusLine, { backgroundColor: item.color }]} />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetail}>
                    {item.type === 'Nhập điểm' ? 
                        `Số HV: ${item.students} | Trạng thái: ${item.status}` : 
                        `Số tiền: ${item.amount.toLocaleString('vi-VN')} VNĐ | Hạn: ${item.date || 'N/A'}`
                    }
                </Text>
            </View>
            <View style={styles.itemActions}>
                <Text style={[styles.statusTag, { backgroundColor: item.color, color: item.color === '#ffc107' ? '#333' : 'white' }]}>
                    {item.status}
                </Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#ccc" style={{marginLeft: 10}} />
            </View>
        </TouchableOpacity>
    );
    
    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Quản lý Tài chính & Điểm' }} />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Quản lý Tài chính & Điểm</Text>
            </View>
            
            {/* METRICS CARD (Hiện thị tổng quan) */}
            <View style={styles.metricsContainer}>
                <View style={[styles.metricCard, { backgroundColor: '#ffebe6' }]}>
                    <MaterialCommunityIcons name="alert-decagram-outline" size={30} color="#dc3545" />
                    <Text style={styles.metricValue}>{metrics.totalDebt}</Text> 
                    <Text style={styles.metricLabel}>Công nợ Quá hạn</Text>
                </View>
                
                <View style={[styles.metricCard, { backgroundColor: '#e6f0ff' }]}>
                    <MaterialCommunityIcons name="book-edit-outline" size={30} color="#007bff" />
                    <Text style={styles.metricValue}>{metrics.pendingGrades}</Text>
                    <Text style={styles.metricLabel}>Lớp Chờ nhập điểm</Text>
                </View>
            </View>

            {/* TAB SELECTOR */}
            <View style={styles.tabSelectorContainer}>
                {Object.keys(TAB_OPTIONS).map((key) => (
                    <TouchableOpacity
                        key={key}
                        style={[styles.tabButton, activeTab === key && styles.tabButtonActive]}
                        onPress={() => setActiveTab(key as 'FINANCE' | 'GRADING')}
                    >
                        <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>
                            {TAB_OPTIONS[key]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>


            {/* CONTROL BAR CHUNG */}
            <View style={styles.controls}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder={`Tìm kiếm theo Tên ${activeTab === 'FINANCE' ? 'HV/Công nợ' : 'Lớp học'}...`}
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                />
                
            </View>


            {/* DANH SÁCH */}
            <Text style={styles.listHeader}>
                {activeTab === 'FINANCE' ? 'Danh sách Giao dịch & Công nợ' : 'Danh sách Lớp cần Điểm'} ({filteredItems.length})
            </Text>
            
            <FlatList
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>Không tìm thấy mục nào.</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f5f5f5' },
    cardShadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, },
    
    header: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },

    // METRICS STYLES
    metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 10, marginBottom: 10 },
    metricCard: { 
        width: '48%', 
        borderRadius: 10, 
        padding: 15, 
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#eee',
    },
    metricValue: { fontSize: 22, fontWeight: 'bold', color: '#007bff', marginTop: 5 },
    metricLabel: { fontSize: 13, color: '#666', marginTop: 3 },

    // TAB SELECTOR STYLES
    tabSelectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    tabButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    tabButtonActive: {
        backgroundColor: '#007bff',
    },
    tabText: {
        fontWeight: '600',
        color: '#666',
        fontSize: 15,
    },
    tabTextActive: {
        color: 'white',
    },

    // Controls and Search
    controls: { flexDirection: 'row', padding: 15, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    searchInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, marginRight: 10, backgroundColor: '#fff' },
    addButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
    addButtonText: { color: 'white', marginLeft: 5, fontWeight: 'bold' },


    // List Styles
    listHeader: { fontSize: 14, fontWeight: 'bold', color: '#555', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff' },
    listContent: { paddingHorizontal: 15, paddingBottom: 20, paddingTop: 10 },

    listItem: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        borderRadius: 10, 
        marginBottom: 10,
        padding: 15,
        paddingLeft: 25, 
        position: 'relative',
    },
    statusLine: { width: 5, height: '100%', borderRadius: 3, position: 'absolute', left: 0, top: 0 },
    itemInfo: { flex: 1, marginRight: 10 },
    itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
    itemDetail: { fontSize: 13, color: '#999', marginTop: 3 },
    itemActions: { flexDirection: 'row', alignItems: 'center' },
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