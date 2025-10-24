import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- DỮ LIỆU GIẢ ĐỊNH (ĐÃ ĐƯỢC MÔ TẢ RIÊNG) ---
const DANGER_COLOR = '#dc3545';
const PASS_COLOR = '#28a745';
const ACCENT_COLOR = '#ff7043'; // Màu Cam chủ đạo

interface Assignment {
    id: string;
    title: string;
    course: string;
    dueDate: string;
    status: 'Pending' | 'Graded' | 'Due' | 'Completed';
    score?: number;
    maxScore: number;
    description: string; // Mô tả riêng
    submissionFormat: string;
}

const ASSIGNMENT_DATA: Assignment[] = [
    { 
        id: 'A001', 
        title: 'Bài tập Unit 5: Ngữ pháp Tense', 
        course: 'IELTS Writing 7.0', 
        dueDate: '2025-10-28 (23:59)', 
        status: 'Due', 
        maxScore: 10,
        description: 'Phân tích và sửa lỗi trong đoạn văn được cung cấp, tập trung vào thì hiện tại hoàn thành và quá khứ đơn. Yêu cầu nộp file đúng định dạng PDF.',
        submissionFormat: 'Tệp tin DOCX/PDF (Tối đa 5MB)',
    },
    { 
        id: 'A002', // 🔥 BÀI TẬP GIỮA KỲ MỚI
        title: 'Bài kiểm tra Giữa kỳ (Listening)', 
        course: 'TOEIC Giao Tiếp', 
        dueDate: '2025-10-25', 
        status: 'Due', 
        maxScore: 100,
        description: 'Bài kiểm tra kỹ năng Nghe, gồm 100 câu hỏi trong 45 phút. Đánh giá khả năng hiểu giọng Anh Mỹ và Anh Anh.',
        submissionFormat: 'Thi trực tuyến (Online Test)',
    },
    { 
        id: 'A003', 
        title: 'Assignment 2: Phân tích Văn bản', 
        course: 'Ngữ Pháp Nâng Cao', 
        dueDate: '2025-10-20', 
        status: 'Graded', 
        score: 8.5, 
        maxScore: 10,
        description: 'Bài tập đã được chấm điểm. Xem chi tiết phản hồi của Giảng viên.',
        submissionFormat: 'Đã nộp vào 20/10/2025',
    },
    { 
        id: 'A004', // 🔥 BÀI TẬP UNIT 4 MỚI
        title: 'Bài tập Unit 4 (Đã quá hạn)', 
        course: 'IELTS Writing 7.0', 
        dueDate: '2025-10-15', 
        status: 'Due', 
        maxScore: 10, 
        description: 'Bài tập Quá hạn: Viết đoạn văn so sánh giữa hai loại hình giáo dục. Cần liên hệ Giảng viên để được mở lại hệ thống nộp bài.',
        submissionFormat: 'Quá hạn nộp bài',
    },
    
];

// 🔥 SỬA: Hàm tìm kiếm chính xác bằng ID
const findAssignmentById = (id: string) => {
    // Dùng .find() để trả về đối tượng khớp đầu tiên
    return ASSIGNMENT_DATA.find(a => a.id === id); 
};


// --- COMPONENT PHỤ: Thẻ Thông tin Chi tiết ---
interface InfoCardProps { icon: string, label: string, value: string | number, color: string }
const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value, color }) => (
    <View style={styles.infoCard}>
        <MaterialCommunityIcons name={icon as any} size={20} color={color} style={{marginRight: 10, width: 25}} />
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);
// ---------------------------------------------

