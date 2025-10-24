import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";

// --- DỮ LIỆU GIẢ ĐỊNH (Cần đồng bộ với logic) ---
interface GradeDetail { id: string; assignment: string; grade: number; max: number; weight: string; }
interface CourseGrade { courseId: string; courseName: string; teacher: string; details: GradeDetail[]; }
const GRADES_DATA: CourseGrade[] = [
    { courseId: 'IELTSW', courseName: 'IELTS Writing (G3)', teacher: 'Cô Tú Sương', details: [{ id: 'T1', assignment: 'Điểm Giữa Kỳ (30%)', grade: 7.5, max: 10, weight: '30%' }, { id: 'T2', assignment: 'Bài tập Unit 3 (10%)', grade: 8.8, max: 10, weight: '10%' }, { id: 'T3', assignment: 'Điểm Chuyên cần (15%)', grade: 9.0, max: 10, weight: '15%' }, { id: 'T4', assignment: 'Điểm Cuối Kỳ (45%)', grade: 0.0, max: 10, weight: '45%' }] },
    { courseId: 'TOEIC', courseName: 'TOEIC Giao Tiếp (B2)', teacher: 'Thầy Lê Tùng', details: [{ id: 'T5', assignment: 'Bài kiểm tra 1 (20%)', grade: 85, max: 100, weight: '20%' }, { id: 'T6', assignment: 'Thuyết trình (30%)', grade: 70, max: 100, weight: '30%' }, { id: 'T7', assignment: 'Điểm Cuối Khóa (50%)', grade: 0, max: 100, weight: '50%' }] },
    { courseId: 'NPN', courseName: 'Ngữ Pháp Nâng Cao', teacher: 'Cô Nguyễn Vy', details: [{ id: 'T8', assignment: 'Kiểm tra Ứng dụng', grade: 9.5, max: 10, weight: '50%' }, { id: 'T9', assignment: 'Bài tập Về nhà', grade: 8.0, max: 10, weight: '50%' }] },
];

const calculateAverage = (details: GradeDetail[]): { avg: string, color: string } => {
    let totalScore = 0;
    let totalGradedWeight = 0;
    const itemsGraded = details.filter(item => item.grade > 0);
    
    itemsGraded.forEach(item => {
        const normalizedGrade = item.grade * (10 / item.max); 
        totalScore += normalizedGrade;
        totalGradedWeight += 1;
    });

    if (totalGradedWeight === 0) return { avg: 'N/A', color: '#6c757d' };
    
    const avg = totalScore / totalGradedWeight;
    const color = avg >= 7.5 ? '#28a745' : avg >= 5.0 ? '#ffc107' : '#dc3545';

    return { avg: avg.toFixed(1), color };
};

const ACCENT_COLOR = '#007bff';


// --- COMPONENT PHỤ: Thẻ Hàng Điểm Chi tiết ---
const GradeDetailRow = ({ item }: { item: GradeDetail }) => {
    const isPending = item.grade === 0;
    const scoreColor = item.grade >= 7.5 ? '#28a745' : (item.grade > 0 ? '#ffc107' : '#999');

    return (
        <View style={styles.detailRow}>
            <View style={styles.detailAssignmentInfo}>
                <Text style={styles.detailAssignmentName} numberOfLines={1}>{item.assignment}</Text>
                <Text style={styles.detailAssignmentId}>Mã: {item.id}</Text>
            </View>
            <Text style={styles.detailAssignmentWeight}>{item.weight}</Text>
            <Text style={[styles.detailScoreValue, { color: scoreColor }]}>
                {isPending ? '—' : `${item.grade.toFixed(1)} / ${item.max.toFixed(0)}`}
            </Text>
        </View>
    );
};


export default function HocVienGradesScreen() {
    const router = useRouter(); 
    // State quản lý ID khóa học đang được mở rộng
    const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

    const handleToggleExpand = (courseId: string) => {
        setExpandedCourseId(prevId => prevId === courseId ? null : courseId);
    };

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Tra Cứu Điểm' }} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bảng Điểm Tích Lũy</Text>
            </View>

            {/* Danh sách Khóa học (Accordion) */}
            <FlatList
                data={GRADES_DATA}
                keyExtractor={item => item.courseId}
                scrollEnabled={false}
                renderItem={({ item }) => {
                    const { avg, color } = calculateAverage(item.details);
                    const isExpanded = expandedCourseId === item.courseId;

                    return (
                        <View style={styles.courseBlock}>
                            {/* Header Khóa học */}
                            <TouchableOpacity 
                                style={[styles.courseHeader, { borderLeftColor: color }]}
                                onPress={() => handleToggleExpand(item.courseId)}
                            >
                                <View style={styles.courseHeaderInfo}>
                                    <Text style={styles.courseName}>{item.courseName}</Text>
                                    <Text style={styles.teacherName}>GV: {item.teacher}</Text>
                                </View>
                                <View style={styles.courseHeaderScore}>
                                    <Text style={[styles.courseAvg, { color }]}>{avg}</Text>
                                    <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#666" />
                                </View>
                            </TouchableOpacity>

                            {/* Nội dung Chi tiết Điểm (Expandable) */}
                            {isExpanded && (
                                <View style={styles.detailContent}>
                                    <View style={styles.detailHeader}>
                                        <Text style={styles.detailHeaderLabel}>Bài tập/Học phần</Text>
                                        <Text style={styles.detailHeaderLabel}>Trọng số</Text>
                                        <Text style={styles.detailHeaderLabel}>Điểm / Max</Text>
                                    </View>
                                    {item.details.map((detailItem, index) => (
                                        <GradeDetailRow key={detailItem.id} item={detailItem} />
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                }}
            />
            
            <View style={styles.footerInfo}>
                <Text style={styles.footerText}>* Điểm Trung bình được tính trên các mục đã có điểm (> 0).</Text>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    contentContainer: { paddingHorizontal: 15, paddingVertical: 10, paddingBottom: 50 },

    header: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: ACCENT_COLOR },

    // Accordion Styles
    courseBlock: { marginBottom: 10, borderRadius: 10, overflow: 'hidden', elevation: 2, shadowOpacity: 0.1, backgroundColor: 'white' },
    
    // Course Header
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderLeftWidth: 5, // Dùng cho màu điểm TB
        backgroundColor: '#fff',
    },
    courseHeaderInfo: { flex: 1 },
    courseName: { fontSize: 16, fontWeight: '700', color: '#333' },
    teacherName: { fontSize: 13, color: '#666', marginTop: 3 },
    
    courseHeaderScore: { flexDirection: 'row', alignItems: 'center' },
    courseAvg: { fontSize: 22, fontWeight: 'bold', marginRight: 10 },

    // Detail Content
    detailContent: { paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#f9f9f9' },
    detailHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
    detailHeaderLabel: { fontSize: 12, color: '#999', fontWeight: 'bold', width: '30%', textAlign: 'right' },
    
    // Detail Row
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
    detailAssignmentInfo: { flex: 1, marginRight: 10 },
    detailAssignmentName: { fontSize: 15, color: '#333' },
    detailAssignmentId: { fontSize: 11, color: '#999' },
    detailAssignmentWeight: { fontSize: 14, color: '#666', width: '20%', textAlign: 'right' },
    detailScoreValue: { fontSize: 15, fontWeight: 'bold', width: '30%', textAlign: 'right' },

    // Footer
    footerInfo: { paddingHorizontal: 15, marginTop: 10 },
    footerText: { fontSize: 12, color: '#999' },
    emptyText: { fontStyle: 'italic', color: '#999', textAlign: 'center', padding: 20 },
});