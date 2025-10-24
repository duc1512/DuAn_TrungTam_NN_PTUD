import { Stack, useRouter } from "expo-router";
import React from "react";
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"; // <-- THÊM STATUSBAR Ở ĐÂY

export default function HomeScreen() {
    const router = useRouter();

   

    const handleGiangVienLogin = () => {
        router.push('/giangvien_login'); 
    };

    const handleHocVienLogin = () => {
        router.push('/hocvien_login'); 
    };

    const handleExit = () => {
        alert("Thoát ứng dụng!");
    };

    return (
        <View style={styles.container}>
            {/* THÊM STATUSBAR ĐỂ HIỂN THỊ GIỜ/WIFI ĐÚNG KIỂU */}
            <StatusBar 
                // Đặt màu tối (dark-content) để hiển thị rõ trên nền trắng
                barStyle="dark-content" 
                backgroundColor="#ffffff"
            />
            
            {/* Tùy chỉnh tiêu đề màn hình */}
            {/* Sử dụng options={{ headerShown: false }} nếu bạn muốn ẩn Header điều hướng */}
            <Stack.Screen options={{ title: 'Chọn Vai Trò' }} /> 
            
            {/* Logo */}
            <Image
                source={require("../../assets/images/logo1.png")}
                style={styles.logo}
            />

            {/* Tiêu đề */}
            <Text style={styles.title}>Trung tâm ngoại ngữ TDD</Text>
            <Text style={styles.subtitle}>Chọn vai trò để đăng nhập</Text>

            {/* Các nút chọn vai trò */}
            <View style={styles.roleContainer}>
                
                {/* Admin */}
                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: "#007bff" }]}
                    onPress={() => router.push('/admin_login')}
                >
                    <Text style={styles.text}>Admin</Text>
                </TouchableOpacity>

                {/* STAFF */}

                {/* Giảng viên */}
                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: "#ff7043" }]}
                    onPress={handleGiangVienLogin} 
                >
                    <Text style={styles.text}>Giảng viên</Text>
                </TouchableOpacity>

                {/* Học viên */}
                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: "#fdd835" }]}
                    onPress={handleHocVienLogin} 
                >
                    <Text style={[styles.text, { color: "#333" }]}>Học viên</Text>
                </TouchableOpacity>
            </View>

            {/* Nút Thoát - Nằm tuyệt đối ở dưới cùng */}
            <TouchableOpacity 
                style={styles.exitButton}
                onPress={handleExit} 
            >
                <Text style={styles.exitText}>Thoát</Text>
            </TouchableOpacity>
        </View>
    );
}

// KHỐI STYLES (Đã thêm các chỉnh sửa cuối cùng)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start", 
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
        paddingTop: 40, // Đẩy nội dung lên gần mép trên
    },
    logo: {
        width: 140,
        height: 140,
        resizeMode: "contain",
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "red",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 40, 
        color: "#555",
    },
    roleContainer: {
        width: "100%",
        alignItems: "center",
    },
    button: {
        width: 250, 
        padding: 12,
        borderRadius: 8, 
        alignItems: "center",
        marginVertical: 8, 
        elevation: 4, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18, 
    },
    exitButton: {
        position: "absolute",
        bottom: 50, 
        backgroundColor: "#333",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8, 
        elevation: 3,
    },
    exitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
}) ;