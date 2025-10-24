import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- DỮ LIỆU LỊCH DẠY GIẢ ĐỊNH (Cần đồng bộ với các file khác) ---
// Giả định dữ liệu này mô phỏng các lớp Giảng viên đang phụ trách
const MOCK_CLASSES_TODAY = [
    { id: 'L101', name: 'IELTS Writing (G3)', teacher: 'Tú Sương', status: 'Sắp tới', time: '17:30 - 19:00', color: '#ff7043' },
    { id: 'L102', name: 'TOEIC Giao Tiếp (B2)', teacher: 'Tú Sương', status: 'Đang diễn ra', time: '19:00 - 20:30', color: '#28a745' }, // Lớp này ĐANG HỌC
    { id: 'L103', name: 'Ngữ Pháp Nâng Cao', teacher: 'Tú Sương', status: 'Đã hoàn thành', time: '14:00 - 15:30', color: '#6c757d' },
    { id: 'L104', name: 'IELTS Speaking', teacher: 'Tú Sương', status: 'Đang diễn ra', time: '20:30 - 22:00', color: '#007bff' }, // Lớp này ĐANG HỌC
    { id: 'L105', name: 'Tổng ôn Ngữ Pháp', teacher: 'Tú Sương', status: 'Sắp tới', time: '10:00 - 11:30', color: '#ff7043' },
];

const STATUS_COLORS = {
    'Đang diễn ra': '#28a745',
    'Sắp tới': '#ffc107',
    'Đã hoàn thành': '#6c757d',
};
const ACCENT_COLOR = '#ff7043'; // Màu chủ đạo Giảng viên


// --- COMPONENT PHỤ: Thẻ Lớp học ---
const ClassAttendanceCard: React.FC<{ item: any, onPress: (item: any) => void }> = ({ item, onPress }) => {
    const isOngoing = item.status === 'Đang diễn ra';
    const cardColor = STATUS_COLORS[item.status] || '#ccc';

    return (
        <TouchableOpacity
            style={[
                styles.classCard,
                { borderLeftColor: cardColor },
                !isOngoing && styles.classCardDisabled // Áp dụng style mờ nếu không hoạt động
            ]}
            onPress={() => isOngoing && onPress(item)} // Chỉ cho phép nhấn nếu Đang diễn ra
            disabled={!isOngoing}
        >
            <View style={styles.cardContent}>
                <Text style={styles.cardClassName}>{item.name}</Text>
                <Text style={styles.cardTime}>{item.time}</Text>
            </View>
            
            <View style={styles.cardStatusContainer}>
                <Text style={[styles.statusTag, { backgroundColor: cardColor, color: isOngoing ? 'white' : '#333' }]}>
                    {item.status.toUpperCase()}
                </Text>
                {isOngoing && <Ionicons name="chevron-forward-outline" size={24} color={ACCENT_COLOR} />}
            </View>
        </TouchableOpacity>
    );
};
// ------------------------------------


export default function GiangVienDiemDanhScreen() {
    const router = useRouter(); 
    
    // 🔥 LỌC DANH SÁCH CHỈ HIỂN THỊ LỚP CÓ TRẠNG THÁI 'Đang diễn ra'
    const ongoingClasses = useMemo(() => {
        // Lớp Đang diễn ra sẽ được đưa lên đầu
        return MOCK_CLASSES_TODAY.sort((a, b) => {
            if (a.status === 'Đang diễn ra' && b.status !== 'Đang diễn ra') return -1;
            if (a.status !== 'Đang diễn ra' && b.status === 'Đang diễn ra') return 1;
            return 0;
        });
    }, []);

    // Hàm điều hướng đến trang chi tiết điểm danh
    const handleNavigateToDetail = (classItem: any) => {
        // Chuyển hướng, truyền các tham số cần thiết
        router.push({
            pathname: '/giangvien/attendance_detail', 
            params: { 
                classId: classItem.id, 
                className: classItem.name,
                time: classItem.time,
                course: 'Khoá học XXX' // Cần truyền thêm thông tin khóa học nếu có
            }
        });
    };

    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Điểm danh Lớp' }} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chọn Lớp để Điểm danh</Text>
                <Text style={styles.headerSubtitle}>Chỉ có các lớp ĐANG DIỄN RA mới có thể điểm danh.</Text>
            </View>

            {/* DANH SÁCH LỚP CÓ THỂ ĐIỂM DANH */}
            <FlatList
                data={ongoingClasses}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ClassAttendanceCard item={item} onPress={handleNavigateToDetail} />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="alert-circle-outline" size={40} color="#666" />
                        <Text style={styles.emptyText}>Hiện không có lớp nào đang diễn ra.</Text>
                    </View>
                )}
            />
            
            <TouchableOpacity style={styles.viewFullScheduleButton} onPress={() => router.push('/giangvien/full_schedule')}>
                <Text style={styles.viewFullScheduleText}>Xem toàn bộ Lịch Dạy</Text>
            </TouchableOpacity>
            
        </View>
    );
}


const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    header: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 5 },
    headerTitle: { fontSize: 20, fontWeight: '900', color: ACCENT_COLOR },
    headerSubtitle: { fontSize: 14, color: '#666', marginTop: 5 },

    listContent: { paddingHorizontal: 15, paddingVertical: 10 },
    
    // Thẻ Lớp học
    classCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderLeftWidth: 5, // Viền màu trạng thái
        elevation: 2,
        shadowOpacity: 0.05,
    },
    classCardDisabled: {
        opacity: 0.5, // Làm mờ các lớp không thể điểm danh
    },
    cardContent: { flex: 1, marginRight: 10 },
    cardClassName: { fontSize: 16, fontWeight: '600', color: '#333' },
    cardTime: { fontSize: 14, color: '#666', marginTop: 3 },
    
    cardStatusContainer: { flexDirection: 'row', alignItems: 'center' },
    statusTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 15,
        fontSize: 10,
        fontWeight: 'bold',
        marginRight: 10,
        overflow: 'hidden',
    },

    // Footer/Button
    viewFullScheduleButton: {
        padding: 15,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    viewFullScheduleText: {
        color: ACCENT_COLOR,
        fontWeight: 'bold',
    },
    emptyContainer: { alignItems: 'center', paddingVertical: 40 },
    emptyText: { color: '#666', marginTop: 10, fontSize: 16 },
});