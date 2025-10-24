import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit"; // Import LineChart

// Lấy chiều rộng màn hình để điều chỉnh kích thước biểu đồ
const screenWidth = Dimensions.get("window").width;

// --- DỮ LIỆU VÀ INTERFACE ---

// 🔥 KHẮC PHỤC LỖI: Định nghĩa kiểu dữ liệu cho Metric Item
interface MetricItem {
    label: string;
    value: string | number;
    color: string;
    icon: string;
}

// Định nghĩa các key hợp lệ cho GENERAL_METRICS
type ReportCategoryKey = 'finance' | 'enrollment' | 'teaching';

const REPORT_CATEGORIES = [
    { key: 'finance', label: 'Báo cáo Tài chính', icon: 'credit-card-outline' },
    { key: 'enrollment', label: 'Tuyển sinh & Học viên', icon: 'account-group-outline' },
    { key: 'teaching', label: 'Hiệu suất Giảng dạy', icon: 'school-outline' },
];

// Định kiểu GENERAL_METRICS là Record
const GENERAL_METRICS: Record<ReportCategoryKey, MetricItem[]> = {
    finance: [
        { label: 'Doanh thu tháng', value: '125M', color: '#28a745', icon: 'cash-multiple' },
        { label: 'Công nợ', value: '45M', color: '#dc3545', icon: 'alert-circle-outline' },
        { label: 'Học phí đã thu', value: '85%', color: '#007bff', icon: 'check-bold' },
    ],
    enrollment: [
        { label: 'HV Mới (Tháng)', value: 45, color: '#007bff', icon: 'account-plus-outline' },
        { label: 'Tổng HV', value: 650, color: '#ff7043', icon: 'account-group-outline' },
        { label: 'Tỉ lệ giữ chân', value: '92%', color: '#28a745', icon: 'percent-outline' },
    ],
    teaching: [
        { label: 'Lớp Active', value: 55, color: '#28a745', icon: 'google-classroom' },
        { label: 'Lớp Mở (Tháng)', value: 8, color: '#007bff', icon: 'calendar-plus-outline' },
        { label: 'Điểm trung bình', value: '8.2/10', color: '#ffc107', icon: 'star-outline' },
    ],
};

// --- DỮ LIỆU BIỂU ĐỒ MÔ PHỎNG ---
const FINANCE_CHART_DATA = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
        { data: [20, 45, 28, 80, 99, 43], color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, strokeWidth: 2 }
    ],
    legend: ["Doanh thu"]
};

const ENROLLMENT_CHART_DATA = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
    datasets: [
        { data: [5, 12, 8, 15, 10, 20], color: (opacity = 1) => `rgba(255, 112, 67, ${opacity})`, strokeWidth: 2 }
    ],
    legend: ["HV Mới"]
};

// 🔥 SỬA LỖI: Định kiểu prop `metric` trong component phụ
const MetricCard: React.FC<{ metric: MetricItem }> = ({ metric }) => (
    <View style={styles.metricCard}>
        <MaterialCommunityIcons name={metric.icon as any} size={30} color={metric.color} />
        <Text style={[styles.metricValue, {color: metric.color}]}>{metric.value}</Text>
        <Text style={styles.metricLabel}>{metric.label}</Text>
    </View>
);

