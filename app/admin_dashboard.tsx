import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 1. IMPORT DỮ LIỆU GLOBAL (Phải có file accounts.tsx)
import { CURRENT_USERS } from "./admin/accounts";

// Dữ liệu module cho Admin (8 chức năng)
const adminModules = [
    { name: "Quản lý Tài Khoản", icon: "account-cog", route: "accounts", color: "#007bff" },
    { name: "Quản lý Lớp Học", icon: "google-classroom", route: "classes", color: "#28a745" },
    { name: "Quản lý Khóa Học", icon: "book-multiple", route: "courses", color: "#ffc107", textColor: "#333" },
    { name: "Quản lý Giảng Dạy", icon: "calendar-clock", route: "teaching", color: "#dc3545" },
    { name: "Quản lý Điểm & Phí", icon: "credit-card-check", route: "finance", color: "#6f42c1" },
    { name: "Quản lý Chứng Chỉ", icon: "certificate", route: "certificates", color: "#17a2b8" },
    { name: "Tài nguyên Học tập", icon: "folder-open", route: "resources", color: "#f06292" },
    { name: "Xem Báo Cáo", icon: "chart-bar", route: "reports", color: "#ff8a65" },
];

// DỮ LIỆU CÔNG NỢ CỐ ĐỊNH
const FIXED_CONG_NO = "45M đ";

export default function AdminDashboardScreen() {
    const router = useRouter();
    const mainColor = '#007bff'; 

    // 🔥 STATE ĐỂ CHỨA VÀ THEO DÕI TỔNG SỐ USER
    const [totalUsers, setTotalUsers] = useState(CURRENT_USERS.length);

    // 🔥 DÙNG useFocusEffect ĐỂ CẬP NHẬT SỐ LIỆU MỖI KHI MÀN HÌNH ĐƯỢC MỞ
    useFocusEffect(
        useCallback(() => {
            // Tính toán lại tổng số user từ mảng global
            setTotalUsers(CURRENT_USERS.length);
        }, [])
    );
    
    // SỬ DỤNG HÀM LỌC ĐỂ TÍNH TOÁN TỔNG SỐ THEO VAI TRÒ
    const totalStudents = CURRENT_USERS.filter(u => u.role === 'Học viên').length;
    const totalTeachers = CURRENT_USERS.filter(u => u.role === 'Giảng viên').length;


    const handleNavigate = (route: string) => {
        router.push(`/admin/${route}`); 
    };
    
    const handleLogout = () => {
        alert("Đã đăng xuất tài khoản!");
        router.replace('/admin_login'); 
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen 
                options={{ 
                    title: 'Admin Dashboard',
                    headerRight: () => (
                        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
                            <MaterialCommunityIcons name="logout" size={24} color="#dc3545" />
                        </TouchableOpacity>
                    )
                }} 
            /> 

            {/* HEADER CHÀO MỪNG */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Bảng Điều Khiển Hệ thống</Text>
                <Text style={styles.subtitle}>Quản lý Trung tâm Ngoại ngữ TDD</Text>
            </View>

            {/* PHẦN 1: METRICS VÀ BÁO CÁO */}
            <Text style={styles.sectionTitle}>Chỉ số Tổng quan</Text>
            <View style={styles.metricsContainer}>
                
                {/* Metric 1: Tổng số Tài khoản (SỬ DỤNG STATE ĐÃ CẬP NHẬT) */}
                <View style={[styles.metricCard, { backgroundColor: '#e6f0ff' }]}>
                    <Text style={styles.metricValue}>{totalUsers}</Text> 
                    <Text style={styles.metricLabel}>Tổng Tài khoản (Users)</Text>
                </View>
                
                {/* Metric 2: Công nợ chưa thu */}
                <View style={[styles.metricCard, { backgroundColor: '#ffe6e6' }]}>
                    <Text style={[styles.metricValue, { color: '#dc3545' }]}>{FIXED_CONG_NO}</Text>
                    <Text style={styles.metricLabel}>Công nợ chưa thu</Text>
                </View>
            </View>

            {/* PHẦN 2: ACTION MODULES (CÁC CHỨC NĂNG QUẢN LÝ) */}
            <Text style={styles.sectionTitle}>Chức năng Quản lý Chính (8 modules)</Text>
            <View style={styles.modulesGrid}>
                {adminModules.map((module) => (
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f5f5f5', },
    header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd', },
    greeting: { fontSize: 24, fontWeight: '900', color: '#007bff', },
    subtitle: { fontSize: 16, color: '#666', marginTop: 5, },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10, paddingHorizontal: 15, },
    
    // STYLES CHO METRICS
    metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, },
    metricCard: { width: '48%', borderRadius: 10, padding: 15, alignItems: 'center', },
    metricValue: { fontSize: 24, fontWeight: 'bold', color: '#007bff', marginBottom: 5, },
    metricLabel: { fontSize: 14, color: '#666', },
    
    // STYLES CHO MODULES
    modulesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 10, },
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
    }
});