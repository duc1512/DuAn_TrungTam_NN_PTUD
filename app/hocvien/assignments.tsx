import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Lấy chiều rộng màn hình
const screenWidth = Dimensions.get('window').width;
const ACCENT_COLOR = '#ff7043'; // Màu chủ đạo (Cam)
const WARNING_COLOR = '#ffc107'; // Vàng (Due/Sắp hết hạn)
const PASS_COLOR = '#28a745'; // Xanh lá (Đã chấm điểm/Đạt)
const DANGER_COLOR = '#dc3545'; // Đỏ (Quá hạn)

// --- INTERFACE VÀ DỮ LIỆU GIẢ ĐỊNH ---
interface Assignment {
    id: string;
    title: string;
    course: string;
    dueDate: string;
    status: 'Pending' | 'Graded' | 'Due' | 'Completed';
    score?: number;
    maxScore: number;
}

const ASSIGNMENT_DATA: Assignment[] = [
    { id: 'A001', title: 'Bài tập Unit 5: Ngữ pháp Tense', course: 'IELTS Writing 7.0', dueDate: '2025-10-28', status: 'Pending', maxScore: 10 },
    { id: 'A002', title: 'Bài kiểm tra Giữa kỳ (Listening)', course: 'TOEIC Giao Tiếp', dueDate: '2025-10-25', status: 'Due', maxScore: 100 },
    { id: 'A003', title: 'Assignment 2: Phân tích Văn bản', course: 'Ngữ Pháp Nâng Cao', dueDate: '2025-10-20', status: 'Graded', score: 8.5, maxScore: 10 },
    { id: 'A004', title: 'Bài tập Unit 4 (Đã quá hạn)', course: 'IELTS Writing 7.0', dueDate: '2025-10-15', status: 'Due', maxScore: 10 }, 
    { id: 'A005', title: 'Bài kiểm tra Đầu vào (Hoàn thành)', course: 'TOEIC Giao Tiếp', dueDate: '2025-09-01', status: 'Completed', score: 6.5, maxScore: 10 },
];

const VIEW_OPTIONS = ['Đang Chờ', 'Đã Hoàn Thành'];


// --- COMPONENT PHỤ: THẺ BÀI TẬP ---
const AssignmentCard: React.FC<{ item: Assignment, onPress: (id: string) => void }> = ({ item, onPress }) => {
    let statusLabel = '';
    let statusColor = '';
    let actionIcon = 'arrow-forward-circle-outline';
    
    switch (item.status) {
        case 'Pending':
        case 'Due':
            statusLabel = 'Sắp hết hạn';
            statusColor = WARNING_COLOR;
            break;
        case 'Graded':
            statusLabel = `Điểm: ${item.score}/${item.maxScore}`;
            statusColor = item.score! >= 7 ? PASS_COLOR : DANGER_COLOR;
            actionIcon = 'eye-outline';
            break;
        case 'Completed':
            statusLabel = 'Chờ chấm';
            statusColor = PASS_COLOR;
            break;
    }

    return (
        <TouchableOpacity style={[styles.cardItem, { borderLeftColor: statusColor }]} onPress={() => onPress(item.id)}>
            <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons 
                    name={item.status === 'Due' ? 'file-alert-outline' : 'file-document-outline'} 
                    size={28} 
                    color={statusColor} 
                />
            </View>
            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardCourse}>{item.course} | Hạn: {item.dueDate}</Text>
            </View>
            <View style={styles.cardStatus}>
                <Text style={[styles.statusTag, { backgroundColor: statusColor, color: item.status === 'Pending' || item.status === 'Due' ? '#333' : 'white' }]}>
                    {statusLabel}
                </Text>
                <Ionicons name={actionIcon as any} size={20} color={statusColor} style={{marginLeft: 10}} />
            </View>
        </TouchableOpacity>
    );
};
// ---------------------------------------------


export default function HocVienAssignmentsScreen() {
    const router = useRouter(); 
    const [selectedView, setSelectedView] = useState<'Đang Chờ' | 'Đã Hoàn Thành'>('Đang Chờ');
    
    // --- LOGIC LỌC DỮ LIỆU ---
    const filteredAssignments = useMemo(() => {
        if (selectedView === 'Đang Chờ') {
            return ASSIGNMENT_DATA.filter(a => a.status === 'Pending' || a.status === 'Due');
        } else {
            return ASSIGNMENT_DATA.filter(a => a.status === 'Graded' || a.status === 'Completed');
        }
    }, [selectedView]);

    // 🔥 SỬA LỖI ĐIỀU HƯỚNG: Đảm bảo trỏ đến /hocvien/assignment_details
    const handleItemPress = (assignmentId: string) => {
        router.push(`/hocvien/assignment_details?id=${assignmentId}`);
    };

    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Bài tập & Thi' }} />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Quản lý Bài tập và Bài thi</Text>
            </View>

            {/* 1. THANH CHỌN CHẾ ĐỘ XEM */}
            <View style={styles.segmentedControlContainer}>
                {VIEW_OPTIONS.map((view) => (
                    <TouchableOpacity 
                        key={view}
                        style={[styles.segmentButton, selectedView === view && styles.segmentButtonActive]}
                        onPress={() => setSelectedView(view as 'Đang Chờ' | 'Đã Hoàn Thành')}
                    >
                        <Text style={[styles.segmentText, selectedView === view && styles.segmentTextActive]}>
                            {view}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 2. DANH SÁCH BÀI TẬP */}
            <FlatList
                data={filteredAssignments}
                renderItem={({ item }) => <AssignmentCard item={item} onPress={handleItemPress} />}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={() => (
                    <Text style={styles.listHeader}>
                        {selectedView} ({filteredAssignments.length} mục)
                    </Text>
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>Tuyệt vời! Không có bài tập nào đang chờ bạn.</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    header: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: ACCENT_COLOR },

    // 1. Segmented Control
    segmentedControlContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 8,
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    segmentButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 8,
    },
    segmentButtonActive: {
        backgroundColor: ACCENT_COLOR,
    },
    segmentText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: ACCENT_COLOR,
    },
    segmentTextActive: {
        color: 'white',
    },

    // 2. List Styles
    list: { flex: 1, paddingHorizontal: 15 },
    listContent: { paddingBottom: 20 },
    listHeader: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#666', fontStyle: 'italic' },
    
    // Card Item
    cardItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 8,
        borderLeftWidth: 5, 
        elevation: 2,
        shadowOpacity: 0.05,
    },
    cardIconContainer: { marginRight: 15, width: 30 },
    cardInfo: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
    cardCourse: { fontSize: 12, color: '#999', marginTop: 3 },
    
    cardStatus: { flexDirection: 'row', alignItems: 'center' },
    statusTag: { 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 15, 
        fontSize: 10, 
        fontWeight: 'bold',
        overflow: 'hidden'
    },
});