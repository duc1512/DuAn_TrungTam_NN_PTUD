import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// BƯỚC 1: IMPORT DỮ LIỆU GLOBAL TỪ ADMIN ACCOUNTS
import { CURRENT_USERS } from "./accounts";

export default function AdminAddUserScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState(''); // State phone đã được thêm
    
    // ĐÃ SỬA: LOẠI BỎ VAI TRÒ 'Staff' KHỎI MẢNG CHỌN VAI TRÒ
    const ROLES = ['Học viên', 'Giảng viên']; 
    const [role, setRole] = useState(ROLES[0]); // Mặc định là Học viên

    const handleSaveUser = () => {
        if (!name || !email || !password || !role) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }

        // BƯỚC 2: THÊM DỮ LIỆU MỚI VÀO BIẾN GLOBAL (Sẽ được tải lại trên trang Accounts)
        const newUser = {
            id: `${role.substring(0, 2).toUpperCase()}${Date.now().toString().slice(-4)}`, // ID TẠO TẠM
            name: name,
            role: role as any, // Ép kiểu cho TS
            email: email,
            status: 'Active',
        };
        
        CURRENT_USERS.push(newUser); // <-- THÊM VÀO NGUỒN DỮ LIỆU CHUNG

        Alert.alert("Thành công", `Đã thêm thành công người dùng: ${name} (${role})`);
        
        router.back(); 
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen 
                options={{ 
                    title: 'Thêm Tài Khoản Mới',
                    headerRight: () => (
                        <TouchableOpacity onPress={handleSaveUser} style={{ marginRight: 5 }}>
                            <Ionicons name="save-outline" size={24} color="#007bff" />
                        </TouchableOpacity>
                    )
                }} 
            />

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Thông tin Cơ bản</Text>
                
                {/* Trường Chọn Vai trò */}
                <Text style={styles.label}>Chọn Vai trò *</Text>
                <View style={styles.roleSelector}>
                    {ROLES.map(r => (
                        <TouchableOpacity 
                            key={r}
                            style={[styles.roleButton, role === r && styles.roleButtonActive]}
                            onPress={() => setRole(r)}
                        >
                            <Text style={[styles.roleText, role === r && styles.roleTextActive]}>{r}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tên người dùng */}
                <Text style={styles.label}>Họ và Tên *</Text>
                <TextInput style={styles.input} onChangeText={setName} value={name} />
                
                {/* Email */}
                <Text style={styles.label}>Email *</Text>
                <TextInput 
                    style={styles.input} 
                    onChangeText={setEmail} 
                    value={email} 
                    keyboardType="email-address"
                />

                <Text style={styles.sectionTitle}>Thông tin Bảo mật</Text>
                
                {/* Mật khẩu */}
                <Text style={styles.label}>Mật khẩu *</Text>
                <TextInput 
                    style={styles.input} 
                    onChangeText={setPassword} 
                    value={password} 
                    secureTextEntry 
                />

                <Text style={styles.sectionTitle}>Thông tin Liên hệ</Text>
                
                {/* Điện thoại */}
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput 
                    style={styles.input} 
                    onChangeText={setPhone} 
                    value={phone} 
                    keyboardType="phone-pad"
                />
                
                {/* Nút lưu lớn */}
                <TouchableOpacity style={styles.saveLargeButton} onPress={handleSaveUser}>
                    <Ionicons name="save-outline" size={24} color="white" />
                    <Text style={styles.saveLargeButtonText}>LƯU TÀI KHOẢN</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#007bff', marginTop: 15, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
    
    label: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 5, marginTop: 10 },
    input: { width: '100%', height: 45, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },

    // Role Selector Styles
    roleSelector: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
    roleButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#eee', marginRight: 10, marginBottom: 10 },
    roleButtonActive: { backgroundColor: '#007bff' },
    roleText: { color: '#333', fontWeight: '500' },
    roleTextActive: { color: 'white', fontWeight: 'bold' },

    // Save Button Styles
    saveLargeButton: { 
        flexDirection: 'row', 
        backgroundColor: '#28a745', 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 30,
        marginBottom: 50,
        elevation: 5,
    },
    saveLargeButtonText: { 
        color: 'white', 
        marginLeft: 10, 
        fontWeight: 'bold', 
        fontSize: 18 
    }
});