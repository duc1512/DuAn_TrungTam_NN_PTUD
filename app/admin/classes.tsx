// File: /admin/classes.tsx (ĐÃ SỬA TOÀN BỘ LOGIC VÀ DỮ LIỆU)

import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// --- HÀM HELPER ĐỂ TẠO SỐ NGẪU NHIÊN TRONG PHẠM VI SỐ NGUYÊN (10-25) ---
const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// --- INTERFACE VÀ TYPES ---
export type StatusVietnamese = 'Đang học' | 'Lên lịch' | 'Đã xong';

export interface ClassType {
    id: string;
    name: string;
    course: string;
    teacher: string;
    students: number; // Số học viên hiện tại (Đã được cố định ngẫu nhiên 10-25)
    status: StatusVietnamese; 
    color: string;
    schedule?: string; // Trường mới
    maxCapacity?: number; // Trường mới
}

// KHAI BÁO MÀU SẮC & TRẠNG THÁI TIẾNG VIỆT
export const STATUS_COLORS_MAP: Record<StatusVietnamese, { background: string; text: string }> = {
    'Đang học': { background: '#28a745', text: 'white' },
    'Lên lịch': { background: '#ffc107', text: '#333' },
    'Đã xong': { background: '#dc3545', text: 'white' },
};

// DỮ LIỆU MẪU (SỐ HỌC VIÊN ĐÃ ĐƯỢC CỐ ĐỊNH NGẪU NHIÊN 10-25)
export const ALL_CLASSES: ClassType[] = [
    { id: 'L001', name: 'Tiếng Anh Giao Tiếp A1', course: 'A1 Essentials', teacher: 'Cô Trần Mai', students: getRandomInt(10, 25), status: 'Đang học', color: '#28a745' },
    { id: 'L002', name: 'IELTS Band 6.5 - T3', course: 'IELTS Advanced', teacher: 'Thầy Lê Tùng', students: getRandomInt(10, 25), status: 'Đang học', color: '#007bff' },
    { id: 'L003', name: 'Ngữ Pháp Cơ Bản', course: 'A1 Essentials', teacher: 'Cô Nguyễn Vy', students: getRandomInt(10, 25), status: 'Lên lịch', color: '#ffc107' },
    { id: 'L004', name: 'TOEIC Cấp Tốc', course: 'TOEIC Pro', teacher: 'Thầy Lê Tùng', students: getRandomInt(10, 25), status: 'Đang học', color: '#28a745' },
    { id: 'L005', name: 'Luyện Viết nâng cao', course: 'Advanced Writing', teacher: 'Cô Trần Mai', students: getRandomInt(10, 25), status: 'Đã xong', color: '#dc3545' },
];

// BỘ LỌC ĐÃ CĂN CHỈNH
const STATUS_FILTERS = ['Tất cả', 'Đang học', 'Lên lịch', 'Đã xong'];