// --- COMPONENT CHÍNH ---
export default function AdminReportsScreen() {
    const router = useRouter(); 
    // Khởi tạo State với kiểu dữ liệu chính xác
    const [selectedCategory, setSelectedCategory] = useState<ReportCategoryKey>(REPORT_CATEGORIES[0].key);

    const currentMetrics = useMemo(() => {
        return GENERAL_METRICS[selectedCategory] || [];
    }, [selectedCategory]);

    // Lựa chọn dữ liệu biểu đồ dựa trên danh mục được chọn
    const currentChartData = useMemo(() => {
        if (selectedCategory === 'finance') {
            return FINANCE_CHART_DATA;
        } else if (selectedCategory === 'enrollment') {
            return ENROLLMENT_CHART_DATA;
        }
        return { labels: [], datasets: [{ data: [] }] }; 
    }, [selectedCategory]);
    
    // Cấu hình chung cho biểu đồ
    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForDots: { r: "6", strokeWidth: "2", stroke: "#007bff" },
        fillShadowGradient: `rgba(0, 123, 255, 0.2)`,
        fillShadowGradientOpacity: 0.1,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        linejoinType: 'round',
        strokeWidth: 2,
        backgroundGradientFromOpacity: 0.8,
        backgroundGradientToOpacity: 0.2,
    };


    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen options={{ title: 'Trung tâm Báo cáo' }} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Trung tâm Báo cáo & Phân tích</Text>
            </View>

            {/* PHẦN 1: THANH CHỌN BÁO CÁO */}
            <View style={styles.categoryContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {REPORT_CATEGORIES.map((category) => (
                        <TouchableOpacity 
                            key={category.key} 
                            style={[
                                styles.categoryPill, 
                                selectedCategory === category.key && styles.categoryPillActive
                            ]}
                            onPress={() => setSelectedCategory(category.key as ReportCategoryKey)}
                        >
                            <MaterialCommunityIcons 
                                name={category.icon as any} 
                                size={18} 
                                color={selectedCategory === category.key ? 'white' : '#666'}
                            />
                            <Text style={[
                                styles.categoryText, 
                                selectedCategory === category.key && styles.categoryTextActive
                            ]}>
                                {category.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* PHẦN 2: METRICS TỔNG HỢP */}
            <Text style={styles.sectionTitle}>
                Chỉ số Tổng quan ({REPORT_CATEGORIES.find(c => c.key === selectedCategory)?.label})
            </Text>
            <View style={styles.metricsRow}>
                {currentMetrics.map(metric => (
                    <MetricCard key={metric.label} metric={metric} />
                ))}
            </View>

            {/* PHẦN 3: HIỂN THỊ BIỂU ĐỒ THỰC TẾ */}
            <View style={styles.chartSection}>
                <Text style={styles.chartTitle}>Biểu đồ {REPORT_CATEGORIES.find(c => c.key === selectedCategory)?.label}</Text>
                
                {currentChartData.labels.length > 0 ? (
                    <LineChart
                        data={currentChartData}
                        width={screenWidth - 60} 
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 10
                        }}
                    />
                ) : (
                    <View style={styles.chartPlaceholder}>
                        <Ionicons name="bar-chart-outline" size={50} color="#ccc" />
                        <Text style={styles.placeholderText}>Chưa có dữ liệu biểu đồ cho danh mục này.</Text>
                    </View>
                )}
            </View>
            
            <View style={{height: 50}} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    header: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 10 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },
    
    // 1. Category Selector
    categoryContainer: { paddingVertical: 10, backgroundColor: 'white', marginBottom: 10 },
    categoryPill: { 
        flexDirection: 'row', 
        alignItems: 'center',
        paddingVertical: 10, 
        paddingHorizontal: 15, 
        borderRadius: 20, 
        backgroundColor: '#eee', 
        marginHorizontal: 5 
    },
    categoryPillActive: { backgroundColor: '#007bff' },
    categoryText: { color: '#666', marginLeft: 8, fontWeight: '600', fontSize: 13 },
    categoryTextActive: { color: 'white' },

    // 2. Metrics
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10, marginBottom: 10, paddingHorizontal: 15 },
    metricsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 },
    metricCard: { 
        width: '31%', // Đảm bảo 3 thẻ vừa đủ với khoảng cách
        backgroundColor: '#fff', 
        borderRadius: 10, 
        padding: 15, 
        alignItems: 'center', 
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 2,
        shadowOpacity: 0.1,
    },
    metricValue: { fontSize: 22, fontWeight: 'bold', marginTop: 5 },
    metricLabel: { fontSize: 11, color: '#666', textAlign: 'center', marginTop: 3 },
    
    // 3. Chart Section
    chartSection: { 
        marginHorizontal: 15, 
        backgroundColor: 'white', 
        borderRadius: 10, 
        padding: 15, 
        marginBottom: 15,
        elevation: 2,
        shadowOpacity: 0.1,
    },
    chartTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 10 },
    chartPlaceholder: {
        height: 220, // Giữ chiều cao cố định
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'dashed',
    },
    placeholderText: { color: '#999', marginTop: 10 },
});