export default function HocVienAssignmentDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const assignmentId = id as string;
    
    const [fileStatus, setFileStatus] = useState<'none' | 'uploaded'>('none');

    const assignmentDetail: Assignment | undefined = useMemo(() => {
        // 🔥 LỖI ĐÃ KHẮC PHỤC: Hàm tìm kiếm chính xác bằng assignmentId
        return findAssignmentById(assignmentId); 
    }, [assignmentId]);

    if (!assignmentDetail) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ title: "Không tìm thấy" }} />
                <Text style={styles.errorText}>Không tìm thấy bài tập này.</Text>
                <TouchableOpacity onPress={() => router.back()}><Text style={{color: ACCENT_COLOR, marginTop: 15}}>Quay lại</Text></TouchableOpacity>
            </View>
        );
    }
    
    const isGraded = assignmentDetail.status === 'Graded';
    const isDue = assignmentDetail.status === 'Due' || assignmentDetail.status === 'Pending';
    const isPassed = assignmentDetail.score! >= 7; 
    const statusColor = isGraded ? (isPassed ? PASS_COLOR : DANGER_COLOR) : ACCENT_COLOR;
    
    const handleSubmission = () => {
        if (fileStatus === 'uploaded') {
            Alert.alert('Xác nhận', 'Bạn có muốn nộp bài đã tải lên không?', [
                { text: 'Hủy' },
                { text: 'Nộp', onPress: () => alert('Đã nộp bài thành công!'), style: 'default' },
            ]);
        } else {
            alert('Mở hộp thoại chọn file...');
            setFileStatus('uploaded'); // Giả lập file đã được chọn
        }
    };


    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen options={{ title: 'Chi tiết Bài tập' }} />

            {/* PHẦN 1: HEADER & TÓM TẮT */}
            <View style={[styles.header, { borderLeftColor: statusColor }]}>
                <Text style={styles.headerCourse}>{assignmentDetail.course}</Text>
                <Text style={styles.headerTitle}>{assignmentDetail.title}</Text>
                <Text style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                    {isGraded ? (isPassed ? `ĐẠT: ${assignmentDetail.score}/${assignmentDetail.maxScore}` : `CHƯA ĐẠT: ${assignmentDetail.score}/${assignmentDetail.maxScore}`) : 'ĐANG CHỜ XỬ LÝ'}
                </Text>
            </View>
            
            {/* PHẦN 2: THÔNG TIN CHI TIẾT */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Thông tin Bài tập</Text>
                
                <InfoCard icon="calendar-clock-outline" label="Ngày hết hạn" value={assignmentDetail.dueDate} color="#333" />
                <InfoCard icon="medal-outline" label="Điểm tối đa" value={`${assignmentDetail.maxScore} điểm`} color="#007bff" />
                <InfoCard icon="book-open-variant" label="Môn học" value={assignmentDetail.course} color="#28a745" />

                <Text style={styles.descriptionLabel}>Mô tả chi tiết:</Text>
                <Text style={styles.descriptionText}>{assignmentDetail.description}</Text>
            </View>

            {/* PHẦN 3: KHU VỰC NỘP BÀI (Chỉ hiển thị khi đang chờ) */}
            {isDue && (
                <View style={styles.submissionCard}>
                    <Text style={styles.submissionTitle}>Khu vực Nộp Bài</Text>
                    <View style={styles.fileUploadStatus}>
                        <Ionicons name={fileStatus === 'uploaded' ? 'cloud-done-outline' : 'cloud-upload-outline'} size={20} color={fileStatus === 'uploaded' ? PASS_COLOR : ACCENT_COLOR} />
                        <Text style={[styles.fileStatusText, { color: fileStatus === 'uploaded' ? PASS_COLOR : ACCENT_COLOR }]}>
                            {fileStatus === 'uploaded' ? assignmentDetail.submissionFormat : 'Chưa có tệp nào được chọn.'}
                        </Text>
                    </View>
                    
                    <TouchableOpacity style={[styles.submitButton, { backgroundColor: fileStatus === 'uploaded' ? PASS_COLOR : ACCENT_COLOR }]} onPress={handleSubmission}>
                        <Text style={styles.submitButtonText}>{fileStatus === 'uploaded' ? 'NỘP BÀI CUỐI CÙNG' : 'TẢI TỆP LÊN'}</Text>
                    </TouchableOpacity>
                </View>
            )}

             {/* PHẦN 4: THÔNG TIN CHẤM ĐIỂM (Chỉ hiển thị khi đã chấm) */}
             {isGraded && (
                <View style={[styles.card, { backgroundColor: isPassed ? '#e6fff0' : '#ffe6e6', borderLeftColor: statusColor, borderLeftWidth: 5 }]}>
                    <Text style={[styles.sectionTitle, { borderBottomColor: isPassed ? PASS_COLOR : DANGER_COLOR }]}>Phản hồi Giảng viên</Text>
                    <View style={styles.feedbackRow}>
                        <Text style={styles.feedbackLabel}>Điểm số:</Text>
                        <Text style={[styles.feedbackValue, { color: statusColor }]}>{assignmentDetail.score!.toFixed(1)} / {assignmentDetail.maxScore}</Text>
                    </View>
                    <View style={styles.feedbackRow}>
                        <Text style={styles.feedbackLabel}>Phản hồi:</Text>
                        <Text style={styles.feedbackText}>Bài làm tốt, tuy nhiên cần cải thiện độ chính xác trong phần ngữ pháp phức tạp.</Text>
                    </View>
                </View>
            )}

            <View style={{height: 40}} />
        </ScrollView>
    );
}

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
        paddingBottom: 25,
    },
    headerCourse: { fontSize: 14, color: '#666' },
    headerTitle: { fontSize: 24, fontWeight: '900', color: '#333', marginTop: 5 },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 10,
        color: 'white',
        overflow: 'hidden',
    },

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
        marginBottom: 15,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f7f7',
    },
    infoLabel: { fontSize: 14, color: '#666', fontWeight: '500', marginLeft: 10, width: 100 },
    infoValue: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
    descriptionLabel: { fontSize: 14, fontWeight: '600', color: '#555', marginTop: 15, marginBottom: 5 },
    descriptionText: { fontSize: 15, color: '#666', lineHeight: 22 },

    // Submission Area
    submissionCard: {
        padding: 20,
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: ACCENT_COLOR + '50',
        borderStyle: 'dashed',
    },
    submissionTitle: { fontSize: 18, fontWeight: 'bold', color: ACCENT_COLOR, marginBottom: 15 },
    fileUploadStatus: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    fileStatusText: { marginLeft: 10, fontSize: 15, fontWeight: '600' },
    submitButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    
    // Feedback Area
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