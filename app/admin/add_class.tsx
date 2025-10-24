import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// BẮT BUỘC PHẢI IMPORT ALL_CLASSES ĐỂ CÓ THỂ THÊM DỮ LIỆU VÀO NGUỒN CHUNG
import { ALL_CLASSES } from "./classes";

export default function AdminAddClassScreen() {
    const router = useRouter();
    const [className, setClassName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [teacher, setTeacher] = useState('');
    const [students, setStudents] = useState('');
    const [schedule, setSchedule] = useState('');
    const [description, setDescription] = useState('');

    const TEACHERS = ['Cô Trần Mai', 'Thầy Lê Tùng', 'Cô Nguyễn Vy', 'Thầy Khang']; 
    
    // State để theo dõi lỗi nhập liệu (UX Feedback)
    const [error, setError] = useState('');
    
    const handleSaveClass = () => {
        const studentCount = parseInt(students);
        
        if (!className || !teacher || !courseName || isNaN(studentCount) || studentCount <= 0) {
            setError("Vui lòng điền Tên lớp, Khóa học, Giảng viên và Số lượng học viên (> 0).");
            return;
        }

        setError(''); // Xóa lỗi nếu validation thành công

        // TẠO OBJECT LỚP HỌC MỚI
        const newClass = {
            id: `L${Date.now().toString().slice(-4)}`, 
            name: className,
            course: courseName,
            teacher: teacher,
            students: studentCount,
            schedule: schedule || 'Chưa cập nhật lịch học',
            status: 'Lên lịch' as const, 
            color: '#ffc107', // Màu mặc định cho trạng thái 'Dự kiến'
            description: description || 'Chưa có mô tả.',
        };

        // THÊM LỚP MỚI VÀO MẢNG DỮ LIỆU GLOBAL
        ALL_CLASSES.push(newClass); 

        Alert.alert("Thành công", `Đã thêm lớp: ${className} (${newClass.id})`);
        
        // Quay lại trang danh sách, trang đó sẽ tự động tải lại
        router.back(); 
    };

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen 
                options={{ 
                    title: 'Thêm Lớp Học Mới',
                    headerStyle: { backgroundColor: '#fff' },
                    headerTintColor: '#007bff',
                    headerRight: () => (
                        <TouchableOpacity onPress={handleSaveClass} style={styles.headerSaveButton}>
                            <Ionicons name="save-outline" size={24} color="#007bff" />
                        </TouchableOpacity>
                    )
                }} 
            />

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Thông tin Lớp học</Text>
                
                {/* Tên Lớp */}
                <Text style={styles.label}>Tên Lớp *</Text>
                <TextInput style={styles.input} onChangeText={setClassName} value={className} placeholder="Ví dụ: IELTS Cấp Tốc B2" />
                
                {/* Khóa học */}
                <Text style={styles.label}>Khóa học (Môn học) *</Text>
                <TextInput style={styles.input} onChangeText={setCourseName} value={courseName} placeholder="Ví dụ: IELTS Advanced" />
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Phân công & Lịch trình</Text>

                {/* Giảng viên */}
                <Text style={styles.label}>Phân công Giảng viên *</Text>
                {/* Selector Giảng viên */}
                <ScrollView horizontal style={styles.selectorScroll}>
                    <View style={styles.selectorContainer}>
                        {TEACHERS.map(t => (
                            <TouchableOpacity 
                                key={t} 
                                style={[styles.teacherButton, teacher === t && styles.teacherButtonActive]}
                                onPress={() => setTeacher(t)}
                            >
                                <Text style={[styles.teacherText, teacher === t && styles.teacherTextActive]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                
                {/* Lịch học */}
                <Text style={styles.label}>Lịch học chi tiết</Text>
                <TextInput style={styles.input} onChangeText={setSchedule} value={schedule} placeholder="Ví dụ: T3, T5, T7 (19:00 - 20:30)" />
                
                {/* Số lượng học viên */}
                <Text style={styles.label}>Số lượng Học viên dự kiến *</Text>
                <TextInput 
                    style={styles.input} 
                    onChangeText={setStudents} 
                    value={students} 
                    keyboardType="numeric" 
                    placeholder="Nhập số lượng học viên"
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Mô tả</Text>
                
                {/* Mô tả chi tiết */}
                <Text style={styles.label}>Mô tả lớp học</Text>
                <TextInput 
                    style={[styles.input, {height: 100, textAlignVertical: 'top'}]} 
                    onChangeText={setDescription} 
                    value={description} 
                    multiline 
                    placeholder="Mô tả mục tiêu, yêu cầu đầu vào của lớp..."
                />
            </View>

            {/* HIỂN THỊ LỖI */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Nút lưu lớn */}
            <TouchableOpacity style={styles.saveLargeButton} onPress={handleSaveClass}>
                <Ionicons name="save-outline" size={24} color="white" />
                <Text style={styles.saveLargeButtonText}>LƯU & XUẤT BẢN LỚP HỌC</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' }, // Nền xám nhạt hơn
    contentContainer: { padding: 10, paddingBottom: 50 },
    
    // Card Style (Phần nền trắng nổi)
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        margin: 10,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
            android: { elevation: 3 }
        }),
    },
    cardTitle: { 
        fontSize: 17, 
        fontWeight: 'bold', 
        color: '#007bff', 
        marginBottom: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee', 
        paddingBottom: 5 
    },
    
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5, marginTop: 5 },
    input: { width: '100%', minHeight: 45, backgroundColor: '#f9f9f9', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#e0e0e0', fontSize: 16 },

    // Teacher Selector Styles
    selectorScroll: { marginHorizontal: -10, marginBottom: 10 },
    selectorContainer: { flexDirection: 'row', paddingHorizontal: 10 },
    teacherButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#eee', marginRight: 10, borderWidth: 1, borderColor: '#eee' },
    teacherButtonActive: { backgroundColor: '#ff7043', borderColor: '#ff7043' },
    teacherText: { color: '#333', fontWeight: '500', fontSize: 14 },
    teacherTextActive: { color: 'white', fontWeight: 'bold' },

    // Error and Save Button Styles
    errorText: { color: '#dc3545', textAlign: 'center', marginBottom: 15, fontWeight: '600' },
    headerSaveButton: { marginRight: 5 },

    saveLargeButton: { 
        flexDirection: 'row', 
        backgroundColor: '#28a745', 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: 10,
        elevation: 5,
    },
    saveLargeButtonText: { 
        color: 'white', 
        marginLeft: 10, 
        fontWeight: 'bold', 
        fontSize: 18 
    }
});