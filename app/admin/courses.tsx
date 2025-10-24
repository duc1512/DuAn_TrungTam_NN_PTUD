import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// BƯỚC 1: DỮ LIỆU MẪU VÀ INTERFACE
interface Course {
    id: string;
    name: string;
    level: 'A1' | 'B2' | 'IELTS' | 'TOEIC';
    hocPhan: number;
    price: number;
    trangThai: 'Công khai' | 'Nháp' | 'Lưu trữ';
    color: string;
}
export const ALL_COURSES: Course[] = [
    { id: 'C101', name: 'IELTS Mastery 7.0', level: 'IELTS', hocPhan: 12, price: 8900000, trangThai: 'Công khai', color: '#dc3545' },
    { id: 'C102', name: 'TOEIC Cấp tốc 600+', level: 'TOEIC', hocPhan: 8, price: 4500000, trangThai: 'Công khai', color: '#007bff' },
    { id: 'C103', name: 'Giao Tiếp Cơ Bản (A1)', level: 'A1', hocPhan: 5, price: 1990000, trangThai: 'Nháp', color: '#ffc107' },
    { id: 'C104', name: 'Business English B2', level: 'B2', hocPhan: 10, price: 7200000, trangThai: 'Công khai', color: '#28a745' },
    { id: 'C105', name: 'Khóa Học Đàm Thoại Nâng Cao', level: 'B2', hocPhan: 8, price: 6500000, trangThai: 'Lưu trữ', color: '#6c757d' },
];

const LEVEL_FILTERS = ['Tất cả', 'A1', 'B2', 'IELTS', 'TOEIC'];
const STATUS_FILTERS = ['Tất cả', 'Công khai', 'Nháp', 'Lưu trữ'];

// Hàm ánh xạ màu nền cho Tag Trạng thái
const getStatusTagColor = (trangThai: string) => {
    switch (trangThai) {
        case 'Công khai':
            return '#28a745'; 
        case 'Nháp':
            return '#ffc107'; 
        case 'Lưu trữ':
            return '#6c757d'; 
        default:
            return '#ccc';
    }
};

