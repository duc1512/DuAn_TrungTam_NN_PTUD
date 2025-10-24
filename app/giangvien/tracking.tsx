import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit"; // 🔥 IMPORT BẮT BUỘC

const screenWidth = Dimensions.get('window').width;

// --- DỮ LIỆU GIẢ ĐỊNH MỞ RỘNG ---
const FULL_STUDENT_DATA = [
    { name: "Nguyễn Văn A", score: 9.2, completion: 1.0 },
    { name: "Trần Thị B", score: 8.8, completion: 0.85 },
    { name: "Phạm Văn C", score: 8.5, completion: 0.75 },
    { name: "Lê Thị D", score: 8.2, completion: 0.90 },
    { name: "Hoàng Minh E", score: 7.9, completion: 0.60 },
    { name: "Đặng Tú F", score: 7.5, completion: 0.95 },
    { name: "Mai Văn G", score: 7.3, completion: 0.70 },
    { name: "Bùi Thị H", score: 7.1, completion: 0.80 },
    { name: "Vũ Đình K", score: 6.9, completion: 0.50 },
    { name: "Trịnh Thị L", score: 6.7, completion: 0.88 },
    { name: "Phan Văn M", score: 6.5, completion: 0.72 },
    { name: "Ngô Thị N", score: 6.3, completion: 0.65 },
    { name: "Hà Minh P", score: 6.0, completion: 0.40 },
    { name: "Châu Văn Q", score: 5.8, completion: 0.35 },
    { name: "Đoàn Thị R", score: 5.5, completion: 0.55 },
    { name: "Tô Văn S", score: 5.2, completion: 0.60 },
    { name: "Cao Thị T", score: 4.9, completion: 0.50 },
    { name: "Lý Đức U", score: 4.5, completion: 0.30 },
].sort((a, b) => b.score - a.score); 

const TRACKING_DATA = {
    className: "IELTS Writing (G3)",
    classId: "L101",
    totalAssignments: 4,
    completionRate: 0.85, // 85%
    avgScore: 7.8,
    passRate: 0.90, 
    fullStudentList: FULL_STUDENT_DATA,
    totalStudents: FULL_STUDENT_DATA.length,
};

// Dữ liệu cho Progress Chart
const progressData = {
    labels: ["Hoàn thành"],
    data: [TRACKING_DATA.completionRate],
};

const MAIN_COLOR = '#ff7043'; 
const SECONDARY_COLOR = '#28a745'; 
const PASS_SCORE = 7.0;


