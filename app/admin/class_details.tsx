import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// IMPORT DỮ LIỆU GLOBAL (Lớp học mới nhất nằm ở đây)
import { ALL_CLASSES } from "./classes";

// =========================================================================
// I. INTERFACES VÀ CÁC ĐỊNH NGHĨA
// =========================================================================

interface UserInClass { id: string; name: string; email: string; }

interface ClassDetail {
    id: string; name: string; course: string; teacher: string; students: number;
    schedule: string; 
    startDate?: string; // 🔥 ĐÃ SỬA: Phải tồn tại để tránh lỗi
    endDate?: string;   // 🔥 ĐÃ SỬA: Phải tồn tại để tránh lỗi
    description: string;
    studentList?: UserInClass[]; 
    status: 'Active' | 'Scheduled' | 'Finished';
    color: string;
}

// KHẮC PHỤC LỖI TS(7031): Định nghĩa Interface cho DetailItem
interface DetailItemProps {
    label: string;
    value: string | number;
    icon: keyof typeof Ionicons.glyphMap | string; 
}

// Ánh xạ trạng thái (Đã Việt hóa)
const VIETNAMESE_STATUS_MAP = {
    'Active': 'ĐANG HOẠT ĐỘNG',
    'Scheduled': 'DỰ KIẾN',
    'Finished': 'ĐÃ KẾT THÚC',
};

// Component phụ: Hiển thị các mục thông tin nhỏ (ĐÃ ÁP DỤNG INTERFACE)
const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon }) => (
    <View style={styles.detailItem}>
        <Ionicons name={icon as any} size={20} color="#007bff" style={{marginRight: 10}} />
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

// HÀM HELPER ĐỊNH DẠNG NGÀY THÁNG
const formatDisplayDate = (dateString: string | undefined): string => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
        // Định dạng DD/MM/YYYY
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    } catch {
        return 'N/A';
    }
};


