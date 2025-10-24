import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// BẮT BUỘC PHẢI IMPORT ALL_COURSES ĐỂ CÓ THỂ THÊM DỮ LIỆU VÀO NGUỒN CHUNG
// Đảm bảo file courses.tsx đã export const ALL_COURSES = [...]
import { ALL_COURSES } from "./courses";

// MÀU SẮC DỰ KIẾN
const PRIMARY_COLOR = '#007bff'; 
const SUCCESS_COLOR = '#28a745'; 
const ACCENT_COLOR = '#ffc107'; // Vàng (Nháp)

export default function AdminAddCourseScreen() {
    const router = useRouter();
    // Khai báo states cho form
    const [name, setName] = useState('');
    const [level, setLevel] = useState('A1');
    const [hocPhan, setHocPhan] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    
    // States phụ
    const [error, setError] = useState('');
    
    const LEVEL_OPTIONS = ['A1', 'A2', 'B1', 'B2', 'IELTS', 'TOEIC'];

    // Hàm format tiền tệ (currency formatting)
    const formatCurrency = (input: string) => {
        const cleaned = input.replace(/\D/g, '');
        if (!cleaned) return '';
        const number = parseInt(cleaned);
        return number.toLocaleString('vi-VN');
    };

    const handleSaveCourse = () => {
        const parsedHocPhan = parseInt(hocPhan);
        // Loại bỏ dấu chấm, phẩy khỏi chuỗi giá trước khi chuyển sang số
        const rawPrice = price.replace(/\D/g, ''); 
        const parsedPrice = parseInt(rawPrice); 

        if (!name || !level || isNaN(parsedHocPhan) || parsedHocPhan <= 0 || isNaN(parsedPrice) || parsedPrice <= 0) {
            setError("Vui lòng điền đầy đủ và chính xác Tên, Cấp độ, Học phần và Giá.");
            return;
        }

        setError(''); // Xóa lỗi nếu validation thành công

        // TẠO OBJECT KHÓA HỌC MỚI
        const newCourseId = `C${Date.now().toString().slice(-4)}`;
        const newCourse = {
            id: newCourseId, 
            name: name,
            level: level,
            hocPhan: parsedHocPhan,
            price: parsedPrice,
            trangThai: 'Nháp' as const, // Mặc định là Nháp
            color: ACCENT_COLOR, // Màu vàng cho trạng thái Nháp
            description: description || 'Chưa có mô tả chi tiết.',
            classList: [], // Khóa học mới chưa có lớp nào
        };

        // BƯỚC 1: THÊM KHÓA HỌC MỚI VÀO MẢNG GLOBAL
        // Sử dụng kiểu any để tránh lỗi TypeScript khi push vào mảng global
        (ALL_COURSES as any).push(newCourse); 

        Alert.alert("Thành công", `Đã tạo khóa học: ${name}. Chuyển về trang Quản lý Khóa học...`);
        
        // BƯỚC 2: CHUYỂN HƯỚNG TRỰC TIẾP ĐẾN TRANG QUẢN LÝ KHÓA HỌC
        // Đã thay đổi từ /admin/course_details sang /admin/courses
        router.replace('/admin/courses'); 
    };
    

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen 
                options={{ 
                    title: 'Thêm Khóa Học Mới',
                    headerRight: () => (
                        <TouchableOpacity onPress={handleSaveCourse} style={{ marginRight: 5 }}>
                            <Ionicons name="save-outline" size={24} color={SUCCESS_COLOR} />
                        </TouchableOpacity>
                    ),
                    headerTintColor: PRIMARY_COLOR,
                }} 
            />

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Thông tin Khóa học</Text>
                
                {/* Tên Khóa học */}
                <Text style={styles.label}>Tên Khóa học *</Text>
                <TextInput style={styles.input} onChangeText={setName} value={name} placeholder="Ví dụ: IELTS Mastery 7.0" />
                
                {/* Cấp độ */}
                <Text style={styles.label}>Cấp độ (Level) *</Text>
                <ScrollView horizontal style={styles.selectorScroll}>
                    <View style={styles.selectorContainer}>
                        {LEVEL_OPTIONS.map(lvl => (
                            <TouchableOpacity 
                                key={lvl} 
                                style={[styles.levelButton, level === lvl && styles.levelButtonActive]}
                                onPress={() => setLevel(lvl)}
                            >
                                <Text style={[styles.levelText, level === lvl && styles.levelTextActive]}>{lvl}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Chi tiết Nội dung & Giá</Text>
                
                {/* Số Học phần (Modules) */}
                <Text style={styles.label}>Tổng số Học phần *</Text>
                <TextInput 
                    style={styles.input} 
                    onChangeText={setHocPhan} 
                    value={hocPhan} 
                    keyboardType="numeric" 
                    placeholder="Số lượng modules (Ví dụ: 12)"
                />
                
                {/* Giá */}
                <Text style={styles.label}>Giá Khóa học (VNĐ) *</Text>
                <TextInput 
                    style={styles.input} 
                    onChangeText={(text) => setPrice(formatCurrency(text))} 
                    value={price} 
                    keyboardType="numeric" 
                    placeholder="Nhập giá"
                />
                <Text style={styles.priceHint}>Giá sẽ được lưu dưới dạng: {price ? price : '0'} VNĐ</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Mô tả</Text>
                
                {/* Mô tả chi tiết */}
                <Text style={styles.label}>Mô tả chi tiết khóa học</Text>
                <TextInput 
                    style={[styles.input, {height: 100, textAlignVertical: 'top'}]} 
                    onChangeText={setDescription} 
                    value={description} 
                    multiline 
                    placeholder="Mô tả mục tiêu, yêu cầu đầu vào..."
                />
            </View>

            {/* HIỂN THỊ LỖI */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Nút lưu lớn */}
            <TouchableOpacity style={styles.saveLargeButton} onPress={handleSaveCourse}>
                <Ionicons name="save-outline" size={24} color="white" />
                <Text style={styles.saveLargeButtonText}>TẠO KHÓA HỌC</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

// KHỐI STYLES ĐÃ ĐƯỢC CẢI TIẾN THIẾT KẾ (CLEAN & ELEVATED)
const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    contentContainer: { padding: 10, paddingBottom: 50 },
    
    // Card Style
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        margin: 10,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
            android: { elevation: 4 }
        }),
    },
    cardTitle: { 
        fontSize: 17, 
        fontWeight: 'bold', 
        color: PRIMARY_COLOR, 
        marginBottom: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee', 
        paddingBottom: 5 
    },
    
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5, marginTop: 5 },
    // INPUT CHUNG (Nổi trên nền, bo góc)
    input: { 
        width: '100%', 
        minHeight: 48, 
        backgroundColor: '#fff', 
        borderRadius: 10, 
        paddingHorizontal: 15, 
        marginBottom: 15, 
        borderWidth: 1, 
        borderColor: '#e0e0e0', 
        fontSize: 16,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 1 },
        }),
    },

    // Level Selector Styles
    selectorScroll: { marginHorizontal: -10, marginBottom: 10 },
    selectorContainer: { flexDirection: 'row', paddingHorizontal: 10 },
    levelButton: { 
        paddingVertical: 8, 
        paddingHorizontal: 15, 
        borderRadius: 20, 
        backgroundColor: '#eee', 
        marginRight: 10, 
        marginBottom: 10, 
        borderWidth: 1, 
        borderColor: '#ddd' 
    },
    levelButtonActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
    levelText: { color: '#333', fontWeight: '500', fontSize: 14 },
    levelTextActive: { color: 'white', fontWeight: 'bold' },
    priceHint: {
        fontSize: 13,
        color: '#6c757d',
        marginBottom: 10,
        textAlign: 'right',
        marginTop: -10,
        paddingRight: 5,
    },

    // Error and Save Button Styles
    errorText: { color: '#dc3545', textAlign: 'center', marginBottom: 15, fontWeight: '600' },

    saveLargeButton: { 
        flexDirection: 'row', 
        backgroundColor: SUCCESS_COLOR, 
        padding: 18, 
        borderRadius: 10, 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: 10,
        // Shadow CTA
        ...Platform.select({
            ios: { shadowColor: SUCCESS_COLOR, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.4, shadowRadius: 6 },
            android: { elevation: 8 }
        }),
    },
    saveLargeButtonText: { 
        color: 'white', 
        marginLeft: 10, 
        fontWeight: 'bold', 
        fontSize: 18 
    }
});