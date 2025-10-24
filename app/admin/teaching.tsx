import { MaterialCommunityIcons } from "@expo/vector-icons"; // ĐÃ CÓ CẢ HAI
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


// Giả định dữ liệu phân công/lịch dạy
const TEACHING_SCHEDULE = [
    { time: '18:00 - 19:30', class: 'IELTS 7.0 - T1A', teacher: 'Thầy Lê Tùng', status: 'Đang diễn ra', color: '#007bff' },
    { time: '19:30 - 21:00', class: 'TOEIC 600 - K2', teacher: 'Cô Trần Mai', status: 'Sắp tới', color: '#ff7043' },
    { time: '15:00 - 17:00', class: 'A1 GT Sáng', teacher: 'Cô Nguyễn Vy', status: 'Đã hoàn thành', color: '#28a745' },
    { time: '10:00 - 12:00', class: 'B2 Business', teacher: 'Thầy Khang', status: 'Nghỉ', color: '#6c757d' },
];

// LƯU Ý: Icon trong đây là MaterialCommunityIcons
const METRICS_DATA = [
    { label: "Tổng GV", value: 15, icon: "account-group-outline", color: "#007bff" },
    { label: "Lớp hôm nay", value: 4, icon: "calendar-today", color: "#28a745" },
    { label: "Chưa phân công", value: 2, icon: "alert-outline", color: "#dc3545" },
];

// DỮ LIỆU CÔNG NỢ CỐ ĐỊNH (Không dùng ở đây nhưng giữ lại)
const FIXED_CONG_NO = "45M đ"; 


// 🔥 KHẮC PHỤC LỖI CÚ PHÁP: Định nghĩa component phụ (ScheduleCard) đúng cách
const ScheduleCard = ({ item }) => (
    <View style={styles.scheduleCard}>
        <View style={[styles.timePill, { backgroundColor: item.color }]}>
            <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View style={styles.scheduleInfo}>
            <Text style={styles.scheduleClass}>{item.class}</Text>
            <Text style={styles.scheduleTeacher}>GV: {item.teacher}</Text>
        </View>
        <Text style={[styles.scheduleStatus, { color: item.color }]}>{item.status}</Text>
    </View>
);
// --- KẾT THÚC COMPONENT PHỤ ---


export default function AdminTeachingScreen() {
    const router = useRouter(); 

    const handleViewTeacherDetails = (teacherName: string) => {
        router.push(`/admin/user_details?name=${teacherName}`);
    };

    // 🔥 SỬA LỖI ĐỊNH TUYẾN: Trỏ đúng đến /admin/teaching_schedule
    const handleViewSchedule = () => {
        router.push('/admin/teaching_schedule');
    };
    
    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen options={{ title: 'Quản lý Giảng Dạy' }} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Giám sát Hoạt động Giảng dạy</Text>
                <Text style={styles.headerSubtitle}>Trạng thái phân công và lịch trình chung</Text>
            </View>

            {/* PHẦN 1: METRICS TÓM TẮT */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Chỉ số Giảng viên</Text>
                <View style={styles.metricsRow}>
                    {METRICS_DATA.map(metric => (
                        <View key={metric.label} style={styles.metricCard}>
                            {/* KHẮC PHỤC LỖI: Dùng MaterialCommunityIcons để render icon */}
                            <MaterialCommunityIcons name={metric.icon as any} size={28} color={metric.color} /> 
                            <Text style={styles.metricValue}>{metric.value}</Text>
                            <Text style={styles.metricLabel}>{metric.label}</Text>
                        </View>
                    ))}
                </View>
            </View>
            
            {/* PHẦN 2: LỊCH DẠY HÔM NAY */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lịch dạy Hôm nay</Text>
                {/* ĐÃ SỬA: Đảm bảo nút này gọi handleViewSchedule */}
                <TouchableOpacity style={styles.viewAllButton} onPress={handleViewSchedule}>
                    <Text style={styles.viewAllText}>Xem Toàn bộ Lịch </Text>
                </TouchableOpacity>

                <View style={styles.scheduleList}>
                    {TEACHING_SCHEDULE.slice(0, 3).map((item, index) => (
                        <ScheduleCard key={index} item={item} />
                    ))}
                </View>
            </View>

           
            
            <View style={{height: 50}} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    header: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 10 },
    headerTitle: { fontSize: 22, fontWeight: '900', color: '#007bff' },
    headerSubtitle: { fontSize: 14, color: '#666', marginTop: 3 },
    
    section: { padding: 15, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 15, borderRadius: 10, elevation: 2, shadowOpacity: 0.1 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5, position: 'relative' },
    
    // PHẦN 1: METRICS
    metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
    metricCard: { width: '31%', padding: 10, borderRadius: 8, alignItems: 'center', backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#eee' },
    metricValue: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 5 },
    metricLabel: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 2 },

    // PHẦN 2: LỊCH DẠY
    viewAllButton: { position: 'absolute', right: 10, top: 10 },
    viewAllText: { color: '#007bff', fontSize: 13, fontWeight: '600' },
    scheduleList: { marginTop: 5 },
    scheduleCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    timePill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginRight: 15, width: 90, alignItems: 'center' },
    timeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    scheduleInfo: { flex: 1 },
    scheduleClass: { fontSize: 15, fontWeight: '600', color: '#333' },
    scheduleTeacher: { fontSize: 12, color: '#666', marginTop: 2 },
    scheduleStatus: { fontSize: 12, fontWeight: 'bold' },

    // PHẦN 3: ACTIONS
    actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingTop: 10 },
    actionCard: { width: '30%', padding: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', marginBottom: 10, minHeight: 80 },
    actionText: { fontSize: 13, color: '#333', fontWeight: '600', textAlign: 'center', marginTop: 5 },
});