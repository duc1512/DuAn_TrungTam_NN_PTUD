import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- DỮ LIỆU GIẢ ĐỊNH GỐC ---
// Dữ liệu này cần được đồng bộ với file teaching_schedule.tsx
const FULL_SCHEDULE_DATA = [
    { id: 1, date: '2025-10-24', time: '18:00', endTime: '19:30', class: 'IELTS 7.0 - T1A', teacher: 'Thầy Lê Tùng', status: 'Đang diễn ra', color: '#007bff' },
    { id: 2, date: '2025-10-24', time: '19:30', endTime: '21:00', class: 'TOEIC 600 - K2', teacher: 'Cô Trần Mai', status: 'Sắp tới', color: '#ff7043' },
    { id: 3, date: '2025-10-25', time: '09:00', endTime: '11:00', class: 'Ngữ Pháp Căn Bản', teacher: 'Cô Nguyễn Vy', status: 'Đang diễn ra', color: '#28a745' },
    { id: 4, date: '2025-10-25', time: '14:00', endTime: '16:00', class: 'Business B2', teacher: 'Thầy Khang', status: 'Đã hoàn thành', color: '#6c757d' },
];

// Hàm tìm kiếm sự kiện theo ID
const findScheduleById = (id: number) => {
    return FULL_SCHEDULE_DATA.find(event => event.id === id);
};

// Hàm điều hướng đến chi tiết giảng viên
const handleViewTeacherDetails = (teacherName: string, router: any) => {
    router.push(`/admin/user_details?name=${teacherName}`);
};

// --- COMPONENT CHÍNH ---
export default function AdminScheduleDetailsScreen() {
    const router = useRouter();
    // 1. LẤY ID TỪ URL
    const { id } = useLocalSearchParams();
    const eventId = parseInt(id as string);

    // 2. TÌM KIẾM DỮ LIỆU CHI TIẾT
    const eventDetail = useMemo(() => {
        if (!eventId) return undefined;
        return findScheduleById(eventId);
    }, [eventId]);

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


    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen 
                options={{ 
                    title: `Lịch: ${className}`,
                    headerRight: () => (
                        <TouchableOpacity onPress={() => alert('Mở Form Chỉnh sửa')} style={{ marginRight: 10 }}>
                            <Ionicons name="create-outline" size={24} color="#007bff" />
                        </TouchableOpacity>
                    )
                }} 
            />

            {/* PHẦN 1: HEADER & TRẠNG THÁI */}
            <View style={[styles.mainHeader, {backgroundColor: color + '15'}]}>
                <Text style={[styles.statusTag, {backgroundColor: color, color: 'white'}]}>
                    {status.toUpperCase()}
                </Text>
                <Text style={styles.headerTitle}>{className}</Text>
                <Text style={styles.headerDate}>
                    Ngày: {new Date(date).toLocaleDateString('vi-VN', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
                </Text>
            </View>
            
            {/* PHẦN 2: THÔNG TIN CHI TIẾT */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Thông tin Sự kiện</Text>
                
                {/* Lịch học */}
                <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={24} color="#007bff" />
                    <Text style={styles.detailLabel}>Thời gian:</Text>
                    <Text style={styles.detailValue}>{startTime}</Text>
                </View>
                
                {/* Lớp học */}
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="google-classroom" size={24} color="#28a745" />
                    <Text style={styles.detailLabel}>Lớp:</Text>
                    <Text style={styles.detailValue}>{className}</Text>
                </View>

                {/* Giảng viên Phụ trách */}
                <TouchableOpacity 
                    style={styles.detailRow} 
                    onPress={() => handleViewTeacherDetails(teacher, router)}
                >
                    <Ionicons name="person-circle-outline" size={24} color="#6f42c1" />
                    <Text style={styles.detailLabel}>Giảng viên:</Text>
                    <Text style={styles.teacherLink}>{teacher}</Text>
                </TouchableOpacity>

                {/* Trạng thái */}
                 <View style={styles.detailRow}>
                    <Ionicons name="checkmark-circle-outline" size={24} color={color} />
                    <Text style={styles.detailLabel}>Trạng thái:</Text>
                    <Text style={styles.detailValue}>{status}</Text>
                </View>
            </View>

            {/* PHẦN 3: NÚT TÁC VỤ */}
            

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
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    statusTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        overflow: 'hidden',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#333',
        marginBottom: 5,
    },
    headerDate: {
        fontSize: 14,
        color: '#666',
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
    detailLabel: { fontSize: 15, color: '#666', fontWeight: '500', marginLeft: 10, width: 100 },
    detailValue: { flex: 1, fontSize: 15, fontWeight: '600', color: '#333' },
    teacherLink: { flex: 1, fontSize: 15, fontWeight: '600', color: '#6f42c1', textDecorationLine: 'underline' },

    // Action Buttons
    actionButtons: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, marginHorizontal: 5, marginBottom: 30, marginTop: 10 },
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
    actionButtonText: { 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 14,
        marginLeft: 8
    }
});