// Cấu hình biểu đồ
const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(255, 112, 67, ${opacity})`, // Màu cam (MAIN_COLOR)
    labelColor: () => 'transparent', // Ẩn label bên ngoài
    strokeWidth: 2,
};


// --- COMPONENT PHỤ: Thanh Tiến Trình Cá nhân ---
const StudentProgressBar: React.FC<{ name: string, score: number, completion: number, onPress: () => void }> = ({ name, score, completion, onPress }) => (
    <TouchableOpacity style={styles.studentProgressRow} onPress={onPress}>
        <View style={styles.studentInfo}>
            <Text style={styles.studentName} numberOfLines={1}>{name}</Text>
            <Text style={styles.completionText}>Hoàn thành: {(completion * 100).toFixed(0)}%</Text>
        </View>
        <View style={styles.scorePill}>
            <Text style={styles.scoreText}>{score.toFixed(1)}</Text>
        </View>
    </TouchableOpacity>
);


export default function GiangVienTrackingScreen() {
    const router = useRouter(); 
    const [showAllStudents, setShowAllStudents] = useState(false); 

    const studentsToRender = showAllStudents 
        ? TRACKING_DATA.fullStudentList 
        : TRACKING_DATA.fullStudentList.slice(0, 3); 

    const handleViewStudentDetails = (name: string) => {
        alert(`Xem chi tiết tiến độ của ${name}`);
    };
    
    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{paddingBottom: 50}}>
            <Stack.Screen options={{ title: 'Theo dõi Tiến độ' }} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Giám sát Tiến độ Lớp học</Text>
                <Text style={styles.classInfoText}>
                    Lớp: <Text style={{fontWeight: 'bold', color: MAIN_COLOR}}>{TRACKING_DATA.className}</Text>
                </Text>
            </View>

            {/* PHẦN 1: TỔNG QUAN TIẾN TRÌNH (PROGRESS CHART) */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Tỷ lệ Hoàn thành Bài tập</Text>
                <View style={styles.progressContainer}>
                    
                    {/* 🔥 RENDER PROGRESS CHART THỰC TẾ */}
                    <ProgressChart
                        data={progressData}
                        width={screenWidth - 60} 
                        height={180}
                        chartConfig={chartConfig}
                        hideLegend={true}
                    />
                    
                    <View style={styles.progressCenterText}>
                        <Text style={styles.progressPercent}>{(TRACKING_DATA.completionRate * 100).toFixed(0)}%</Text>
                        <Text style={styles.progressLabel}>Tổng Hoàn thành</Text>
                    </View>
                </View>
                
                {/* Metrics phụ */}
                <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricValuePrimary}>{TRACKING_DATA.avgScore.toFixed(1)}</Text>
                        <Text style={styles.metricLabelSecondary}>ĐTB Lớp</Text>
                    </View>
                    <View style={styles.metricItem}>
                        <Text style={[styles.metricValuePrimary, {color: SECONDARY_COLOR}]}>{(TRACKING_DATA.passRate * 100).toFixed(0)}%</Text>
                        <Text style={styles.metricLabelSecondary}>Tỷ lệ Đạt</Text>
                    </View>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricValuePrimary}>{TRACKING_DATA.totalAssignments}</Text>
                        <Text style={styles.metricLabelSecondary}>Học phần</Text>
                    </View>
                </View>
            </View>

            {/* PHẦN 2: HỌC VIÊN CÓ HIỆU SUẤT CAO NHẤT */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Danh sách Học viên (Điểm trung bình)</Text>
                
                {/* RENDER DANH SÁCH HỌC VIÊN */}
                {studentsToRender.map((student, index) => (
                    <StudentProgressBar 
                        key={index}
                        name={student.name}
                        score={student.score}
                        completion={student.completion}
                        onPress={() => handleViewStudentDetails(student.name)}
                    />
                ))}
                
                {/* NÚT TOGGLE DANH SÁCH */}
                <TouchableOpacity 
                    onPress={() => setShowAllStudents(prev => !prev)} 
                    style={styles.viewAllButton}
                >
                    <Text style={styles.viewAllStudents}>
                        {showAllStudents 
                            ? `Thu gọn Danh sách (${studentsToRender.length} HV) ▲` 
                            : `Xem toàn bộ Danh sách (${TRACKING_DATA.totalStudents} HV) >`}
                    </Text>
                </TouchableOpacity>
            </View>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    header: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 10 },
    headerTitle: { fontSize: 20, fontWeight: '900', color: '#333' },
    classInfoText: { fontSize: 16, color: '#666', marginTop: 5 },
    
    // Card Style
    card: { padding: 15, backgroundColor: 'white', marginHorizontal: 15, marginBottom: 15, borderRadius: 10, elevation: 3, shadowOpacity: 0.1 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },

    // PHẦN 1: PROGRESS CHART
    progressContainer: { 
        position: 'relative', 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    progressCenterText: {
        position: 'absolute',
        alignItems: 'center',
    },
    progressPercent: {
        fontSize: 30,
        fontWeight: 'bold',
        color: MAIN_COLOR,
    },
    progressLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 10,
    },
    metricItem: {
        alignItems: 'center',
        width: '30%',
    },
    metricValuePrimary: {
        fontSize: 20,
        fontWeight: 'bold',
        color: MAIN_COLOR,
    },
    metricLabelSecondary: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },

    // PHẦN 2: STUDENT PROGRESS LIST
    studentProgressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    completionText: {
        fontSize: 12,
        color: SECONDARY_COLOR,
        marginTop: 2,
    },
    scorePill: {
        backgroundColor: '#f0f3f5',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        minWidth: 55,
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    viewAllButton: {
        marginTop: 15,
        paddingTop: 5,
    },
    viewAllStudents: {
        textAlign: 'center',
        color: MAIN_COLOR,
        fontWeight: 'bold',
    }
});