export default function AdminCoursesScreen() {
    const router = useRouter(); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('Tất cả');
    const [filterStatus, setFilterStatus] = useState('Tất cả');
    
    const handleAddCourse = () => {
        router.push('/admin/add_sourse'); 
    };

    const handleViewCourseDetails = (courseId: string) => { 
        router.push(`/admin/course_details?id=${courseId}`);
    };

    // Logic Lọc Dữ liệu
    const filteredCourses = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return ALL_COURSES.filter(course => {
            const matchesSearch = course.name.toLowerCase().includes(term) || 
                                  course.level.toLowerCase().includes(term);
            const matchesLevel = filterLevel === 'Tất cả' || course.level === filterLevel;
            const matchesStatus = filterStatus === 'Tất cả' || course.trangThai === filterStatus; 
            
            return matchesSearch && matchesLevel && matchesStatus;
        });
    }, [searchTerm, filterLevel, filterStatus]);

    // Hàm render từng Item trong danh sách
    const renderCourseItem = ({ item }: { item: Course }) => (
        <TouchableOpacity 
            style={styles.courseItem} 
            onPress={() => handleViewCourseDetails(item.id)}
        >
            <View style={[styles.statusLine, { backgroundColor: item.color }]} /> 
            <View style={styles.courseInfo}>
                <Text style={styles.courseName}>{item.name}</Text>
                <Text style={styles.courseDetails}>
                    {item.level} | {item.hocPhan} Học phần | {item.price.toLocaleString('vi-VN')} VNĐ
                </Text>
            </View>
            <View style={styles.courseStats}>
                <View style={[styles.statusTag, { 
                    backgroundColor: getStatusTagColor(item.trangThai), 
                }]}>
                    <Text style={{ 
                        color: item.trangThai === 'Nháp' ? '#333' : 'white', 
                        fontWeight: 'bold', 
                        fontSize: 10
                    }}>
                        {item.trangThai}
                    </Text>
                </View>
                {/* ICON DẤU MŨI TÊN ĐI TIẾP */}
                <Ionicons name="chevron-forward-outline" size={20} color="#ccc" style={{marginLeft: 10}} />
            </View>
        </TouchableOpacity>
    );
    
    return (
        <View style={styles.mainContainer}>
            <Stack.Screen 
                options={{ 
                    title: 'Quản lý Khóa Học',
                    // ĐÃ SỬA LỖI: Dùng Arrow Function gọi router.back() trực tiếp
                    headerLeft: () => ( 
                         <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                             <Ionicons name="arrow-back" size={24} color="#333" /> 
                         </TouchableOpacity>
                    )
                }} 
            />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Quản lý Cấu trúc Khóa Học</Text>
            </View>

            {/* CONTROL BAR: Tìm kiếm và Thêm mới */}
            <View style={styles.controls}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Tìm khóa học theo Tên, Cấp độ..."
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}> 
                    <Ionicons name="add-circle" size={20} color="white" />
                    <Text style={styles.addButtonText}>Thêm Khóa</Text>
                </TouchableOpacity>
            </View>

            {/* LỌC THEO CẤP ĐỘ */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {LEVEL_FILTERS.map((level) => (
                        <TouchableOpacity 
                            key={level} 
                            style={[styles.filterButton, filterLevel === level && styles.filterButtonActive]}
                            onPress={() => setFilterLevel(level)}
                        >
                            <Text style={[styles.filterText, filterLevel === level && styles.filterTextActive]}>
                                {level}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* LỌC THEO TRẠNG THÁI */}
             <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {STATUS_FILTERS.map((status) => (
                        <TouchableOpacity 
                            key={status} 
                            style={[styles.filterButton, filterStatus === status && styles.filterButtonActive]}
                            onPress={() => setFilterStatus(status)}
                        >
                            <Text style={[styles.filterText, filterStatus === status && styles.filterTextActive]}>
                                {status}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>


            {/* Danh sách Khóa học */}
            <Text style={styles.listHeader}>
                Tổng số Khóa học: {filteredCourses.length}
            </Text>
            
            <FlatList
                data={filteredCourses}
                renderItem={renderCourseItem}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>Không tìm thấy khóa học nào.</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },
    
    // Controls and Search
    controls: { flexDirection: 'row', padding: 15, alignItems: 'center', backgroundColor: '#fff' },
    searchInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, marginRight: 10, backgroundColor: '#fff' },
    addButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
    addButtonText: { color: 'white', marginLeft: 5, fontWeight: 'bold' },

    // Filters (Dùng lại style)
    filterContainer: { paddingVertical: 5, paddingHorizontal: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    filterButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#eee', marginRight: 10, marginBottom: 5 },
    filterButtonActive: { backgroundColor: '#007bff' },
    filterText: { color: '#333', fontWeight: '500', fontSize: 13 },
    filterTextActive: { color: 'white' },

    // List Styles
    listHeader: { fontSize: 14, fontWeight: 'bold', color: '#555', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff' },
    list: { flex: 1, paddingHorizontal: 0, paddingTop: 10 },
    listContent: { paddingBottom: 20, paddingHorizontal: 15 },

    courseItem: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        borderRadius: 8, 
        marginBottom: 10,
        padding: 15,
        paddingLeft: 25, 
        position: 'relative',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    statusLine: { width: 5, height: '100%', borderRadius: 3, position: 'absolute', left: 0, top: 0 },
    courseInfo: { flex: 1, marginRight: 10 },
    courseName: { fontSize: 16, fontWeight: '600', color: '#333' },
    courseDetails: { fontSize: 12, color: '#999', marginTop: 3 },
    courseStats: { flexDirection: 'row', alignItems: 'center' },
    statusTag: { 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 15, 
        overflow: 'hidden'
    },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
});