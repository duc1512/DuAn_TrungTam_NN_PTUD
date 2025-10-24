import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"; // ĐÃ SỬA: TextInput VẪN ĐƯỢC IMPORT

// --- DỮ LIỆU GIẢ ĐỊNH ---
interface Resource {
    id: string;
    name: string;
    type: 'folder' | 'file';
    fileType?: 'PDF' | 'DOCX' | 'Video' | 'Image';
    size?: string;
    lastModified: string;
    course: string; // Khóa học liên quan
}

const RESOURCE_DATA: Resource[] = [
    // Thư mục
    { id: 'F001', name: 'Giáo trình A1 (2024)', type: 'folder', lastModified: '2025-09-01', course: 'A1 Essentials' },
    { id: 'F002', name: 'Bài kiểm tra IELTS', type: 'folder', lastModified: '2025-10-20', course: 'IELTS Mastery' },
    // Files
    { id: 'D001', name: 'Ngữ pháp cơ bản.pdf', type: 'file', fileType: 'PDF', size: '1.2 MB', lastModified: '2025-10-15', course: 'A1 Essentials' },
    { id: 'D002', name: 'Listening Test 3.mp4', type: 'file', fileType: 'Video', size: '45 MB', lastModified: '2025-10-24', course: 'IELTS Advanced' },
    { id: 'D003', name: 'Hướng dẫn TOEIC.docx', type: 'file', fileType: 'DOCX', size: '300 KB', lastModified: '2025-08-10', course: 'TOEIC Pro' },
    { id: 'D004', name: 'Vocabulary List B2.pdf', type: 'file', fileType: 'PDF', size: '850 KB', lastModified: '2025-09-25', course: 'Business English' },
];

const TYPE_COLORS = {
    folder: '#ffc107',
    PDF: '#dc3545',
    DOCX: '#007bff',
    Video: '#28a745',
    Image: '#6f42c1',
};

const getIconAndColor = (item: Resource) => {
    if (item.type === 'folder') {
        return { icon: 'folder-outline', color: TYPE_COLORS.folder };
    }
    const fileType = item.fileType || 'file';
    switch (fileType) {
        case 'PDF': return { icon: 'document-pdf-outline', color: TYPE_COLORS.PDF };
        case 'DOCX': return { icon: 'file-word-outline', color: TYPE_COLORS.DOCX };
        case 'Video': return { icon: 'file-video-outline', color: TYPE_COLORS.Video };
        default: return { icon: 'file-document-outline', color: '#6c757d' };
    }
};

export default function AdminResourcesScreen() {
    const router = useRouter(); 
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPath, setCurrentPath] = useState('Thư mục Gốc'); // Mô phỏng đường dẫn

    // --- LOGIC LỌC VÀ SẮP XẾP ---
    const filteredResources = useMemo(() => {
        const term = searchTerm.toLowerCase();
        // Sắp xếp: Thư mục lên trước, sau đó sắp xếp theo tên
        return RESOURCE_DATA
            .filter(resource => resource.name.toLowerCase().includes(term))
            .sort((a, b) => {
                if (a.type === 'folder' && b.type !== 'folder') return -1;
                if (a.type !== 'folder' && b.type === 'folder') return 1;
                return a.name.localeCompare(b.name);
            });
    }, [searchTerm]);

    // --- HÀM ĐIỀU HƯỚNG ĐẾN TRANG CHI TIẾT HOẶC MỞ THƯ MỤC ---
    const handleItemPress = (item: Resource) => {
        if (item.type === 'folder') {
            // Trường hợp 1: Mở thư mục (Chỉ cập nhật đường dẫn)
            setCurrentPath(item.name); 
            setSearchTerm(''); 
        } else {
            // Trường hợp 2: Xem chi tiết Tệp tin
            router.push(`/admin/resource_details?id=${item.id}`);
        }
    };

    const handleUpload = () => {
        alert('Mở hộp thoại tải lên file/thư mục.');
    };

    // --- HÀM RENDER ITEM ---
    const renderResourceItem = ({ item }: { item: Resource }) => {
        const { icon, color } = getIconAndColor(item);
        
        return (
            <TouchableOpacity 
                style={styles.resourceItem} 
                onPress={() => handleItemPress(item)}
            >
                <MaterialCommunityIcons name={icon as any} size={24} color={color} style={{width: 30}} />
                
                <View style={styles.resourceInfo}>
                    <Text style={styles.resourceName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.resourceMeta}>
                        {item.type === 'file' ? (item.fileType + ' | ' + item.size) : item.course}
                    </Text>
                </View>
                
                <Ionicons name="chevron-forward-outline" size={20} color="#ccc" /> 
            </TouchableOpacity>
        );
    };
    
    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Quản lý Tài nguyên' }} />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Kho Tài liệu Chung</Text>
                <Text style={styles.pathText}>Đường dẫn: {currentPath}</Text>
            </View>

            {/* CONTROL BAR: Tìm kiếm và Tải lên */}
            <View style={styles.controls}>
                {/* INPUT ĐÃ ĐƯỢC THÊM */}
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Tìm kiếm tài liệu theo tên..."
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                />
                <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}> 
                    <Ionicons name="cloud-upload" size={20} color="white" />
                    <Text style={styles.uploadButtonText}>Tải lên</Text>
                </TouchableOpacity>
            </View>

            {/* Danh sách Tài nguyên */}
            <FlatList
                data={filteredResources}
                renderItem={renderResourceItem}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={() => (
                    <Text style={styles.listHeader}>
                        Tổng số mục: {filteredResources.length}
                    </Text>
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>Không có tài nguyên nào trong thư mục này.</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    header: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },
    pathText: { fontSize: 13, color: '#666', marginTop: 5 },
    
    // Controls and Search
    controls: { flexDirection: 'row', padding: 15, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    searchInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, marginRight: 10, backgroundColor: '#fff' },
    uploadButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
    uploadButtonText: { color: 'white', marginLeft: 5, fontWeight: 'bold' },

    // List Styles
    list: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
    listContent: { paddingBottom: 20 },
    listHeader: { fontSize: 14, fontWeight: 'bold', color: '#555', paddingBottom: 10, paddingHorizontal: 5 },

    resourceItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 8, 
        marginBottom: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    resourceInfo: { flex: 1, marginLeft: 15 },
    resourceName: { fontSize: 16, fontWeight: '600', color: '#333' },
    resourceMeta: { fontSize: 12, color: '#999', marginTop: 3 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
});