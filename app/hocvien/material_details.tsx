import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- DỮ LIỆU GIẢ ĐỊNH (Cần đồng bộ với file materials.tsx nếu có thể) ---
interface Material {
    id: string;
    title: string;
    course: string;
    type: 'PDF' | 'Slide' | 'Video' | 'Test';
    size: string;
    isDownloaded: boolean;
    color: string;
    description: string; // Chi tiết mô tả
    uploadedBy: string;
    uploadedDate: string;
}

const MATERIAL_DATA: Material[] = [
    { id: 'M001', title: 'Giáo trình Unit 5 (Văn phạm)', course: 'IELTS Writing', type: 'PDF', size: '2.5 MB', isDownloaded: true, color: '#dc3545', description: 'Tài liệu tập trung vào các cấu trúc câu phức tạp và cách sử dụng các thì quá khứ hoàn thành trong văn viết học thuật (Task 2).', uploadedBy: 'Cô Tú Sương', uploadedDate: '2025-10-20' },
    { id: 'M002', title: 'Bài giảng Nghe B1', course: 'TOEIC Giao Tiếp', type: 'Slide', size: '15 MB', isDownloaded: false, color: '#007bff', description: 'Tập hợp các bài tập nghe và transcript cho Unit 1-3. Yêu cầu nghe kỹ và ghi chú lại từ vựng mới.', uploadedBy: 'Thầy Lê Tùng', uploadedDate: '2025-10-22' },
    { id: 'M003', title: 'Đề thi Thử Speaking', course: 'IELTS Speaking', type: 'Test', size: '300 KB', isDownloaded: true, color: '#ffc107', description: 'Bộ đề thi thử Speaking mới nhất cho quý 4/2025. Bao gồm Part 1, Part 2 và Part 3.', uploadedBy: 'Cô Nguyễn Vy', uploadedDate: '2025-09-15' },
    { id: 'M004', title: 'Hướng dẫn Phát âm (Video)', course: 'IELTS Writing', type: 'Video', size: '120 MB', isDownloaded: false, color: '#28a745', description: 'Video hướng dẫn chi tiết cách phát âm các âm khó trong Tiếng Anh, giúp cải thiện điểm tiêu chí Pronunciation.', uploadedBy: 'Thầy Lê Tùng', uploadedDate: '2025-10-23' },
    { id: 'M005', title: 'Bài tập Unit 6', course: 'TOEIC Giao Tiếp', type: 'PDF', size: '1.1 MB', isDownloaded: false, color: '#dc3545', description: 'Bài tập tổng hợp củng cố kiến thức ngữ pháp của Unit 6 (Mệnh đề quan hệ).', uploadedBy: 'Cô Tú Sương', uploadedDate: '2025-10-24' },
];

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

// Hàm tìm kiếm tài liệu theo ID
const findMaterialById = (id: string) => {
    return MATERIAL_DATA.find(m => m.id === id); 
};


