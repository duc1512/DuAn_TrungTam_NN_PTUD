import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// --- DỮ LIỆU CÓ THỂ THAY ĐỔI (Dùng chung cho cả 2 màn hình) ---
// Giả định dữ liệu này nằm trong file hocvien/profile.tsx để dễ đồng bộ
let MUTABLE_STUDENT_PROFILE = {
    id: 'HV2001',
    name: 'Trần Duy Hà',
    role: 'Học viên',
    email: 'ha.t@tdd.edu',
    phone: '0901234567', 
    totalCourses: 3,
    avgScore: 7.8,
    status: 'Đang học',
    joinDate: '01/09/2024',
};

const updateProfileData = (newName: string, newPhone: string) => {
    MUTABLE_STUDENT_PROFILE.name = newName;
    MUTABLE_STUDENT_PROFILE.phone = newPhone;
    console.log("Student Profile Updated:", MUTABLE_STUDENT_PROFILE);
};
// -------------------------------------------------------

const MAIN_ACCENT_COLOR = '#007bff'; 

export default function HocVienEditProfileScreen() {
    const router = useRouter();
    
    // Đọc dữ liệu hiện tại từ biến toàn cục
    const [name, setName] = useState(MUTABLE_STUDENT_PROFILE.name);
    const [phone, setPhone] = useState(MUTABLE_STUDENT_PROFILE.phone);
    const [email] = useState(MUTABLE_STUDENT_PROFILE.email);

    const handleSave = () => {
        if (!name || !email) {
            console.error("Tên và Email không được để trống.");
            return;
        }
        
        // 1. LÀM SẠCH DỮ LIỆU VÀ LƯU VÀO BIẾN TOÀN CỤC (ĐỒNG BỘ)
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        updateProfileData(name, cleanPhone);
        
        // 2. ĐÓNG BÀN PHÍM VÀ CHUYỂN HƯỚNG TỨC THÌ
        Keyboard.dismiss();
        router.replace('/hocvien/profile');
    };

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen 
                options={{ 
                    title: 'Chỉnh sửa Hồ sơ',
                    headerRight: () => (
                         <TouchableOpacity onPress={handleSave} style={{ marginRight: 10 }}>
                            <Ionicons name="save-outline" size={24} color={MAIN_ACCENT_COLOR} />
                        </TouchableOpacity>
                    )
                }} 
            />

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Thông tin Cơ bản</Text>
                
                {/* Tên */}
                <Text style={styles.label}>Họ và Tên</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
                
                {/* Email (Không chỉnh sửa) */}
                <Text style={styles.label}>Email (Tài khoản)</Text>
                <TextInput
                    style={[styles.input, {backgroundColor: '#eee'}]}
                    value={email}
                    editable={false} 
                />
                
                {/* Điện thoại */}
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                
                <Text style={styles.infoText}>* Ngày gia nhập: {MUTABLE_STUDENT_PROFILE.joinDate}</Text>
            </View>

            <TouchableOpacity 
                style={styles.saveLargeButton} 
                onPress={handleSave} 
            >
                <Ionicons name="save-outline" size={24} color="white" />
                <Text style={styles.saveButtonText}>LƯU THAY ĐỔI</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    contentContainer: { padding: 10, paddingBottom: 50 },
    card: { padding: 20, backgroundColor: 'white', marginHorizontal: 15, marginBottom: 15, borderRadius: 10, elevation: 3, shadowOpacity: 0.1 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
    label: { fontSize: 14, fontWeight: '600', color: '#555', marginTop: 10, marginBottom: 5 },
    input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, color: '#333', marginBottom: 10 },
    infoText: { fontSize: 12, color: '#999', marginTop: 10 },
    saveLargeButton: { flexDirection: 'row', backgroundColor: MAIN_ACCENT_COLOR, padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginHorizontal: 15, elevation: 5 },
    saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
});