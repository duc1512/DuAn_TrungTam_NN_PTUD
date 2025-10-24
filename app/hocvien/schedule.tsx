import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useMemo, useState } from "react";
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Lấy chiều rộng màn hình (Mặc dù không dùng trực tiếp nhưng tốt cho style linh hoạt)
const screenWidth = Dimensions.get('window').width;

// --- BIẾN CỐ ĐỊNH & MÀU SẮC ---
const ACCENT_COLOR = '#007bff'; // Xanh dương chủ đạo
const MAIN_SECONDARY_COLOR = '#ff7043'; // Cam (Dùng cho điểm chưa đạt)
const PASS_COLOR = '#28a745'; // Xanh lá (Dùng cho điểm đạt)
const GRAY_COLOR = '#6c757d'; // Xám

// --- INTERFACES & DỮ LIỆU GIẢ ĐỊNH ---
// (Đảm bảo dữ liệu giả định đồng bộ với giao diện)
interface ScheduleItem {
    id: number;
    date: string;
    time: string;
    className: string;
    status: 'Sắp tới' | 'Đang diễn ra' | 'Đã hoàn thành';
    color: string;
    courseName: string; // Đã thêm để phù hợp với interface cũ
}

interface GradeItem {
    assignment: string;
    grade: number;
    max: number;
    weight: string;
    passed: boolean;
    color: string;
}

interface ScheduleCardProps {
    item: ScheduleItem;
}

const CLASS_SCHEDULE: ScheduleItem[] = [
    { id: 1, date: 'T2 (14/10)', time: '18:00 - 19:30', className: 'IELTS Writing (G3)', status: 'Đang diễn ra', color: ACCENT_COLOR, courseName: 'IELTS Writing' },
    { id: 2, date: 'T4 (16/10)', time: '19:30 - 21:00', className: 'Ngữ Pháp Nâng Cao', status: 'Sắp tới', color: PASS_COLOR, courseName: 'Ngữ Pháp' },
    { id: 3, date: 'T6 (18/10)', time: '17:00 - 18:30', className: 'TOEIC Cấp tốc', status: 'Sắp tới', color: ACCENT_COLOR, courseName: 'TOEIC' },
    { id: 4, date: 'T7 (19/10)', time: '09:00 - 11:00', className: 'IELTS Listening (G3)', status: 'Đã hoàn thành', color: GRAY_COLOR, courseName: 'IELTS Listening' },
];

const STUDENT_GRADES: GradeItem[] = [
    { assignment: 'Điểm Giữa Kỳ', grade: 7.5, max: 10, weight: '30%', passed: true, color: PASS_COLOR },
    { assignment: 'Bài tập Unit 3', grade: 8.8, max: 10, weight: '10%', passed: true, color: ACCENT_COLOR },
    { assignment: 'Điểm Chuyên cần', grade: 6.0, max: 10, weight: '15%', passed: false, color: MAIN_SECONDARY_COLOR },
    { assignment: 'Điểm Cuối Kỳ (Chưa thi)', grade: 0.0, max: 10, weight: '45%', passed: false, color: '#ccc' },
];


// --- COMPONENT PHỤ: THẺ LỊCH HỌC (Modern Card) ---
const ScheduleCard: React.FC<ScheduleCardProps> = ({ item }) => {
    // Logic màu sắc cho pill và border
    let statusColor = item.color;
    if (item.status === 'Đã hoàn thành') {
        statusColor = GRAY_COLOR; 
    }
    
    return (
        <View style={[styles.scheduleCardNew, { borderLeftColor: statusColor }]}>
            <View style={styles.scheduleTimeBlockNew}>
                <Text style={styles.scheduleDayNew}>{item.date}</Text>
                <Text style={styles.scheduleTimeNew}>{item.time}</Text>
            </View>
            <View style={styles.scheduleInfoNew}>
                <Text style={styles.scheduleClassNameNew}>{item.className}</Text>
                <Text style={styles.scheduleCourseNameNew}>{item.courseName}</Text>
            </View>
            <View style={[styles.statusPillNew, { backgroundColor: statusColor }]}>
                <Text style={styles.statusPillTextNew}>{item.status}</Text>
            </View>
        </View>
    );
};