// --- COMPONENT CHÍNH ---
export default function HocVienMaterialDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const materialId = id as string;
    
    // Tìm kiếm chi tiết tài liệu
    const materialDetail: Material | undefined = useMemo(() => {
        return findMaterialById(materialId); 
    }, [materialId]);
    
    // Giả định trạng thái tải xuống
    const [isDownloaded, setIsDownloaded] = useState(materialDetail ? materialDetail.isDownloaded : false);


    if (!materialDetail) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ title: "Không tìm thấy" }} />
                <Text style={styles.errorText}>Không tìm thấy tài liệu này.</Text>
                <TouchableOpacity onPress={() => router.back()}><Text style={{color: ACCENT_COLOR, marginTop: 15}}>Quay lại</Text></TouchableOpacity>
            </View>
        );
    }
    
    const handleAction = () => {
        if (isDownloaded) {
            alert(`Mở tài liệu ${materialDetail.title} để xem.`);
        } else {
            // Mô phỏng quá trình tải xuống
            setIsDownloaded(true);
            alert(`Đang tải xuống ${materialDetail.title} (${materialDetail.size})...`);
        }
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen options={{ title: 'Chi tiết Tài liệu' }} />

            {/* PHẦN 1: HEADER & TÓM TẮT */}
            <View style={[styles.header, { borderLeftColor: materialDetail.color }]}>
                <View style={styles.headerIcon}>
                    <MaterialCommunityIcons 
                        name={getFileIcon(materialDetail.type) as any} 
                        size={50} 
                        color={materialDetail.color} 
                    />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.headerCourse}>{materialDetail.course}</Text>
                    <Text style={styles.headerTitle}>{materialDetail.title}</Text>
                    <View style={styles.badgeContainer}>
                        <Text style={[styles.typeBadge, {backgroundColor: materialDetail.color + '20', color: materialDetail.color}]}>
                            {materialDetail.type}
                        </Text>
                        <Text style={styles.sizeText}>
                            {materialDetail.size}
                        </Text>
                    </View>
                </View>
            </View>
            
            {/* PHẦN 2: THÔNG TIN CHI TIẾT */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Thông tin Chi tiết</Text>
                
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={18} color="#666" style={styles.infoIcon} />
                    <Text style={styles.infoLabel}>Người đăng:</Text>
                    <Text style={styles.infoValue}>{materialDetail.uploadedBy}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={18} color="#666" style={styles.infoIcon} />
                    <Text style={styles.infoLabel}>Ngày đăng:</Text>
                    <Text style={styles.infoValue}>{materialDetail.uploadedDate}</Text>
                </View>
                
                <View style={styles.infoRow}>
                    <Ionicons name="key-outline" size={18} color="#666" style={styles.infoIcon} />
                    <Text style={styles.infoLabel}>Mã tài liệu:</Text>
                    <Text style={styles.infoValue}>{materialDetail.id}</Text>
                </View>
                
                <View style={styles.infoRow}>
                    <Ionicons name="school-outline" size={18} color="#666" style={styles.infoIcon} />
                    <Text style={styles.infoLabel}>Khóa học:</Text>
                    <Text style={styles.infoValue}>{materialDetail.course}</Text>
                </View>

                <Text style={styles.descriptionLabel}>Mô tả:</Text>
                <Text style={styles.descriptionText}>{materialDetail.description}</Text>
            </View>

            {/* PHẦN 3: ACTION BUTTON */}
            <View style={styles.actionCard}>
                <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: isDownloaded ? '#28a745' : ACCENT_COLOR }]} 
                    onPress={handleAction}
                >
                    <Ionicons 
                        name={isDownloaded ? "eye-outline" : "cloud-download-outline"} 
                        size={22} 
                        color="white" 
                        style={{marginRight: 10}}
                    />
                    <Text style={styles.actionButtonText}>
                        {isDownloaded ? 'XEM TÀI LIỆU' : `TẢI XUỐNG (${materialDetail.size})`}
                    </Text>
                </TouchableOpacity>
                {isDownloaded && <Text style={styles.downloadStatusText}>File đã có trên thiết bị.</Text>}
            </View>


            <View style={{height: 40}} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f3f5' },
    errorText: { fontSize: 16, color: '#dc3545', marginTop: 10 },

    // Header
    header: { 
        padding: 20, 
        backgroundColor: 'white',
        borderLeftWidth: 5, 
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: { marginRight: 15, padding: 5, borderRadius: 10, backgroundColor: '#f0f3f5' },
    headerText: { flex: 1 },
    headerCourse: { fontSize: 14, color: '#666' },
    headerTitle: { fontSize: 22, fontWeight: '900', color: '#333', marginTop: 3 },
    badgeContainer: { flexDirection: 'row', marginTop: 5, alignItems: 'center' },
    typeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 5,
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 10,
    },
    sizeText: { fontSize: 13, color: '#999' },

    // Card & Detail Rows
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 3,
        shadowOpacity: 0.1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
    },
    infoIcon: { width: 30 },
    infoLabel: { fontSize: 14, color: '#666', fontWeight: '500', width: 100 },
    infoValue: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
    descriptionLabel: { fontSize: 14, fontWeight: '600', color: '#555', marginTop: 15, marginBottom: 5 },
    descriptionText: { fontSize: 15, color: '#666', lineHeight: 22 },

    // Action Area
    actionCard: {
        padding: 20,
        marginHorizontal: 15,
        marginBottom: 15,
        alignItems: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        elevation: 5,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    downloadStatusText: {
        fontSize: 13,
        color: '#28a745',
        marginTop: 10,
        fontWeight: '600',
    }
});