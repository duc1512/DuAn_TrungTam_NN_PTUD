import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Lấy chiều rộng màn hình để tính toán kích thước module
const screenWidth = Dimensions.get('window').width;

// --- INTERFACES (ĐỊNH NGHĨA KIỂU DỮ LIỆU BỊ THIẾU) ---
interface OngoingClass {
    id: string;
    name: string;
    teacher: string;
    progress: number;
    color: string;
}

interface ClassProgressCardProps {
    item: OngoingClass;
    onPress: (id: string) => void;
}
// -----------------------------------------------------

// --- DỮ LIỆU GIẢ ĐỊNH ---
const STUDENT_NAME = "Trần Duy Hà";
const ACCENT_COLOR = '#007bff'; 

const STUDENT_STATS = [
    { label: "Tổng Điểm TBC", value: 7.8, color: ACCENT_COLOR, icon: 'medal-outline' },
    { label: "Bài tập Hoàn thành", value: '85%', color: '#28a745', icon: 'check-circle-outline' },
    { label: "Bài tập Quá hạn", value: 2, color: '#dc3545', icon: 'alert-octagon-outline' },
];

const ONGOING_CLASSES: OngoingClass[] = [
    { id: 'C001', name: 'IELTS Writing 7.0', teacher: 'Cô Tú Sương', progress: 85, color: '#007bff' },
    { id: 'C002', name: 'Ngữ Pháp Chuyên sâu', teacher: 'Thầy Lê Tùng', progress: 50, color: '#28a745' },
];

const STUDENT_MODULES = [
    { name: "Lịch Học & Điểm", icon: "calendar-month-outline", route: "schedule", color: "#28a745" }, 
    { name: "Bài tập & Thi", icon: "pencil-ruler", route: "assignments", color: "#ff7043" },
    { name: "Tra cứu Điểm", icon: "google-spreadsheet", route: "grades", color: "#dc3545" },
    { name: "Thông tin Cá nhân", icon: "account-edit", route: "profile", color: "#6f42c1" }, 
    { name: "Kho tài liệu", icon: "folder-open-outline", route: "resources", color: "#007bff" },
    { name: "Chứng chỉ Đạt được", icon: "certificate", route: "certificates", color: "#17a2b8" },
];


// --- COMPONENT PHỤ: Thẻ Lớp đang học (ĐÃ FIX LỖI TS) ---
const ClassProgressCard: React.FC<ClassProgressCardProps> = ({ item, onPress }) => (
    <TouchableOpacity style={styles.classProgressCard} onPress={() => onPress(item.id)}>
        <View style={styles.classIconContainer}>
            <MaterialCommunityIcons name="book-open-outline" size={24} color={item.color} />
        </View>
        <View style={styles.classProgressInfo}>
            <Text style={styles.classProgressName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.classProgressTeacher}>GV: {item.teacher}</Text>
        </View>
        <View style={styles.progressBarWrapper}>
            <Text style={styles.progressPercent}>{item.progress}%</Text>
            {/* Thanh tiến trình giả lập */}
            <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${item.progress}%`, backgroundColor: item.color }]} />
            </View>
        </View>
    </TouchableOpacity>
);
// ---------------------------------------------


export default function HocVienDashboardScreen() {
    const router = useRouter();
    const mainColor = '#fdd835'; // Màu Vàng của Học viên
    const mainColorDark = '#333'; // Màu đậm cho chữ
    const studentName = "Trần Duy Hà"; // Tên học viên
    const greetingText = "Xin chào, Học viên"; // Lời chào
    
    // 🔥 SỬ DỤNG HÀM ĐIỀU HƯỚNG ĐÃ SỬA
    const handleNavigate = (route: string) => {
        router.push(`/hocvien/${route}`);
    };
    
    // HÀM XỬ LÝ ĐĂNG XUẤT
    const handleLogout = () => {
        alert("Đã đăng xuất tài khoản!");
        router.replace('/hocvien_login'); 
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen options={{ title: 'Học viên Dashboard' }} /> 

            {/* HEADER CHÀO MỪNG */}
            <View style={styles.header}>
                <Text style={styles.greeting}>{greetingText}</Text>
                <Text style={styles.studentName}>{studentName}!</Text>
                <Text style={styles.subtitle}>Bảng tổng hợp học tập của bạn.</Text>
            </View>

            {/* PHẦN 1: METRICS VÀ BÁO CÁO (Tra cứu Điểm/Lịch học) */}
            <Text style={styles.sectionTitle}>Thông tin Trực quan</Text>
            <View style={styles.metricsContainer}>
                {/* Metric 1: Điểm tổng kết */}
                <View style={styles.metricCard}>
                    <Text style={[styles.metricValue, { color: mainColorDark }]}>8.5/10</Text>
                    <Text style={styles.metricLabel}>Điểm TBC hiện tại</Text>
                </View>
                {/* Metric 2: Lớp sắp tới */}
                <View style={[styles.metricCard, { backgroundColor: '#ffffcc' }]}>
                    <Text style={[styles.metricValue, { color: mainColorDark }]}>Listening B2</Text>
                    <Text style={styles.metricLabel}>Lớp học hôm nay (18:00)</Text>
                </View>
            </View>

            {/* PHẦN 2: ACTION MODULES (CÁC CHỨC NĂNG CHÍNH) */}
            <Text style={styles.sectionTitle}>Các chức năng Học tập</Text>
            <View style={styles.modulesGrid}>
                {STUDENT_MODULES.map((module) => (
                    <TouchableOpacity 
                        key={module.name} 
                        style={[styles.moduleCard, { backgroundColor: module.color }]}
                        onPress={() => handleNavigate(module.route)}
                    >
                        <MaterialCommunityIcons 
                            name={module.icon as any} 
                            size={35} 
                            color={module.textColor || "white"} 
                        />
                        <Text style={[styles.moduleText, { color: module.textColor || "white" }]}>
                            {module.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            {/* NÚT ĐĂNG XUẤT */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <MaterialCommunityIcons name="logout" size={24} color="#fff" />
                <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    greeting: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666', 
    },
    studentName: {
        fontSize: 28,
        fontWeight: '900',
        color: ACCENT_COLOR,
        marginTop: 2,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    // STYLES CHO METRICS
    metricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    metricCard: {
        width: '48%',
        backgroundColor: '#fffbe6', // Nền metric vàng nhạt hơn
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fdd835',
        marginBottom: 5,
    },
    metricLabel: {
        fontSize: 14,
        color: '#666',
    },
    // STYLES CHO MODULES
    modulesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    },
    moduleCard: {
        width: screenWidth / 2 - 25, 
        height: 120,
        borderRadius: 15,
        marginBottom: 15,
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        padding: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    moduleText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 5,
        color: 'white',
    },
    // STYLES CHO NÚT ĐĂNG XUẤT
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#dc3545', 
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        elevation: 5,
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 10,
    },

    // --- STYLES PHỤ CỦA CLASS CARD ---
    classProgressCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f7f7f7' },
    classIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f3f5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    classProgressInfo: { flex: 1 },
    classProgressName: { fontSize: 16, fontWeight: '600', color: '#333' },
    classProgressTeacher: { fontSize: 12, color: '#999', marginTop: 3 },
    progressBarWrapper: { width: 100, alignItems: 'flex-end' },
    progressPercent: { fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    progressBarBackground: { width: '100%', height: 6, backgroundColor: '#eee', borderRadius: 3, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 3 },
});