import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- DỮ LIỆU GIẢ ĐỊNH VÀ HẰNG SỐ ---
const ACCENT_COLOR = '#007bff';
const PASS_COLOR = '#28a745';
const DANGER_COLOR = '#dc3545';
const WARNING_COLOR = '#ffc107';

interface Certificate {
    id: string;
    courseName: string;
    grade: number; // Điểm cuối khóa
    status: 'Issued' | 'Ready' | 'Expired'; // Đã cấp, Sẵn sàng, Hết hạn
    issueDate: string; // YYYY-MM-DD hoặc N/A
    certificateID: string;
    duration: string;
    teacher: string;
}

const CERTIFICATE_DATA: Certificate[] = [
    { id: 'C001', courseName: 'IELTS Mastery 7.0', grade: 8.5, status: 'Issued', issueDate: '2025-05-15', certificateID: 'TDD-IEL-987', duration: '90 giờ', teacher: 'Cô Tú Sương' },
    { id: 'C002', courseName: 'TOEIC Cấp tốc 600+', grade: 7.0, status: 'Ready', issueDate: '2025-06-01', certificateID: 'N/A', duration: '60 giờ', teacher: 'Thầy Lê Tùng' },
    { id: 'C003', courseName: 'Giao Tiếp Cơ Bản (A1)', grade: 6.2, status: 'Expired', issueDate: '2023-01-01', certificateID: 'TDD-A1-100', duration: '45 giờ', teacher: 'Cô Nguyễn Vy' },
];

const getStatusInfo = (status: Certificate['status']) => {
    switch (status) {
        case 'Issued': return { label: 'Đã cấp', background: ACCENT_COLOR, icon: 'check-circle-outline', btnText: 'Tải xuống (PDF)' };
        case 'Ready': return { label: 'Sẵn sàng in', background: PASS_COLOR, icon: 'printer-outline', btnText: 'Xem & Tải xuống' };
        case 'Expired': return { label: 'Hết hạn', background: DANGER_COLOR, icon: 'clock-remove-outline', btnText: 'Liên hệ Admin' };
        default: return { label: 'Không rõ', background: '#ccc', icon: 'help-circle-outline', btnText: 'N/A' };
    }
};

const findCertificateById = (id: string) => {
    return CERTIFICATE_DATA.find(cert => cert.id === id);
};


// --- COMPONENT PHỤ: HÀNG THÔNG TIN CHI TIẾT ---
// Đã sửa lỗi type của icon
interface DetailRowProps { icon: string, label: string, value: string | number, color: string } 
const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, color }) => (
    <View style={styles.detailRow}>
        <Ionicons name={icon as any} size={20} color={color} style={{marginRight: 15}} />
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);
// ---------------------------------------------