// --- COMPONENT PHỤ: HÀNG ĐIỂM SỐ ---
const GradeRow = ({ item }: { item: GradeItem }) => (
    <View style={styles.gradeRowNew}>
        <View style={[styles.gradeStatusCircle, { backgroundColor: item.passed ? PASS_COLOR : MAIN_SECONDARY_COLOR }]}>
             <Ionicons 
                name={item.passed ? "checkmark-sharp" : "close-sharp"} 
                size={16} 
                color="white" 
            />
        </View>
        <View style={styles.gradeAssignmentInfoNew}>
            <Text style={styles.assignmentNameNew}>{item.assignment}</Text>
            <Text style={styles.assignmentWeightNew}>Trọng số: {item.weight}</Text>
        </View>
        <View style={styles.gradeValueContainerNew}>
            <Text style={[styles.gradeValueNew, { color: item.passed ? PASS_COLOR : MAIN_SECONDARY_COLOR }]}>
                {item.grade.toFixed(1)}
            </Text>
            <Text style={styles.gradeMaxNew}>/ {item.max.toFixed(0)}</Text>
        </View>
    </View>
);
// ---------------------------------------------


export default function HocVienScheduleScreen() {
    const [selectedView, setSelectedView] = useState<'schedule' | 'grades'>('schedule');

    const { totalAverage, passedAssignments, totalGradedAssignments, progressPercent } = useMemo(() => {
        const gradedItems = STUDENT_GRADES.filter(item => item.max > 0 && item.grade > 0);
        
        const total = gradedItems.reduce((sum, item) => sum + item.grade, 0);
        const totalGradedAssignments = gradedItems.length;
        const passedAssignments = gradedItems.filter(item => item.passed).length;
        
        // Giả lập Progress Percent (Ví dụ: Dựa trên số bài tập đã hoàn thành)
        const totalAssignments = STUDENT_GRADES.length;
        const percent = totalAssignments > 0 ? totalGradedAssignments / totalAssignments : 0;

        return {
            totalAverage: totalGradedAssignments > 0 ? (total / totalGradedAssignments).toFixed(2) : 'N/A',
            passedAssignments: passedAssignments,
            totalGradedAssignments: totalGradedAssignments,
            progressPercent: percent, // Cần 75% cho hiển thị đẹp
        };
    }, []);
    
    // --- RENDER COMPONENT ---
    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Lịch Học & Điểm' }} />
            
            {/* PHẦN 1: WIDGET TỔNG QUAN (ĐÃ SỬA LỖI VÒNG TRÒN) */}
            <View style={styles.overviewWidget}>
                <Text style={styles.widgetTitle}>Tiến độ Môn học Hiện tại</Text>
                <View style={styles.widgetContentRow}>
                    
                    {/* Progress Ring TĨNH - ĐÃ SỬA LỖI */}
                    <View style={styles.progressRingStatic}>
                        <Text style={styles.progressText}>75%</Text>
                        <Text style={styles.progressSubText}>Hoàn thành</Text>
                    </View>
                    
                    {/* Metrics Nhanh */}
                    <View style={styles.quickMetrics}>
                        <Text style={[styles.quickMetricValue, {color: MAIN_SECONDARY_COLOR}]}>{totalAverage}</Text>
                        <Text style={styles.quickMetricLabel}>ĐTB Môn</Text>
                        <View style={styles.divider} />
                        <Text style={[styles.quickMetricValue, {color: PASS_COLOR}]}>{passedAssignments}/{totalGradedAssignments}</Text>
                        <Text style={styles.quickMetricLabel}>Bài tập Đạt</Text>
                    </View>
                </View>
            </View>


            {/* 2. THANH CHỌN CHẾ ĐỘ XEM */}
            <View style={styles.segmentedControlContainer}>
                <TouchableOpacity 
                    style={[styles.segmentButton, selectedView === 'schedule' && styles.segmentButtonActive]}
                    onPress={() => setSelectedView('schedule')}
                >
                    <Ionicons name="calendar-outline" size={20} color={selectedView === 'schedule' ? 'white' : ACCENT_COLOR} />
                    <Text style={[styles.segmentText, selectedView === 'schedule' && styles.segmentTextActive]}>Lịch Học</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.segmentButton, selectedView === 'grades' && styles.segmentButtonActive]}
                    onPress={() => setSelectedView('grades')}
                >
                    <MaterialCommunityIcons name="medal-outline" size={20} color={selectedView === 'grades' ? 'white' : ACCENT_COLOR} />
                    <Text style={[styles.segmentText, selectedView === 'grades' && styles.segmentTextActive]}>Bảng Điểm</Text>
                </TouchableOpacity>
            </View>

            {/* 3. KHU VỰC HIỂN THỊ NỘI DUNG */}
            <ScrollView style={styles.listArea}>
                
                {/* --- GRADES VIEW --- */}
                {selectedView === 'grades' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitleNew}>Chi tiết Điểm số</Text>
                        <FlatList
                            data={STUDENT_GRADES}
                            keyExtractor={item => item.assignment}
                            renderItem={({ item }) => <GradeRow item={item} />}
                            scrollEnabled={false}
                            ListEmptyComponent={<Text style={styles.emptyText}>Chưa có điểm nào được cập nhật.</Text>}
                        />
                         <TouchableOpacity style={styles.viewFullGradeButton}>
                            <Text style={styles.viewFullGradeText}>Xem toàn bộ học phần</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* --- SCHEDULE VIEW --- */}
                {selectedView === 'schedule' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitleNew}>Lịch học Sắp tới</Text>
                        <FlatList
                            data={CLASS_SCHEDULE}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => <ScheduleCard item={item} />}
                            scrollEnabled={false}
                            ListEmptyComponent={<Text style={styles.emptyText}>Không có lịch học nào.</Text>}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    
    // 1. WIDGET OVERVIEW
    overviewWidget: {
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginTop: 15,
        padding: 20,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderLeftWidth: 5,
        borderLeftColor: ACCENT_COLOR,
    },
    widgetTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    widgetContentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    
    // Progress Ring TĨNH (ĐÃ FIX LỖI)
    progressRingStatic: { 
        width: 110, 
        height: 110, 
        borderRadius: 55, 
        backgroundColor: ACCENT_COLOR + '20', // Màu nền nhẹ
        borderWidth: 8,
        borderColor: ACCENT_COLOR + '50', // Viền màu
        justifyContent: 'center', 
        alignItems: 'center',
    },
    progressText: { fontSize: 26, fontWeight: '900', color: ACCENT_COLOR },
    progressSubText: { fontSize: 11, color: '#666', marginTop: 3 },
    
    // Metrics Nhanh
    quickMetrics: { width: '45%', justifyContent: 'center', alignItems: 'center' },
    quickMetricValue: { fontSize: 24, fontWeight: 'bold', color: MAIN_SECONDARY_COLOR },
    quickMetricLabel: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 3 },
    divider: { height: 1, width: '60%', backgroundColor: '#eee', marginVertical: 10 },

    // 2. Segmented Control
    segmentedControlContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: ACCENT_COLOR + '50',
    },
    segmentButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8 },
    segmentButtonActive: { backgroundColor: ACCENT_COLOR },
    segmentText: { fontSize: 16, fontWeight: 'bold', color: ACCENT_COLOR, marginLeft: 8 },
    segmentTextActive: { color: 'white' },

    // 3. Nội dung & Danh sách
    listArea: { flex: 1, paddingHorizontal: 15 },
    section: { padding: 15, backgroundColor: 'white', borderRadius: 10, elevation: 2, shadowOpacity: 0.1, marginBottom: 15 },
    sectionTitleNew: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },

    // Schedule Card New
    scheduleCardNew: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderLeftWidth: 4,
        marginBottom: 8,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    scheduleTimeBlockNew: { width: 90, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#eee', marginRight: 10 },
    scheduleDayNew: { fontSize: 12, color: '#666' },
    scheduleTimeNew: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 2 },
    scheduleInfoNew: { flex: 1, marginLeft: 15 },
    scheduleClassNameNew: { fontSize: 16, fontWeight: '700', color: '#333' },
    scheduleCourseNameNew: { fontSize: 13, color: '#999', marginTop: 3 },
    statusPillNew: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 15, overflow: 'hidden' },
    statusPillTextNew: { color: 'white', fontSize: 12, fontWeight: 'bold' },

    // Grade Rows (New Styles)
    gradeRowNew: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
    },
    gradeStatusCircle: {
        width: 25, height: 25, borderRadius: 12.5, 
        justifyContent: 'center', alignItems: 'center', marginRight: 10,
    },
    gradeAssignmentInfoNew: { flex: 1, marginLeft: 10 },
    assignmentNameNew: { fontSize: 16, fontWeight: '600', color: '#333' },
    assignmentWeightNew: { fontSize: 12, color: '#999', marginTop: 3 },
    gradeValueContainerNew: { minWidth: 80, alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'baseline' },
    gradeValueNew: { fontSize: 18, fontWeight: 'bold' },
    gradeMaxNew: { fontSize: 12, color: '#999', marginLeft: 5 },
    
    viewFullGradeButton: { 
        paddingVertical: 10, 
        marginTop: 15, 
        borderTopWidth: 1, 
        borderTopColor: '#eee',
        alignItems: 'center'
    },
    viewFullGradeText: { color: ACCENT_COLOR, fontWeight: 'bold', fontSize: 15 },
    emptyText: { fontStyle: 'italic', color: '#999', textAlign: 'center', padding: 20 },
});