export default function ClassDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const classId = Array.isArray(params.id) ? params.id[0] : params.id;

    const [classData, setClassData] = useState<ClassDetail | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    // LOGIC TẢI DỮ LIỆU
    useEffect(() => {
        const loadData = () => {
            // Giả định ClassType hiện tại đã được sửa để có startDate/endDate
            const data = ALL_CLASSES.find(cls => cls.id === classId);
            
            if (data) {
                // Giả định giá trị mặc định nếu chưa có
                const defaultStartDate = '2024-11-01'; 
                const defaultEndDate = '2025-01-30';
                
                const fullData: ClassDetail = {
                    ...data,
                    // 🔥 KHẮC PHỤC LỖI: Ép kiểu data thành any để truy cập startDate/endDate 
                    // mà không bị lỗi biên dịch nếu thuộc tính đó chưa được thêm vào data gốc
                    startDate: formatDisplayDate((data as any).startDate || defaultStartDate),
                    endDate: formatDisplayDate((data as any).endDate || defaultEndDate),
                    
                    status: data.status as ClassDetail['status'], 
                    description: (data as any).description || 'Không có mô tả chi tiết.',
                    studentList: (data as any).studentList || [
                        // Giả định danh sách học viên mẫu
                        { id: 'S1', name: 'SV Test 1', email: 't1@mail.com' },
                        { id: 'S2', name: 'SV Test 2', email: 't2@mail.com' },
                    ],
                } as ClassDetail;
                setClassData(fullData);
            } else {
                Alert.alert("Lỗi", "Không tìm thấy thông tin lớp học này.");
                router.back();
            }
            setLoading(false);
        };
        
        if (classId) {
            setTimeout(loadData, 300); 
        } else {
            setLoading(false);
        }
    }, [classId]);

    const handleEdit = () => { alert(`Chức năng chỉnh sửa lớp ${classId}`); };
    
    // HÀM ĐIỀU HƯỚNG: Chuyển sang trang Quản lý Điểm danh
    const handleManageAttendance = () => {
        if (classId && classData?.name) {
             router.push({
                pathname: '/admin/manage_attendance',
                params: { classId: classId, className: classData.name } 
            });
        }
    };

    // LOADING STATE
    if (loading) {
        return (
            <View style={[styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={{ marginTop: 10 }}>Đang tải thông tin lớp...</Text>
            </View>
        );
    }

    // NOT FOUND STATE
    if (!classData) {
        return (
            <View style={[styles.loadingContainer]}>
                <Text style={styles.errorText}>Không tìm thấy hồ sơ lớp học này.</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>Quay lại danh sách</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    // Hủy cấu trúc dữ liệu an toàn để sử dụng trong JSX
    const { 
        id, name, course, teacher, students, schedule, status, color, 
        description, studentList = [], startDate, endDate 
    } = classData; 
    
    // RENDER CLASS DETAIL
    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 50 }}>
            <Stack.Screen 
                options={{ 
                    title: `Chi tiết: ${name}`,
                    headerRight: () => (
                        <TouchableOpacity onPress={handleEdit} style={{ marginRight: 10 }}>
                            <MaterialCommunityIcons name="pencil-box-outline" size={24} color="#007bff" />
                        </TouchableOpacity>
                    )
                }} 
            />

            <View style={[styles.headerContainer, { borderLeftColor: color }]}>
                <Text style={styles.className}>{name}</Text>
                <Text style={styles.classCourse}>{course}</Text>
                <View style={[styles.statusTag, { backgroundColor: color }]}>
                    <Text style={[styles.statusText, {color: status === 'Scheduled' ? '#333' : 'white'}]}>
                        {VIETNAMESE_STATUS_MAP[status] || status} {/* Hiển thị trạng thái Việt hóa */}
                    </Text>
                </View>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.sectionTitle}>Thông tin Cơ bản</Text>
                
                <DetailItem label="Mã lớp" value={id} icon="key-outline" />
                <DetailItem label="Giảng viên" value={teacher} icon="person-circle-outline" />
                <DetailItem label="Mô tả" value={description} icon="information-circle-outline" />
                
                <Text style={styles.sectionTitle}>Lịch trình</Text>
                <DetailItem label="Lịch học" value={schedule} icon="calendar-outline" />
                
                {/* HIỂN THỊ NGÀY BẮT ĐẦU */}
                <DetailItem label="Bắt đầu" value={startDate || 'N/A'} icon="play-circle-outline" /> 
                
                {/* HIỂN THỊ NGÀY KẾT THÚC */}
                <DetailItem label="Kết thúc" value={endDate || 'N/A'} icon="stop-circle-outline" />
                
                <DetailItem label="Học viên" value={students} icon="people-outline" />


                <Text style={styles.sectionTitle}>Danh sách Học viên ({studentList.length})</Text>
                {studentList.length > 0 ? (
                    studentList.map((student, index) => (
                        <View key={student.id} style={styles.studentItem}>
                            <Text style={styles.studentName}>{index + 1}. {student.name}</Text>
                            <Text style={styles.studentEmail}>{student.email}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyStudentList}>Lớp học chưa có học viên nào.</Text>
                )}
            </View>
            
            {/* Nút hành động */}
            <View style={styles.actionButtons}>
                 <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#007bff' }]} onPress={handleManageAttendance}>
                    <MaterialCommunityIcons name="clipboard-check-outline" size={20} color="white" />
                    <Text style={styles.actionButtonText}>ĐIỂM DANH & SỬA ĐIỂM</Text>
                </TouchableOpacity>
            </View>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    errorText: { fontSize: 18, color: '#dc3545' },
    backButton: { color: '#007bff', marginTop: 15, fontSize: 16 },
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },

    headerContainer: {
        backgroundColor: '#fff', padding: 20, borderLeftWidth: 5, margin: 10, borderRadius: 10, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, marginBottom: 20
    },
    className: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5, },
    classCourse: { fontSize: 16, color: '#666', marginTop: 5, },
    statusTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, marginTop: 10, },
    statusText: { fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },

    detailsContainer: {
        backgroundColor: '#fff', marginHorizontal: 10, borderRadius: 10, padding: 20, elevation: 1, marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16, fontWeight: '700', color: '#007bff', marginBottom: 15, marginTop: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5,
    },
    detailItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f8f9fa',
    },
    detailLabel: { fontSize: 16, color: '#666', fontWeight: '500', width: 100, marginLeft: 10, },
    detailValue: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333', },
    descriptionText: { fontSize: 15, color: '#555', lineHeight: 22, marginBottom: 10, },
    
    // Student List Styles
    studentItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f5', paddingHorizontal: 5, },
    studentName: { fontSize: 15, fontWeight: '500', color: '#333', },
    studentEmail: { fontSize: 14, color: '#999', },
    emptyStudentList: { fontStyle: 'italic', color: '#999', padding: 10, textAlign: 'center', },

    // Action Buttons
    actionButtons: { flexDirection: 'row', justifyContent: 'center', padding: 15, },
    actionButton: { flex: 0.9, padding: 12, borderRadius: 8, marginHorizontal: 5, alignItems: 'center', elevation: 2, flexDirection: 'row', justifyContent: 'center' },
    actionButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});