export default function HocVienCertificateDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const certId = id as string;

    const certDetail: Certificate | undefined = useMemo(() => {
        // Sử dụng ID mẫu nếu certId là undefined
        return findCertificateById(certId || 'C001'); 
    }, [certId]);
    
    // Giả định trạng thái tải xuống
    const [isDownloaded, setIsDownloaded] = useState(false);


    if (!certDetail) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ title: "Không tìm thấy" }} />
                <Text style={styles.errorText}>Không tìm thấy hồ sơ chứng chỉ này.</Text>
                <TouchableOpacity onPress={() => router.back()}><Text style={{color: ACCENT_COLOR, marginTop: 15}}>Quay lại</Text></TouchableOpacity>
            </View>
        );
    }
    
    const statusInfo = getStatusInfo(certDetail.status);
    const gradeColor = certDetail.grade >= 7.5 ? PASS_COLOR : DANGER_COLOR;
    const isActionable = certDetail.status === 'Issued' || certDetail.status === 'Ready';

    const handleMainAction = () => {
        if (certDetail.status === 'Issued' || certDetail.status === 'Ready') {
            setIsDownloaded(true);
            Alert.alert('Thao tác', `Đang tải xuống chứng chỉ ${certDetail.id}.`, [{text: 'OK'}]);
        } else if (certDetail.status === 'Expired') {
            Alert.alert('Hết hạn', 'Chứng chỉ đã hết hạn sử dụng. Vui lòng liên hệ Admin.', [{text: 'Liên hệ'}]);
        }
    };


    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen options={{ title: 'Chi tiết Chứng chỉ' }} />

            {/* PHẦN 1: HEADER & ĐIỂM SỐ CHÍNH */}
            <View style={[styles.header, { borderLeftColor: statusInfo.background }]}>
                <Text style={styles.headerCourse}>{certDetail.courseName}</Text>
                <Text style={styles.headerTitle}>Chứng chỉ Đạt được</Text>
                <View style={styles.gradeDisplay}>
                    <Text style={[styles.gradeValue, { color: gradeColor }]}>{certDetail.grade.toFixed(1)}</Text>
                    <Text style={styles.maxGradeText}>/ 10.0</Text>
                </View>
            </View>
            
            {/* PHẦN 2: THẺ TÓM TẮT TRẠNG THÁI */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Trạng thái Cấp phát</Text>
                <View style={styles.statusRow}>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.background }]}>
                        <MaterialCommunityIcons name={statusInfo.icon as any} size={20} color="white" style={{marginRight: 8}} />
                        <Text style={styles.statusBadgeText}>{statusInfo.label.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.statusMessage}>
                        {certDetail.status === 'Issued' ? 'Chứng chỉ đã có sẵn và được gửi qua Email.' : 
                         certDetail.status === 'Ready' ? 'Đã hoàn thành khóa học, sẵn sàng tải xuống.' : 'Chứng chỉ đã hết hạn sử dụng.'}
                    </Text>
                </View>
            </View>


            {/* PHẦN 3: THÔNG TIN CHI TIẾT */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Thông tin Chứng chỉ</Text>
                
                <DetailRow icon="key-outline" label="Mã Chứng chỉ" value={certDetail.certificateID} color="#333" />
                <DetailRow icon="calendar-outline" label="Ngày cấp" value={certDetail.issueDate} color="#28a745" />
                <DetailRow icon="school-outline" label="Giảng viên" value={certDetail.teacher} color="#6f42c1" />
                <DetailRow icon="timer-outline" label="Thời lượng" value={certDetail.duration} color="#ff7043" />
            </View>

            {/* PHẦN 4: NÚT HÀNH ĐỘNG CHÍNH */}
            <View style={styles.actionCard}>
                <TouchableOpacity 
                    style={[styles.mainActionButton, { backgroundColor: isActionable ? statusInfo.background : '#ccc' }]} 
                    onPress={handleMainAction}
                    disabled={!isActionable && certDetail.status !== 'Expired'}
                >
                    <MaterialCommunityIcons name="cloud-download-outline" size={24} color="white" />
                    <Text style={styles.actionButtonText}>{statusInfo.btnText.toUpperCase()}</Text>
                </TouchableOpacity>
            </View>

            <View style={{height: 40}} />
        </ScrollView>
    );
}

// --- STYLES ---

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f3f5' },
    errorText: { fontSize: 16, color: DANGER_COLOR, marginTop: 10 },
    
    // Header
    header: { 
        padding: 20, 
        backgroundColor: 'white',
        borderLeftWidth: 5, 
        marginBottom: 10,
    },
    headerCourse: { fontSize: 14, color: '#666' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 3 },
    gradeDisplay: { flexDirection: 'row', alignItems: 'baseline', marginTop: 15 },
    gradeValue: { fontSize: 48, fontWeight: '900' },
    maxGradeText: { fontSize: 16, color: '#999', marginLeft: 5 },

    // Status Tags
    statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 'bold',
    },
    statusBadgeText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
    statusMessage: { fontSize: 14, color: '#666', marginLeft: 10, flex: 1 },

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
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
        paddingBottom: 5,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
    },
    detailLabel: { fontSize: 15, color: '#666', fontWeight: '500', marginLeft: 15, width: 100 },
    detailValue: { flex: 1, fontSize: 15, fontWeight: '600', color: '#333' },

    // Action Area
    actionCard: {
        marginHorizontal: 15,
        marginBottom: 20,
        alignItems: 'center',
    },
    mainActionButton: {
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'row',
        elevation: 5,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    feedbackRow: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    feedbackLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
        width: 120,
    },
    feedbackValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    feedbackText: {
        fontSize: 15,
        color: '#333',
        flex: 1,
    }
});