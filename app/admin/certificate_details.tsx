import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- DỮ LIỆU GIẢ ĐỊNH ---
interface Certificate {
    id: string;
    studentName: string;
    courseName: string;
    issueDate: string; // YYYY-MM-DD hoặc N/A
    status: 'Ready' | 'Issued' | 'Pending'; // Sẵn sàng, Đã cấp, Chờ
    grade: number; // Điểm cuối khóa
    certificateID?: string; // Mã chứng chỉ thực tế
}

const CERTIFICATE_DATA: Certificate[] = [
    { id: 'C001', studentName: 'Nguyễn Văn A', courseName: 'IELTS Mastery 7.0', issueDate: '2025-05-15', status: 'Issued', grade: 8.5, certificateID: 'TDD-IEL-987' },
    { id: 'C002', studentName: 'Trần Thị B', courseName: 'TOEIC Cấp tốc 600+', issueDate: '2025-06-01', status: 'Ready', grade: 7.0, certificateID: 'N/A' },
    { id: 'C003', studentName: 'Lê Văn C', courseName: 'Giao Tiếp Cơ Bản (A1)', issueDate: 'N/A', status: 'Pending', grade: 6.2, certificateID: 'N/A' },
    { id: 'C004', studentName: 'Phạm Thị D', courseName: 'Business English B2', issueDate: '2025-08-20', status: 'Issued', grade: 9.1, certificateID: 'TDD-B2-045' },
    { id: 'C005', studentName: 'Võ Minh E', courseName: 'IELTS Mastery 7.0', issueDate: 'N/A', status: 'Ready', grade: 8.8, certificateID: 'N/A' },
];

const STATUS_COLORS_MAP = {
    'Ready': { background: '#28a745', color: 'white', label: 'Sẵn sàng cấp' },
    'Issued': { background: '#007bff', color: 'white', label: 'Đã cấp' },
    'Pending': { background: '#ffc107', color: '#333', label: 'Chờ điểm' },
};

// Hàm tìm kiếm chứng chỉ
const findCertificateById = (id: string) => {
    return CERTIFICATE_DATA.find(cert => cert.id === id);
};

// --- COMPONENT PHỤ: HIỂN THỊ HÀNG THÔNG TIN ---
interface DetailRowProps {
    icon: keyof typeof Ionicons.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    value: string | number | JSX.Element;
    color: string;
}
const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, color }) => (
    <View style={styles.detailRow}>
        <Ionicons name={icon as any} size={20} color={color} style={{marginRight: 10}} />
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);
// ---------------------------------------------


export default function AdminCertificateDetailsScreen() {
    const router = useRouter();
    // 1. LẤY ID TỪ URL
    const { id } = useLocalSearchParams();
    const certId = id as string;

    // 2. TÌM KIẾM DỮ LIỆU
    const certDetail: Certificate | undefined = useMemo(() => {
        if (!certId) return undefined;
        return findCertificateById(certId);
    }, [certId]);

    if (!certDetail) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ title: "Không tìm thấy" }} />
                <Text style={styles.errorText}>Không tìm thấy Chứng chỉ.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{color: '#007bff'}}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const statusInfo = STATUS_COLORS_MAP[certDetail.status];
    const isReadyOrIssued = certDetail.status === 'Ready' || certDetail.status === 'Issued';

    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen 
                options={{ 
                    title: `Chi tiết: ${certDetail.studentName}`,
                    
                       
                    
                }} 
            />

            {/* PHẦN 1: HEADER & ĐIỂM SỐ CHÍNH */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chứng chỉ: {certDetail.courseName}</Text>
                <Text style={styles.headerStudent}>Học viên: {certDetail.studentName}</Text>
            </View>

            {/* PHẦN 2: METRICS & TRẠNG THÁI */}
            <View style={styles.metricsContainer}>
                {/* Metric 1: ĐIỂM CUỐI KHÓA */}
                <View style={[styles.metricCard, {backgroundColor: '#e6f0ff'}]}>
                    <Ionicons name="medal-outline" size={30} color="#007bff" />
                    <Text style={[styles.metricValue, {color: '#007bff'}]}>{certDetail.grade.toFixed(1)}</Text>
                    <Text style={styles.metricLabel}>Điểm Đạt</Text>
                </View>
                
                {/* Metric 2: TRẠNG THÁI CẤP PHÁT */}
                <View style={[styles.metricCard, {backgroundColor: statusInfo.background + '20'}]}>
                    <MaterialCommunityIcons name="tag-text-outline" size={30} color={statusInfo.background} />
                    <Text style={[styles.metricValue, {color: statusInfo.background, fontSize: 16}]}>
                        {statusInfo.label.toUpperCase()}
                    </Text>
                    <Text style={styles.metricLabel}>Trạng thái</Text>
                </View>

            </View>
            
            {/* PHẦN 3: THÔNG TIN CHI TIẾT */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Thông tin Chi tiết</Text>
                
                <DetailRow 
                    icon="receipt-outline" 
                    label="Mã chứng chỉ" 
                    value={certDetail.certificateID || 'Chưa cấp mã'} 
                    color="#333"
                />
                <DetailRow 
                    icon="calendar-outline" 
                    label="Ngày cấp" 
                    value={certDetail.issueDate === 'N/A' ? 'Chưa cấp' : certDetail.issueDate} 
                    color="#28a745"
                />
                <DetailRow 
                    icon="mail-outline" 
                    label="Email HV" 
                    value="nguyenvana@email.com" 
                    color="#dc3545"
                />
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
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 10,
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    headerStudent: { fontSize: 16, color: '#007bff', fontWeight: '600', marginTop: 5 },
    statusTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    // Card Style Chung
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
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
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 5,
    },

    // Metric Section
    metricsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 15, 
        marginBottom: 20,
    },
    metricCard: { 
        width: '48%', 
        borderRadius: 10, 
        padding: 15, 
        alignItems: 'center', 
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    metricValue: { fontSize: 20, fontWeight: 'bold', marginTop: 5 },
    metricLabel: { fontSize: 11, color: '#666', textAlign: 'center', marginTop: 3, fontWeight: '500' },

    // Detail Rows
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
    actionButtons: { padding: 15, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
    actionButton: { 
        padding: 12, 
        borderRadius: 8, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        elevation: 3,
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    mainActionButton: {
        flex: 1,
        backgroundColor: '#007bff',
        marginRight: 10,
    },
    secondaryActionButton: {
        flex: 0.8,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#007bff',
    },
    actionButtonText: { 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 14,
        marginLeft: 8
    },
});