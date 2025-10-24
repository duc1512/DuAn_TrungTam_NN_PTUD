import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- DỮ LIỆU GIẢ ĐỊNH TỪ SCHEDULE DẠY HỌC ---
// 🔥 LƯU Ý: ID SẼ DÙNG LÀ CLASSID (Ví dụ: L101, L102) ĐỂ ĐỒNG BỘ
const FULL_SCHEDULE_DATA = [
    { id: 'L101', date: '2025-10-27', time: '17:30', endTime: '19:00', class: 'IELTS Writing (G3)', course: 'IELTS Writing', teacher: 'Cô Nguyễn Vũ Tú Sương', status: 'Sắp tới', color: '#ff7043' },
    { id: 'L102', date: '2025-10-27', time: '19:00', endTime: '20:30', class: 'Ngữ Pháp Nâng Cao', course: 'Ngữ Pháp Chuyên sâu', teacher: 'Thầy Lê Tùng', status: 'Sắp tới', color: '#007bff' },
    { id: 'L103', date: '2025-10-29', time: '18:00', endTime: '19:30', class: 'TOEIC Giao Tiếp (B2)', course: 'TOEIC Giao Tiếp', teacher: 'Cô Trần Mai', status: 'Đang diễn ra', color: '#28a745' },
    { id: 'L104', date: '2025-10-30', time: '19:00', endTime: '20:30', class: 'IELTS Speaking (G3)', course: 'IELTS Speaking', teacher: 'Cô Nguyễn Vũ Tú Sương', status: 'Sắp tới', color: '#007bff' },
];

// 🔥 SỬA: Hàm tìm kiếm nhận ID là chuỗi (classId)
const findScheduleById = (id: string) => {
    return FULL_SCHEDULE_DATA.find(event => event.id === id); // So sánh chuỗi với chuỗi
};

// Hàm điều hướng đến chi tiết giảng viên
const handleViewTeacherDetails = (teacherName: string, router: any) => {
    router.push(`/giangvien/user_details?name=${teacherName}`);
};

// --- COMPONENT PHỤ: HIỂN THỊ HÀNG THÔNG TIN ---
interface DetailRowProps {
    icon: keyof typeof Ionicons.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    value: string | number;
    color: string;
}
const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, color }) => (
    <View style={styles.detailRow}>
        <Ionicons name={icon as any} size={20} color={color} style={{marginRight: 15}} />
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);
// ---------------------------------------------


export default function GiangVienScheduleDetailsScreen() {
    const router = useRouter();
    // 1. LẤY ID LỚP HỌC (classId) TỪ URL
    const { id } = useLocalSearchParams();
    const classId = id as string;

    // 2. TÌM KIẾM DỮ LIỆU CHI TIẾT
    const eventDetail = useMemo(() => {
        if (!classId) return undefined;
        return findScheduleById(classId); // Gọi hàm tìm kiếm bằng classId
    }, [classId]);

    if (!eventDetail) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ title: "Không tìm thấy" }} />
                <Text style={styles.errorText}>Không tìm thấy sự kiện lịch dạy.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}><Text style={{color: '#007bff'}}>Quay lại</Text></TouchableOpacity>
            </View>
        );
    }

    const { date, time, endTime, class: className, teacher, status, color } = eventDetail;
    const startTime = `${time} - ${endTime}`;
    const formattedDate = new Date(date).toLocaleDateString('vi-VN', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
    const isFinished = status === 'Đã hoàn thành';


    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen 
                options={{ 
                    title: `Chi tiết: ${className}`,
                    headerRight: () => (
                        <TouchableOpacity onPress={() => alert('Mở Form Chỉnh sửa Lịch')} style={{ marginRight: 10 }}>
                            <Ionicons name="create-outline" size={24} color="#007bff" />
                        </TouchableOpacity>
                    )
                }} 
            />

            {/* PHẦN 1: HEADER & TRẠNG THÁI */}
            <View style={[styles.mainHeader, {borderLeftColor: color}]}>
                <Text style={[styles.statusTag, {backgroundColor: color, color: 'white'}]}>
                    {status.toUpperCase()}
                </Text>
                <Text style={styles.headerTitle}>{className}</Text>
                <Text style={styles.headerDate}>{formattedDate}</Text>
            </View>
            
            {/* PHẦN 2: THÔNG TIN CHI TIẾT */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Thông tin Sự kiện</Text>
                
                {/* Lịch học */}
                <DetailRow icon="time-outline" label="Thời gian" value={startTime} color="#007bff" />
                
                {/* Lớp học */}
                <DetailRow icon="book-outline" label="Mã lớp" value={eventDetail.classId} color="#28a745" />

                {/* Giảng viên Phụ trách */}
                <TouchableOpacity 
                    style={styles.detailRowTeacher} 
                    onPress={() => handleViewTeacherDetails(teacher, router)}
                >
                    <Ionicons name="person-circle-outline" size={20} color="#6f42c1" style={{marginRight: 15}} />
                    <Text style={styles.detailLabel}>Giảng viên:</Text>
                    <Text style={styles.teacherLink}>{teacher}</Text>
                </TouchableOpacity>

                {/* Trạng thái */}
                 <DetailRow icon="checkmark-circle-outline" label="Trạng thái" value={status} color={color} />
            </View>

            {/* PHẦN 3: NÚT TÁC VỤ GIẢNG VIÊN */}
           

        </ScrollView>
    );
}

// --- STYLES ---

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f3f5' },
    errorText: { fontSize: 16, color: '#dc3545', marginTop: 10 },
    
    // Header
    mainHeader: { 
        padding: 20, 
        paddingTop: 15,
        backgroundColor: 'white',
        borderLeftWidth: 5, 
        marginBottom: 15,
    },
    statusTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        overflow: 'hidden',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#333',
        marginBottom: 5,
    },
    headerDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },

    // Card & Detail Rows
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 15,
        marginBottom: 15,
        ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 }, android: { elevation: 3 } }),
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
    },
    detailRowTeacher: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
    },
    detailLabel: { fontSize: 15, color: '#666', fontWeight: '500', width: 100, marginLeft: 10 },
    detailValue: { flex: 1, fontSize: 15, fontWeight: '600', color: '#333' },
    teacherLink: { flex: 1, fontSize: 15, fontWeight: '600', color: '#6f42c1', textDecorationLine: 'underline' },

    // Action Buttons
    actionButtons: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
    actionButton: { 
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14, 
        borderRadius: 10, 
        marginHorizontal: 5, 
        elevation: 4, 
    },
    attendanceButton: {
        backgroundColor: '#ff7043', 
        marginRight: 10,
    },
    reportButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#007bff',
    },
    actionButtonText: { 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 14,
        marginLeft: 8
    }
});