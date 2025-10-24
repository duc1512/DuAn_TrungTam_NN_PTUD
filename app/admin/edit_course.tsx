import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// BẮT BUỘC PHẢI IMPORT ALL_COURSES ĐỂ CÓ THỂ CẬP NHẬT DỮ LIỆU
import { ALL_COURSES } from "./courses";

// MÀU SẮC DỰ KIẾN
const PRIMARY_COLOR = '#007bff'; 
const SUCCESS_COLOR = '#28a745'; 
const ERROR_COLOR = '#dc3545';
const ACCENT_COLOR = '#ffc107'; 

// Khai báo lại Interface
interface Course {
    id: string; name: string; level: 'A1' | 'B2' | 'IELTS' | 'TOEIC';
    hocPhan: number; price: number; trangThai: 'Công khai' | 'Nháp' | 'Lưu trữ';
    color: string; description?: string;
}

export default function AdminEditCourseScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const courseId = params.id as string;
    
    // States Form
    const [name, setName] = useState('');
    const [level, setLevel] = useState('A1');
    const [hocPhan, setHocPhan] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const LEVEL_OPTIONS = ['A1', 'A2', 'B1', 'B2', 'IELTS', 'TOEIC'];

    // Hàm format tiền tệ
    const formatCurrency = (input: string) => {
        const cleaned = input.replace(/\D/g, '');
        if (!cleaned) return '';
        const number = parseInt(cleaned);
        return number.toLocaleString('vi-VN');
    };
    
    // LOGIC LOAD DỮ LIỆU CŨ KHI MỞ TRANG
    useEffect(() => {
        const courseToEdit = ALL_COURSES.find(c => c.id === courseId);
        if (courseToEdit) {
            setName(courseToEdit.name);
            setLevel(courseToEdit.level);
            setHocPhan(String(courseToEdit.hocPhan));
            setPrice(courseToEdit.price.toLocaleString('vi-VN'));
            setDescription(courseToEdit.description || '');
            setLoading(false);
        } else {
            alert("Lỗi: Không tìm thấy khóa học cần chỉnh sửa.");
            router.back();
        }
    }, [courseId]);

    // LOGIC LƯU VÀ CẬP NHẬT
    const handleUpdateCourse = () => {
        const parsedHocPhan = parseInt(hocPhan);
        const rawPrice = price.replace(/\D/g, ''); 
        const parsedPrice = parseInt(rawPrice); 

        if (!name || !level || isNaN(parsedHocPhan) || parsedHocPhan <= 0 || isNaN(parsedPrice) || parsedPrice <= 0) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        setError('');

        // BƯỚC 1: TÌM VÀ CẬP NHẬT OBJECT TRONG MẢNG GLOBAL
        const index = ALL_COURSES.findIndex(c => c.id === courseId);
        if (index !== -1) {
            const updatedCourse: Course = {
                ...ALL_COURSES[index], 
                name: name,
                level: level as Course['level'],
                hocPhan: parsedHocPhan,
                price: parsedPrice,
                description: description,
            };
            
            // Cập nhật dữ liệu vào mảng ALL_COURSES
            ALL_COURSES[index] = updatedCourse; 
            
            Alert.alert("Thành công", `Đã cập nhật khóa học: ${name}`);
            
            // BƯỚC 2: CHUYỂN HƯỚNG VỀ TRANG CHI TIẾT
            // Trang chi tiết sẽ tự động tải lại thông tin mới nhất
            router.replace(`/admin/course_details?id=${courseId}`); 
        } else {
             Alert.alert("Lỗi", "Không thể cập nhật. Khóa học đã bị xóa.");
        }
    };
    
    if (loading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={PRIMARY_COLOR} /><Text>Đang tải...</Text></View>;
    }
    
    // Kiểm tra trạng thái khóa học để KHÔNG cho phép chỉnh sửa nếu là 'Công khai'
    const isPublic = ALL_COURSES.find(c => c.id === courseId)?.trangThai === 'Công khai';
    const isEditable = !isPublic;


    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen 
                options={{ 
                    title: `Chỉnh sửa: ${name}`,
                    headerRight: () => isEditable ? (
                        <TouchableOpacity onPress={handleUpdateCourse} style={{ marginRight: 5 }}>
                            <Ionicons name="save-outline" size={24} color={SUCCESS_COLOR} />
                        </TouchableOpacity>
                    ) : null,
                    headerTintColor: PRIMARY_COLOR,
                }} 
            />
            
            {/* THÔNG BÁO KHÔNG CHO PHÉP CHỈNH SỬA */}
            {!isEditable && (
                <View style={[styles.card, {backgroundColor: '#fff0e6', borderColor: ERROR_COLOR, borderWidth: 1}]}>
                    <Text style={{color: ERROR_COLOR, fontWeight: 'bold', fontSize: 16}}>
                        <Ionicons name="lock-closed-outline" size={18} color={ERROR_COLOR} /> Khóa học đang ở trạng thái 'Công khai' và không thể chỉnh sửa.
                    </Text>
                </View>
            )}

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Thông tin Khóa học</Text>
                
                {/* Tên Khóa học */}
                <Text style={styles.label}>Tên Khóa học *</Text>
                <TextInput style={styles.input} onChangeText={setName} value={name} editable={isEditable} />
                
                {/* Cấp độ */}
                <Text style={styles.label}>Cấp độ (Level) *</Text>
                <ScrollView horizontal style={styles.selectorScroll}>
                    <View style={styles.selectorContainer}>
                        {LEVEL_OPTIONS.map(lvl => (
                            <TouchableOpacity 
                                key={lvl} 
                                style={[
                                    styles.levelButton, 
                                    level === lvl && styles.levelButtonActive, 
                                    !isEditable && styles.disabledButton
                                ]}
                                onPress={() => isEditable && setLevel(lvl)}
                                disabled={!isEditable}
                            >
                                <Text style={[styles.levelText, level === lvl && styles.levelTextActive]}>{lvl}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
            
            {/* ... (Các thẻ Form) ... */}

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Chi tiết Nội dung & Giá</Text>
                
                {/* Số Học phần (Modules) */}
                <Text style={styles.label}>Tổng số Học phần *</Text>
                <TextInput 
                    style={styles.input} 
                    onChangeText={setHocPhan} 
                    value={hocPhan} 
                    keyboardType="numeric" 
                    editable={isEditable}
                />
                
                {/* Giá */}
                <Text style={styles.label}>Giá Khóa học (VNĐ) *</Text>
                <TextInput 
                    style={styles.input} 
                    onChangeText={(text) => setPrice(formatCurrency(text))} 
                    value={price} 
                    keyboardType="numeric" 
                    editable={isEditable}
                />
                <Text style={styles.priceHint}>Giá hiện tại: {price} VNĐ</Text>
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
                    editable={isEditable}
                />
            </View>

            {/* HIỂN THỊ LỖI */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Nút lưu lớn */}
            {isEditable && (
                <TouchableOpacity style={styles.saveLargeButton} onPress={handleUpdateCourse}>
                    <Ionicons name="save-outline" size={24} color="white" />
                    <Text style={styles.saveLargeButtonText}>CẬP NHẬT KHÓA HỌC</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}

// KHỐI STYLES
const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    contentContainer: { padding: 10, paddingBottom: 50 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    
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
    input: { 
        width: '100%', 
        minHeight: 48, 
        backgroundColor: '#f9f9f9', 
        borderRadius: 10, 
        paddingHorizontal: 15, 
        marginBottom: 15, 
        borderWidth: 1, 
        borderColor: '#e0e0e0', 
        fontSize: 16,
    },
    priceHint: {
        fontSize: 13,
        color: '#6c757d',
        marginBottom: 10,
        textAlign: 'right',
        marginTop: -10,
        paddingRight: 5,
    },
    errorText: { color: ERROR_COLOR, textAlign: 'center', marginBottom: 15, fontWeight: '600' },

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
    disabledButton: { opacity: 0.6 }, // Mờ nút khi không chỉnh sửa

    // Save Button Styles
    saveLargeButton: { 
        flexDirection: 'row', 
        backgroundColor: PRIMARY_COLOR, 
        padding: 18, 
        borderRadius: 10, 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: 10,
        ...Platform.select({
            ios: { shadowColor: PRIMARY_COLOR, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.4, shadowRadius: 6 },
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