export default function AdminClassesScreen() {
    const router = useRouter(); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Tất cả');

    // HÀM ĐIỀU HƯỚNG ĐẾN TRANG THÊM MỚI
    const handleAddClass = () => {
        router.push('/admin/add_class'); 
    };

    // HÀM ĐIỀU HƯỚNG SANG TRANG CHI TIẾT LỚP HỌC
    const handleViewClassDetails = (classId: string) => {
        router.push(`/admin/class_details?id=${classId}`);
    };

    // HÀM ĐIỀU HƯỚNG SANG TRANG CHI TIẾT GIẢNG VIÊN
    const handleViewTeacherDetails = (teacherName: string) => {
        router.push(`/admin/user_details?name=${teacherName}`);
    };


    // Logic Lọc Dữ liệu
    const filteredClasses = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return ALL_CLASSES.filter(cls => {
            const matchesSearch = cls.name.toLowerCase().includes(term) || 
                                  cls.teacher.toLowerCase().includes(term);
            
            const matchesStatus = filterStatus === 'Tất cả' || cls.status === filterStatus; 
            
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, filterStatus]);

    // Hàm render từng Item trong danh sách
    const renderClassItem = ({ item }: { item: ClassType }) => { 
        const colors = STATUS_COLORS_MAP[item.status] || { background: '#ccc', text: '#333' };

        return (
            <TouchableOpacity style={styles.classItem} onPress={() => handleViewClassDetails(item.id)}>
                <View style={styles.classInfo}>
                    <Text style={styles.className}>{item.name}</Text>
                    <Text style={styles.classDetails}>
                        {item.course} | GV: 
                         <Text 
                            style={styles.teacherLink}
                            onPress={(e) => {
                                e.stopPropagation(); 
                                handleViewTeacherDetails(item.teacher);
                            }}
                        >
                            {' '} {item.teacher}
                        </Text>
                    </Text>
                </View>
                <View style={styles.classStats}>
                    {/* 🔥 ĐÃ XÓA: component hiển thị số lượng học viên (HV) */}
                    
                    <Text style={[styles.statusTag, { backgroundColor: colors.background, color: colors.text }]}>
                        {item.status}
                    </Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#ccc" style={{marginLeft: 10}} />
                </View>
            </TouchableOpacity>
        );
    };
    
    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Quản lý Lớp Học' }} />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Quản lý Danh sách Lớp</Text>
            </View>

            {/* CONTROL BAR: Tìm kiếm và Thêm mới */}
            <View style={styles.controls}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Tìm lớp theo Tên, GV..."
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddClass}> 
                    <Ionicons name="add-circle" size={20} color="white" />
                    <Text style={styles.addButtonText}>Thêm Lớp</Text>
                </TouchableOpacity>
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
                            {/* Hiển thị số lượng theo trạng thái tiếng Việt */}
                            <Text style={[styles.filterText, filterStatus === status && styles.filterTextActive]}>
                                {status} ({status === 'Tất cả' ? ALL_CLASSES.length : ALL_CLASSES.filter(c => c.status === status).length})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Danh sách lớp học */}
            <Text style={styles.listHeader}>
                Tổng số Lớp học: {filteredClasses.length}
            </Text>
            
            <FlatList
                data={filteredClasses}
                renderItem={renderClassItem}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                initialNumToRender={10}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>Không tìm thấy lớp học nào.</Text>
                )}
            />
        </View>
    );
}

// KHỐI STYLES CHUNG
const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },
    
    // Controls and Search
    controls: { flexDirection: 'row', padding: 15, alignItems: 'center', backgroundColor: '#fff' },
    searchInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, marginRight: 10, backgroundColor: '#fff' },
    addButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
    addButtonText: { color: 'white', marginLeft: 5, fontWeight: 'bold' },

    // Filters
    filterContainer: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    filterButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#eee', marginRight: 10 },
    filterButtonActive: { backgroundColor: '#007bff' },
    filterText: { color: '#333', fontWeight: '500', fontSize: 13 },
    filterTextActive: { color: 'white' },

    // List Styles
    listHeader: { fontSize: 14, fontWeight: 'bold', color: '#555', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff' },
    list: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
    listContent: { paddingBottom: 20 },

    classItem: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    classInfo: { flex: 1, marginRight: 10 },
    className: { fontSize: 16, fontWeight: '600', color: '#333' },
    classDetails: { fontSize: 12, color: '#999', marginTop: 3 },
    classStats: { flexDirection: 'row', alignItems: 'center' },
    studentCount: { fontSize: 14, fontWeight: 'bold', color: '#007bff', marginRight: 10 },
    statusTag: { 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 15, 
        fontSize: 10, 
        fontWeight: 'bold',
        overflow: 'hidden'
    },
    editButton: { 
        marginLeft: 10, 
        padding: 5,
        borderRadius: 5,
    },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
    teacherLink: {
        color: '#007bff',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    }
});