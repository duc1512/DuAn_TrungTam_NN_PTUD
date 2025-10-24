import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit"; // Cần cài đặt react-native-chart-kit

// Lấy chiều rộng màn hình
const screenWidth = Dimensions.get('window').width;

// --- DỮ LIỆU GIẢ ĐỊNH ---
const TEACHER_PAYRATE = 450000; // 450,000 VNĐ/giờ
const FIXED_HOURS = 125; // Giờ công cố định

const calculateSalary = (hours: number) => {
    return (hours * TEACHER_PAYRATE).toLocaleString('vi-VN') + ' VNĐ';
};

const SALARY_METRICS = {
    totalHours: FIXED_HOURS,
    estimatedSalary: calculateSalary(FIXED_HOURS),
    averageRate: '4.5/5',
};

// Dữ liệu biểu đồ (Mô phỏng 6 tháng gần nhất)
const HOURS_CHART_DATA = {
    labels: ["T5", "T6", "T7", "T8", "T9", "T10"],
    datasets: [
        {
            data: [100, 110, 140, 135, 120, 125], // Giờ công hàng tháng
            color: (opacity = 1) => `rgba(255, 112, 67, ${opacity})`, // Màu cam chủ đạo
            strokeWidth: 2
        }
    ],
};


export default function GiangVienPayrollScreen() {
    const router = useRouter(); 

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForDots: { r: "5", strokeWidth: "2", stroke: '#ff7043' },
        fillShadowGradient: '#ff7043',
        fillShadowGradientOpacity: 0.1,
    };
    
    // 🔥 HÀM ĐIỀU HƯỚNG MỚI: Trỏ đến trang báo cáo chi tiết
    const handleViewReportDetails = () => {
        // Giả định trang báo cáo chi tiết là /giangvien/report_details
        router.push('/giangvien/report_details'); 
    };

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{paddingBottom: 30}}>
            <Stack.Screen options={{ title: 'Giờ Công & Lương' }} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bảng Tổng kết Công tác Giảng dạy</Text>
            </View>

            {/* PHẦN 1: THỐNG KÊ TỔNG QUAN */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Chỉ số Tổng hợp Tháng 10</Text>
                
                <View style={styles.metricsRow}>
                    {/* Metric 1: TỔNG GIỜ CÔNG (125 GIỜ) */}
                    <View style={styles.metricCard}>
                        <MaterialCommunityIcons name="clock-check-outline" size={30} color="#007bff" />
                        <Text style={styles.metricValue}>{SALARY_METRICS.totalHours}</Text>
                        <Text style={styles.metricLabel}>Tổng Giờ công</Text>
                    </View>
                    
                    {/* Metric 2: LƯƠNG DỰ KIẾN */}
                    <View style={styles.metricCard}>
                        <MaterialCommunityIcons name="cash-multiple" size={30} color="#28a745" />
                        <Text style={[styles.metricValue, { fontSize: 16, color: '#28a745' }]} numberOfLines={1}>
                            {SALARY_METRICS.estimatedSalary}
                        </Text>
                        <Text style={styles.metricLabel}>Lương Dự kiến (Gross)</Text>
                    </View>
                    
                    {/* Metric 3: ĐÁNH GIÁ TRUNG BÌNH */}
                    <View style={styles.metricCard}>
                        <Ionicons name="star-outline" size={30} color="#ffc107" />
                        <Text style={styles.metricValue}>{SALARY_METRICS.averageRate}</Text>
                        <Text style={styles.metricLabel}>Đánh giá GV</Text>
                    </View>
                </View>
            </View>
            
            {/* PHẦN 2: BIỂU ĐỒ GIỜ CÔNG */}
            <View style={styles.chartSection}>
                <Text style={styles.chartTitle}>Phân tích Giờ Công 6 Tháng Gần Nhất</Text>
                
                <LineChart
                    data={HOURS_CHART_DATA}
                    width={screenWidth - 40} 
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 10
                    }}
                />
            </View>
            
            {/* PHẦN 3: PHÂN TÍCH THEO LỚP (Báo cáo chi tiết) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Chi tiết Giờ công theo Lớp</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>IELTS Writing (G3)</Text>
                    <Text style={styles.detailValue}>25 giờ</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>TOEIC Giao Tiếp (B2)</Text>
                    <Text style={styles.detailValue}>40 giờ</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Ngữ Pháp Nâng Cao</Text>
                    <Text style={styles.detailValue}>60 giờ</Text>
                </View>
                {/* 🔥 GỌI HÀM ĐIỀU HƯỚNG MỚI */}
                <TouchableOpacity 
                    style={styles.viewFullReportButton} 
                    onPress={handleViewReportDetails}
                >
                    <MaterialCommunityIcons name="file-chart-outline" size={20} color="#ff7043" />
                    <Text style={styles.viewFullReportText}>XEM SAO KÊ CHI TIẾT</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    header: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 10 },
    headerTitle: { fontSize: 20, fontWeight: '900', color: '#333' },
    
    section: { padding: 15, backgroundColor: 'white', marginHorizontal: 10, marginBottom: 15, borderRadius: 10, elevation: 2, shadowOpacity: 0.1 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
    
    // PHẦN 1: METRICS
    metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
    metricCard: { 
        width: '31%', 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center', 
        backgroundColor: '#f9f9f9', 
        borderWidth: 1, 
        borderColor: '#eee' 
    },
    metricValue: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 5, textAlign: 'center' },
    metricLabel: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 3 },

    // PHẦN 2: CHART
    chartSection: { marginHorizontal: 10, marginBottom: 15, backgroundColor: 'white', borderRadius: 10, padding: 10, elevation: 2, shadowOpacity: 0.1 },
    chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', paddingLeft: 5, marginBottom: 5 },

    // PHẦN 3: DETAIL ROWS
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f7f7f7' },
    detailLabel: { fontSize: 15, color: '#333', fontWeight: '500' },
    detailValue: { fontSize: 15, color: '#ff7043', fontWeight: 'bold' },
    
    // NÚT BÁO CÁO CHI TIẾT
    viewFullReportButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginTop: 10, backgroundColor: '#fff5e6', borderRadius: 8, borderWidth: 1, borderColor: '#ff7043' },
    viewFullReportText: { color: '#ff7043', fontWeight: 'bold', marginLeft: 10, fontSize: 15 },
});