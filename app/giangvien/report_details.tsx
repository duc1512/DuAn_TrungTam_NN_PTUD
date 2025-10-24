import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Lấy chiều rộng màn hình
const screenWidth = Dimensions.get('window').width;

// --- DỮ LIỆU GIẢ ĐỊNH ---
interface TeachingLog {
    id: number;
    date: string;
    className: string;
    duration: number; // Thời lượng tính bằng phút
    status: 'Completed' | 'Cancelled';
}

const REPORT_TITLE = "Báo cáo Giờ Công Tháng 10";
const TEACHER_PAYRATE = 450000; // 450,000 VNĐ/giờ
const FIXED_HOURS = 125; 

// 🔥 HÀM ĐÃ SỬA: Tăng số buổi lên 93 để bù trừ cho 10% bị hủy (93 * 90 phút / 60 ≈ 140 giờ lập lịch)
const generateMockLogs = (targetHours: number): TeachingLog[] => {
    const logs: TeachingLog[] = [];
    const MINUTES_PER_SESSION = 90;
    // Cần khoảng 93 buổi để tổng số hoàn thành đạt 125 giờ
    const SESSIONS_REQUIRED = 93; 

    const baseClasses = ['IELTS Writing (G3)', 'Ngữ Pháp Nâng Cao', 'TOEIC Giao Tiếp (B2)'];
    let currentDate = new Date('2025-10-01');

    for (let i = 0; i < SESSIONS_REQUIRED; i++) {
        currentDate.setDate(currentDate.getDate() + (i % 2 === 0 ? 1 : 2)); 

        logs.push({
            id: i + 1,
            date: currentDate.toISOString().split('T')[0],
            className: baseClasses[i % baseClasses.length],
            duration: MINUTES_PER_SESSION,
            status: (i % 10 === 7) ? 'Cancelled' : 'Completed', // 10% hủy
        });
    }
    return logs;
};

const MONTHLY_LOGS: TeachingLog[] = generateMockLogs(FIXED_HOURS);
const MAIN_COLOR = '#ff7043'; 


// --- COMPONENT PHỤ: Thẻ Chi tiết Buổi dạy ---
const LogItemCard: React.FC<{ item: TeachingLog }> = ({ item }) => {
    const isCancelled = item.status === 'Cancelled';
    const timeInHours = item.duration / 60; 
    const statusColor = isCancelled ? '#dc3545' : '#28a745';
    const icon = isCancelled ? 'calendar-remove-outline' : 'calendar-check-outline';

    return (
        <View style={[styles.logCard, isCancelled && styles.logCardCancelled]}>
            <MaterialCommunityIcons name={icon as any} size={24} color={statusColor} style={styles.logIcon} />
            
            <View style={styles.logInfo}>
                <Text style={styles.logClassName}>{item.className}</Text>
                <Text style={styles.logDate}>
                    <Ionicons name="calendar-outline" size={12} /> {new Date(item.date).toLocaleDateString('vi-VN')}
                </Text>
            </View>
            
            <View style={styles.logDuration}>
                <Text style={[styles.durationValue, {color: statusColor}]}>
                    {timeInHours.toFixed(1)} {isCancelled ? '—' : 'giờ'}
                </Text>
                <Text style={styles.durationUnit}>{isCancelled ? 'Đã hủy' : 'Hoàn thành'}</Text>
            </View>
        </View>
    );
};
// ---------------------------------------------


export default function GiangVienReportDetailsScreen() {
    const router = useRouter(); 

    // Tính tổng giờ công thực tế (chỉ tính Completed)
    const totalDurationMinutes = useMemo(() => {
        return MONTHLY_LOGS.filter(log => log.status === 'Completed').reduce((sum, log) => sum + log.duration, 0);
    }, []);
    
    const totalTeachingHours = (totalDurationMinutes / 60).toFixed(1);
    const estimatedSalary = (totalDurationMinutes / 60 * TEACHER_PAYRATE).toLocaleString('vi-VN') + ' VNĐ';


    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Báo cáo Giờ Công' }} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>{REPORT_TITLE}</Text>
                <Text style={styles.headerSubtitle}>Sao kê chi tiết các buổi giảng dạy</Text>
            </View>
            
            {/* TÓM TẮT CHUNG */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Tổng Giờ công Hoàn thành</Text>
                <View style={styles.summaryRow}>
                    {/* 🔥 SỐ LIỆU ĐÃ ĐỒNG BỘ (≈ 125 Giờ) */}
                    <Text style={styles.totalHoursValue}>{totalTeachingHours} Giờ</Text>
                    <Text style={styles.salaryEstimate}>{estimatedSalary}</Text>
                </View>
            </View>

            {/* DANH SÁCH CHI TIẾT */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lịch sử Giao dịch (Chi tiết)</Text>
                <FlatList
                    data={MONTHLY_LOGS}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <LogItemCard item={item} />}
                    contentContainerStyle={styles.listContent}
                    style={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>Không có lịch sử công tác nào.</Text>}
                />
            </View>
            
            <TouchableOpacity style={styles.printButton} onPress={() => alert('Xuất Báo cáo dưới dạng PDF')}>
                <MaterialCommunityIcons name="export" size={20} color="white" />
                <Text style={styles.printButtonText}>XUẤT BÁO CÁO (PDF)</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    header: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 10 },
    headerTitle: { fontSize: 20, fontWeight: '900', color: MAIN_COLOR },
    headerSubtitle: { fontSize: 14, color: '#666', marginTop: 3 },
    
    // Summary Card
    summaryCard: {
        padding: 15,
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginBottom: 15,
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: MAIN_COLOR,
        elevation: 3,
        shadowOpacity: 0.1,
    },
    summaryTitle: { fontSize: 16, color: '#666' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 },
    totalHoursValue: { fontSize: 28, fontWeight: 'bold', color: MAIN_COLOR },
    salaryEstimate: { fontSize: 16, fontWeight: '600', color: '#28a745' },

    // Detail Log List
    section: { 
        flex: 1, 
        marginHorizontal: 10, 
        backgroundColor: 'white', 
        borderRadius: 10, 
        elevation: 1, 
        shadowOpacity: 0.05 
    },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    list: { flex: 1 },
    listContent: { paddingHorizontal: 15, paddingBottom: 15 },
    
    logCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
    },
    logCardCancelled: {
        opacity: 0.6,
        backgroundColor: '#fffafa'
    },
    logIcon: { marginRight: 15, width: 30 },
    logInfo: { flex: 1 },
    logClassName: { fontSize: 15, fontWeight: '600', color: '#333' },
    logDate: { fontSize: 12, color: '#666', marginTop: 3 },
    logDuration: { alignItems: 'flex-end' },
    durationValue: { fontSize: 16, fontWeight: 'bold' },
    durationUnit: { fontSize: 12, color: '#999', marginTop: 2 },
    
    emptyText: { textAlign: 'center', padding: 20, color: '#666' },

    // Print Button
    printButton: {
        flexDirection: 'row',
        backgroundColor: '#007bff',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 10,
        elevation: 5,
    },
    printButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 10,
    }
});