import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// --- DỮ LIỆU GIẢ ĐỊNH ---
interface Material {
    id: string;
    title: string;
    course: string;
    type: 'PDF' | 'Slide' | 'Video' | 'Test';
    size: string;
    isDownloaded: boolean;
    color: string;
}

const MATERIAL_DATA: Material[] = [
    { id: 'M001', title: 'Giáo trình Unit 5 (Văn phạm)', course: 'IELTS Writing', type: 'PDF', size: '2.5 MB', isDownloaded: true, color: '#dc3545' },
    { id: 'M002', title: 'Bài giảng Nghe B1', course: 'TOEIC Giao Tiếp', type: 'Slide', size: '15 MB', isDownloaded: false, color: '#007bff' },
    { id: 'M003', title: 'Đề thi Thử Speaking', course: 'IELTS Speaking', type: 'Test', size: '300 KB', isDownloaded: true, color: '#ffc107' },
    { id: 'M004', title: 'Hướng dẫn Phát âm (Video)', course: 'IELTS Writing', type: 'Video', size: '120 MB', isDownloaded: false, color: '#28a745' },
    { id: 'M005', title: 'Bài tập Unit 6', course: 'TOEIC Giao Tiếp', type: 'PDF', size: '1.1 MB', isDownloaded: false, color: '#dc3545' },
];

const COURSE_FILTERS = ['Tất cả', 'IELTS Writing', 'TOEIC Giao Tiếp', 'IELTS Speaking'];
const ACCENT_COLOR = '#007bff';

// Hàm lấy icon dựa trên loại tài liệu
const getFileIcon = (type: Material['type']) => {
    switch (type) {
        case 'PDF': return 'file-pdf-box';
        case 'Slide': return 'presentation';
        case 'Video': return 'video-box';
        case 'Test': return 'file-check-outline';
        default: return 'file-document-box';
    }
};


// --- COMPONENT PHỤ: THẺ TÀI LIỆU ---
const MaterialCard: React.FC<{ item: Material, onPress: (id: string) => void, onAction: (item: Material) => void }> = ({ item, onPress, onAction }) => (
    <TouchableOpacity 
        style={styles.materialCard} 
        onPress={() => onPress(item.id)}
    >
        <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
                name={getFileIcon(item.type) as any}
                size={28} 
                color={item.color} 
            />
        </View>
        
        <View style={styles.materialInfo}>
            <Text style={styles.materialTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.materialCourse}>{item.course} | {item.size}</Text>
        </View>

        <TouchableOpacity style={styles.actions} onPress={() => onAction(item)}>
            <Ionicons 
                name={item.isDownloaded ? "cloud-done" : "cloud-download-outline"} 
                size={24} 
                color={item.isDownloaded ? '#28a745' : ACCENT_COLOR}
            />
        </TouchableOpacity>
    </TouchableOpacity>
);

// --- COMPONENT CHÍNH ---
export default function HocVienMaterialsScreen() {
    const router = useRouter(); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCourse, setFilterCourse] = useState('Tất cả');
    
    // Giả định trạng thái tải xuống (để demo onAction)
    const [downloadStatus, setDownloadStatus] = useState<Record<string, boolean>>({});


    // --- LOGIC LỌC VÀ HIỂN THỊ DỮ LIỆU ---
    const filteredMaterials = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return MATERIAL_DATA.map(m => ({
            ...m,
            isDownloaded: downloadStatus[m.id] !== undefined ? downloadStatus[m.id] : m.isDownloaded
        })).filter(material => {
            const matchesSearch = material.title.toLowerCase().includes(term);
            const matchesCourse = filterCourse === 'Tất cả' || material.course === filterCourse;
            return matchesSearch && matchesCourse;
        });
    }, [searchTerm, filterCourse, downloadStatus]);


    const handleViewDetails = (materialId: string) => {
        
         router.push(`/hocvien/material_details?id=${materialId}`);
    };

    const handleDownloadAction = (item: Material) => {
        if (item.isDownloaded || downloadStatus[item.id]) {
            alert(`Tài liệu ${item.title} đã được tải xuống!`);
            return;
        }
        // Mô phỏng quá trình tải xuống
        setDownloadStatus(prev => ({...prev, [item.id]: true}));
        alert(`Đang tải xuống ${item.title} (${item.size})...`);
    };


    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Kho Giáo Trình' }} />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tài liệu Học tập</Text>
            </View>

            {/* CONTROL BAR: Tìm kiếm */}
            <View style={styles.controls}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Tìm kiếm tài liệu theo tên..."
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                />
            </View>

            {/* LỌC THEO KHÓA HỌC */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {COURSE_FILTERS.map((course) => (
                        <TouchableOpacity 
                            key={course} 
                            style={[styles.filterButton, filterCourse === course && styles.filterButtonActive]}
                            onPress={() => setFilterCourse(course)}
                        >
                            <Text style={[styles.filterText, filterCourse === course && styles.filterTextActive]}>
                                {course}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Danh sách Tài liệu */}
            <FlatList
                data={filteredMaterials}
                renderItem={({ item }) => (
                    <MaterialCard 
                        item={item} 
                        onPress={handleViewDetails} 
                        onAction={handleDownloadAction}
                    />
                )}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={() => (
                    <Text style={styles.listHeader}>
                        Tổng số tài liệu: {filteredMaterials.length}
                    </Text>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                         <MaterialCommunityIcons name="folder-open-outline" size={40} color="#ccc" />
                         <Text style={styles.emptyText}>Không tìm thấy tài liệu phù hợp.</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    header: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: ACCENT_COLOR },

    // Controls and Search
    controls: { flexDirection: 'row', padding: 15, alignItems: 'center', backgroundColor: 'white' },
    searchInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, marginRight: 10, backgroundColor: '#f9f9f9' },

    // Filters
    filterContainer: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
    filterButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#eee', marginRight: 10, borderWidth: 1, borderColor: '#eee' },
    filterButtonActive: { backgroundColor: ACCENT_COLOR, borderColor: ACCENT_COLOR },
    filterText: { color: '#333', fontWeight: '500', fontSize: 13 },
    filterTextActive: { color: 'white' },

    // List Styles
    list: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
    listContent: { paddingBottom: 20 },
    listHeader: { fontSize: 14, fontWeight: 'bold', color: '#555', paddingBottom: 10 },
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#666', marginTop: 10, fontSize: 16 },

    // Material Card
    materialCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#007bff20', // Viền xanh mờ
        elevation: 2,
        shadowOpacity: 0.05,
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#f0f3f5',
    },
    materialInfo: { 
        flex: 1, 
        marginLeft: 15,
        marginRight: 10,
    },
    materialTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
    materialCourse: { fontSize: 12, color: '#999', marginTop: 3 },
    actions: {
        width: 40,
        alignItems: 'flex-end',
        padding: 5,
    }
});