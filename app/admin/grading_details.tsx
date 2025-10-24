import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// DỮ LIỆU MẪU: Học viên và kết quả học tập
const MOCK_STUDENT_GRADES = [
    { id: 'HV2001', name: 'Nguyễn Văn A', midterm: 7.5, final: 8.0, overall: 7.8, status: 'Đạt' },
    { id: 'HV2002', name: 'Trần Thị B', midterm: 6.0, final: 5.5, overall: 5.8, status: 'Chưa đạt' },
    { id: 'HV2003', name: 'Phạm Văn C', midterm: 9.0, final: 9.5, overall: 9.3, status: 'Đạt' },
    { id: 'HV2004', name: 'Lê Thị D', midterm: 7.0, final: 7.0, overall: 7.0, status: 'Đạt' },
];

export default function GradingDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    // Lấy thông tin lớp học từ tham số
    const className = params.className as string || "Lớp [Không xác định]";
    const classId = params.classId as string;
    
    // Tính toán chỉ số tổng quan
    const summary = useMemo(() => {
        const totalStudents = MOCK_STUDENT_GRADES.length;
        const passed = MOCK_STUDENT_GRADES.filter(s => s.status === 'Đạt').length;
        const avgScore = MOCK_STUDENT_GRADES.reduce((sum, s) => sum + s.overall, 0) / totalStudents;
        
        return { totalStudents, passed, avgScore: avgScore.toFixed(2) };
    }, []);

    const handleAction = (action: string) => {
        alert(`Thực hiện chức năng: ${action}`);
    };

    const CustomHeaderLeft = () => (
        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <Ionicons name="arrow-back" size={24} color="#333" /> 
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Kết quả Lớp học' }} headerLeft={CustomHeaderLeft} /> 
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* THẺ TỔNG QUAN LỚP HỌC */}
                <View style={[styles.card, styles.headerCard]}>
                    <Text style={styles.classTitle}>{className} ({classId})</Text>
                    <Text style={styles.classSubtitle}>Báo cáo kết quả học tập</Text>
                </View>

                {/* METRICS ĐIỂM SỐ */}
                <View style={styles.metricsContainer}>
                    {/* Metric 1: Điểm trung bình */}
                    <View style={styles.metricCard}>
                        <MaterialCommunityIcons name="star-circle-outline" size={30} color="#ff7043" />
                        <Text style={styles.metricValue}>{summary.avgScore}</Text>
                        <Text style={styles.metricLabel}>Điểm TB Lớp</Text>
                    </View>
                    {/* Metric 2: Tỷ lệ Đạt */}
                    <View style={[styles.metricCard, { backgroundColor: '#e6ffe6' }]}>
                        <MaterialCommunityIcons name="check-circle-outline" size={30} color="#28a745" />
                        <Text style={[styles.metricValue, { color: '#28a745' }]}>{summary.passed}</Text>
                        <Text style={styles.metricLabel}>Số HV Đạt</Text>
                    </View>
                    {/* Metric 3: Tổng HV */}
                    <View style={[styles.metricCard, { backgroundColor: '#e6f0ff' }]}>
                        <Ionicons name="people-outline" size={30} color="#007bff" />
                        <Text style={styles.metricValue}>{summary.totalStudents}</Text>
                        <Text style={styles.metricLabel}>Tổng HV</Text>
                    </View>
                </View>

                {/* BẢNG ĐIỂM CHI TIẾT */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Bảng Điểm Học viên</Text>
                    
                    {/* HEADER BẢNG */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableColName, { fontWeight: 'bold' }]}>Tên Học viên</Text>
                        <Text style={styles.tableColScore}>Giữa kỳ</Text>
                        <Text style={styles.tableColScore}>Cuối kỳ</Text>
                        <Text style={styles.tableColStatus}>Tổng kết</Text>
                    </View>

                    {/* DỮ LIỆU */}
                    {MOCK_STUDENT_GRADES.map((student) => (
                        <TouchableOpacity key={student.id} style={styles.tableRow} onPress={() => alert(`Xem chi tiết điểm của ${student.name}`)}>
                            <Text style={styles.tableColName}>{student.name}</Text>
                            <Text style={styles.tableColScore}>{student.midterm.toFixed(1)}</Text>
                            <Text style={styles.tableColScore}>{student.final.toFixed(1)}</Text>
                            <Text style={[styles.tableColStatus, student.status === 'Đạt' ? styles.statusPass : styles.statusFail]}>
                                {student.overall.toFixed(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                {/* NÚT HÀNH ĐỘNG CUỐI */}
               
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f5f5f5' },
    scrollContent: { padding: 15 },
    
    // Header
    headerCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
    },
    classTitle: { fontSize: 22, fontWeight: '900', color: '#333' },
    classSubtitle: { fontSize: 14, color: '#999', marginTop: 5 },
    
    // Metrics
    metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginHorizontal: 5 },
    metricCard: {
        width: '32%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
    },
    metricValue: { fontSize: 20, fontWeight: 'bold', color: '#ff7043', marginTop: 5 },
    metricLabel: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 3 },

    // Card & Title
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 15,
    },
    
    // Table Styles
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
    },
    tableHeader: {
        backgroundColor: '#e6f0ff',
        paddingHorizontal: 5,
        borderRadius: 5,
        marginBottom: 5,
    },
    tableColName: { flex: 2, fontSize: 15, color: '#333', paddingLeft: 5 },
    tableColScore: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '600', color: '#555' },
    tableColStatus: { flex: 1.5, textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
    
    statusPass: { color: '#28a745' },
    statusFail: { color: '#dc3545' },

    // Action Buttons
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        marginBottom: 30,
    },
    reportButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#007bff',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        elevation: 5,
    },
    reportButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 8,
    }
});