import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Giả định import này đã đúng


// Dữ liệu module cho Giáo viên (Đã thêm Quản lý Tài khoản)
const teacherModules = [
    // 🔥 SỬA ROUTE: Chỉ cần tên file vì router.push sẽ thêm /giangvien/
    { name: "Lịch Giảng Dạy", icon: "calendar-month", route: "full_schedule", color: "#ff7043" },
    { name: "Nhập/Sửa Điểm", icon: "pencil-box-multiple", route: "grading", color: "#dc3545" },
    { name: "Theo dõi Tiến độ", icon: "tracking", route: "tracking", color: "#ffc107", textColor: "#333" },
    { name: "Điểm Danh Lớp", icon: "account-check", route: "attendance", color: "#28a745" },
    { name: "Kho Giáo Trình", icon: "folder-open", route: "materials", color: "#007bff" },
    { name: "Giờ Công & Lương", icon: "clock-check", route: "payroll", color: "#6f42c1" },
    { name: "Quản lý Tài khoản", icon: "account-edit", route: "profile", color: "#17a2b8" }, 
];

export default function GiangVienDashboardScreen() {
    const router = useRouter();
    const mainColor = '#ff7043'; // Màu Cam Đỏ của Giảng viên

    // 🔥 HÀM ĐÃ SỬA: Dùng đường dẫn tương đối từ thư mục gốc của nhóm Giảng viên
    const handleNavigate = (route: string) => {
        // Giả định Dashboard này nằm trong /app/giangvien/index.tsx
        router.push(`/giangvien/${route}`); 
    };

    // HÀM XỬ LÝ ĐĂNG XUẤT ĐÃ ĐƯỢC CẬP NHẬT
    const handleLogout = () => {
        alert("Đã đăng xuất tài khoản!");
        router.replace('/giangvien_login'); 
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen options={{ title: 'Giảng viên Dashboard' }} /> 

            {/* HEADER CHÀO MỪNG */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Chào mừng, Cô Nguyễn Vũ Tú Sương!</Text>
                <Text style={styles.subtitle}>Sẵn sàng cho buổi học hôm nay?</Text>
            </View>

            {/* PHẦN 1: METRICS VÀ BÁO CÁO (Giờ Công & Lớp Sắp Tới) */}
            <Text style={styles.sectionTitle}>Thông tin Giờ công</Text>
            <View style={styles.metricsContainer}>
                {/* Metric 1: Giờ công đã tích lũy */}
                <View style={styles.metricCard}>
                    <Text style={styles.metricValue}>125 giờ</Text>
                    <Text style={styles.metricLabel}>Giờ công T.10</Text>
                </View>
                {/* Metric 2: Lớp sắp tới */}
                <View style={[styles.metricCard, { backgroundColor: '#fff0e6' }]}>
                    <Text style={[styles.metricValue, { color: mainColor }]}>Tiếng Anh C2</Text>
                    <Text style={styles.metricLabel}>Lớp sắp tới (14:30)</Text>
                </View>
            </View>

            {/* PHẦN 2: ACTION MODULES (CÁC CHỨC NĂNG CHÍNH) */}
            <Text style={styles.sectionTitle}>Các tác vụ Giảng dạy & Quản lý</Text>
            <View style={styles.modulesGrid}>
                {teacherModules.map((module) => (
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
        fontSize: 24,
        fontWeight: '900',
        color: '#ff7043', 
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
    metricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    metricCard: {
        width: '48%',
        backgroundColor: '#fff5e6',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ff7043',
        marginBottom: 5,
    },
    metricLabel: {
        fontSize: 14,
        color: '#666',
    },
    modulesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    },
    moduleCard: {
        width: '47%', 
        height: 120,
        borderRadius: 12,
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
    },
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
    }
});