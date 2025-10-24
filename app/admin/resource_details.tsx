import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- DỮ LIỆU GIẢ ĐỊNH TỪ RESOURCES.TSX ---
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
    // Tệp tin
    { id: 'D001', name: 'Ngữ pháp cơ bản.pdf', type: 'file', fileType: 'PDF', size: '1.2 MB', lastModified: '2025-10-15', course: 'A1 Essentials' },
    { id: 'D002', name: 'Listening Test 3.mp4', type: 'file', fileType: 'Video', size: '45 MB', lastModified: '2025-10-24', course: 'IELTS Advanced' },
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

const findResourceById = (resourceId: string) => {
    return RESOURCE_DATA.find(r => r.id === resourceId);
};

// --- COMPONENT PHỤ: HIỂN THỊ HÀNG THÔNG TIN ---
interface DetailRowProps {
    icon: keyof typeof Ionicons.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    value: string | number;
    color: string;
}
const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, color }) => (
    <View style={styles.detailRow}>
        <MaterialCommunityIcons name={icon as any} size={20} color={color} style={{marginRight: 10}} />
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);
// ---------------------------------------------


export default function AdminResourceDetailsScreen() {
    const router = useRouter();
    // 1. LẤY ID TỪ URL
    const { id } = useLocalSearchParams();
    const resourceId = id as string;

    // 2. TÌM KIẾM DỮ LIỆU
    const resourceDetail: Resource | undefined = useMemo(() => {
        if (!resourceId) return undefined;
        return findResourceById(resourceId);
    }, [resourceId]);

    if (!resourceDetail) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ title: "Không tìm thấy" }} />
                <Text style={styles.errorText}>Không tìm thấy tài nguyên.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{color: '#007bff'}}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { icon, color } = getIconAndColor(resourceDetail);
    const isFolder = resourceDetail.type === 'folder';


    // --- HÀM CHO THAO TÁC (CHỈ DÙNG CHO FOLDER) ---
    const handleNavigateIntoFolder = () => {
        // Trong ứng dụng thực, bạn sẽ chuyển sang trang danh sách tài nguyên, 
        // nhưng lọc theo parentId hoặc đường dẫn của thư mục này
        router.replace(`/admin/resources?path=${resourceDetail.name}`);
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen 
                options={{ 
                    title: isFolder ? 'Chi tiết Thư mục' : 'Chi tiết Tệp tin',
                    headerRight: () => (
                        <TouchableOpacity onPress={() => alert('Xóa/Đổi tên')} style={{ marginRight: 10 }}>
                            <Ionicons name="trash-outline" size={24} color="#dc3545" />
                        </TouchableOpacity>
                    )
                }} 
            />

            {/* PHẦN 1: HEADER & TÊN TÀI NGUYÊN */}
            <View style={styles.header}>
                <MaterialCommunityIcons name={icon} size={48} color={color} />
                <Text style={styles.headerTitle}>{resourceDetail.name}</Text>
                <Text style={styles.headerType}>{isFolder ? 'Thư mục' : resourceDetail.fileType || 'Tệp tin'}</Text>
            </View>

            {/* PHẦN 2: THÔNG TIN CHI TIẾT */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Thông tin Cơ bản</Text>
                
                <DetailRow 
                    icon="folder-text-outline" 
                    label="Khóa học" 
                    value={resourceDetail.course} 
                    color="#007bff"
                />
                <DetailRow 
                    icon="calendar-month-outline" 
                    label="Lần sửa cuối" 
                    value={resourceDetail.lastModified} 
                    color="#28a745"
                />
                
                {/* HIỂN THỊ DỮ LIỆU ĐẶC THÙ CHO FILE */}
                {!isFolder && (
                    <>
                        <DetailRow 
                            icon="database-outline" 
                            label="Kích thước" 
                            value={resourceDetail.size || 'N/A'} 
                            color="#ff7043"
                        />
                        <DetailRow 
                            icon="file-link-outline" 
                            label="Mã định danh" 
                            value={resourceDetail.id} 
                            color="#6c757d"
                        />
                    </>
                )}
            </View>

            {/* PHẦN 3: NÚT HÀNH ĐỘNG */}
            <View style={styles.actionButtonsContainer}>
                {isFolder ? (
                    // NÚT CHO THƯ MỤC
                    <TouchableOpacity style={[styles.actionButton, styles.folderAction]} onPress={handleNavigateIntoFolder}>
                        <Ionicons name="folder-open-outline" size={20} color="white" />
                        <Text style={styles.actionButtonText}>MỞ THƯ MỤC</Text>
                    </TouchableOpacity>
                ) : (
                    // NÚT CHO TỆP TIN
                    <>
                        <TouchableOpacity style={[styles.actionButton, styles.fileAction]} onPress={() => alert('Tải xuống')}>
                            <Ionicons name="download-outline" size={20} color="white" />
                            <Text style={styles.actionButtonText}>TẢI VỀ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.fileActionSecondary]} onPress={() => alert('Chia sẻ Link')}>
                            <Ionicons name="share-social-outline" size={20} color="#007bff" />
                            <Text style={[styles.actionButtonText, {color: '#007bff'}]}>CHIA SẺ</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

        </ScrollView>
    );
}

// --- STYLES ---
const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f3f5' },
    errorText: { fontSize: 16, color: '#dc3545', marginTop: 10 },
    
    // Header
    header: { 
        padding: 20, 
        backgroundColor: 'white',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#333',
        marginTop: 10,
    },
    headerType: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },

    // Card & Detail Rows
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 15,
        marginBottom: 15,
        ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 }, android: { elevation: 3 } }),
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
    },
    detailLabel: { fontSize: 15, color: '#666', fontWeight: '500', marginLeft: 10, width: 120 },
    detailValue: { flex: 1, fontSize: 15, fontWeight: '600', color: '#333' },

    // Action Buttons
    actionButtonsContainer: { padding: 15, flexDirection: 'row', justifyContent: 'space-between' },
    actionButton: { 
        padding: 15, 
        borderRadius: 10, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5, 
        elevation: 4, 
    },
    actionButtonText: { 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 16,
        marginLeft: 10
    },
    folderAction: { 
        flex: 1, 
        backgroundColor: '#007bff' 
    },
    fileAction: {
        flex: 1, 
        backgroundColor: '#28a745',
        marginRight: 10,
    },
    fileActionSecondary: {
        flex: 0.8, 
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#007bff'
    }
});