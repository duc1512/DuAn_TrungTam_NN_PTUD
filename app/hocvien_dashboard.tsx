import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Dữ liệu module cho Học viên (7 chức năng + 1 Quản lý TK)
const studentModules = [
    { name: "Lịch Học & Điểm", icon: "calendar-check", route: "/student/schedule", color: "#007bff" },
    { name: "Bài tập & Thi", icon: "pencil-ruler", route: "/student/assignments", color: "#ff7043" },
    { name: "Thông tin Cá nhân", icon: "account-edit", route: "/student/profile", color: "#28a745" }, // Tương đương Quản lý Tài khoản
    { name: "Khóa học Đăng ký", icon: "book-plus", route: "/student/register", color: "#6f42c1" },
    { name: "Tra cứu Điểm", icon: "google-spreadsheet", route: "/student/grades", color: "#dc3545" },
    { name: "Chứng chỉ Đạt được", icon: "certificate", route: "/student/certificates", color: "#17a2b8" },
    { name: "Đánh giá Khóa học", icon: "star-circle", route: "/student/feedback", color: "#f06292" },
];

export default function HocVienDashboardScreen() {
    const router = useRouter();
    const mainColor = '#fdd835'; // Màu Vàng của Học viên
    const mainColorDark = '#fdd835'; // Màu đậm cho chữ

    const handleNavigate = (route: string) => {
        router.push(route);
    };
    
    // HÀM XỬ LÝ ĐĂNG XUẤT
    const handleLogout = () => {
        alert("Đã đăng xuất tài khoản!");
        // Chuyển hướng về trang đăng nhập Học viên
        router.replace('/hocvien_login'); 
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen options={{ title: 'Học viên Dashboard' }} /> 

            {/* HEADER CHÀO MỪNG */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Chào mừng, Học viên A!</Text>
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
                {studentModules.map((module) => (
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
        color: '#fdd835', 
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
    }
});