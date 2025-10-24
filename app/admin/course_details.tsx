import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// IMPORT DỮ LIỆU GLOBAL (Khóa học)
import { ALL_COURSES } from "./courses";

// =========================================================================
// I. INTERFACES VÀ CONFIG
// =========================================================================

interface ClassItemInCourse { id: string; name: string; students: number; status: string; }
interface Course {
    id: string; name: string; level: 'A1' | 'B2' | 'IELTS' | 'TOEIC'; hocPhan: number;
    price: number; trangThai: 'Công khai' | 'Nháp' | 'Lưu trữ'; color: string;
    description?: string; classList?: ClassItemInCourse[]; 
}
// INTERFACE MỚI ĐỂ KHẮC PHỤC LỖI TS(7031)
interface DetailRowProps {
    icon: keyof typeof Ionicons.glyphMap | string; 
    label: string;
    value: string | number;
    isCurrency?: boolean;
}

// BỘ MÀU CỐ ĐỊNH CHO TRẠNG THÁI
const STATUS_COLORS = { 'Công khai': '#28a745', 'Nháp': '#ffc107', 'Lưu trữ': '#6c757d', };
const STATUS_TEXT_COLORS = { 'Công khai': 'white', 'Nháp': '#333', 'Lưu trữ': 'white', };
const LEVEL_COLOR_MAP = { IELTS: '#007bff', TOEIC: '#28a745', A1: '#ffc107', B2: '#dc3545', };


// =========================================================================
// II. COMPONENT PHỤ (Định nghĩa chuẩn React.FC)
// =========================================================================

// Component phụ: Hiển thị các mục thông tin nhỏ (ĐÃ ÁP DỤNG INTERFACE)
const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, isCurrency = false }) => (
    <View style={styles.detailRow}>
        <Ionicons name={icon as any} size={20} color="#007bff" style={{marginRight: 10}} />
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>
            {isCurrency && typeof value === 'number' ? value.toLocaleString('vi-VN') + ' VNĐ' : value}
        </Text>
    </View>
);

// Component phụ: Thẻ chi tiết lớp học
const ClassCard = ({ classItem, onPress }: { classItem: ClassItemInCourse, onPress: () => void }) => (
    <TouchableOpacity 
        style={styles.classCard}
        onPress={onPress}
    >
        <View style={styles.classCardLeft}>
            <Ionicons name="people-circle-outline" size={24} color="#6f42c1" />
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.className}>{classItem.name}</Text>
                <Text style={styles.classDetail}>{classItem.students} Học viên | Trạng thái: {classItem.status}</Text>
            </View>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color="#007bff" />
    </TouchableOpacity>
);


// =========================================================================
// III. COMPONENT CHÍNH
// =========================================================================

export default function AdminCourseDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const courseId = id as string;

    // LOGIC TÌM KIẾM DỮ LIỆU & GẮN DỮ LIỆU MÔ PHỎNG
    const courseDetail: Course | undefined = useMemo(() => {
        const found = ALL_COURSES.find(c => c.id === courseId);
        if (found) {
            return {
                ...found,
                description: found.description || 'Khóa học này chưa có mô tả chi tiết chính thức. Vui lòng cập nhật trong phần chỉnh sửa.',
                classList: [{ id: 'L001', name: 'Lớp 45A - TDD', students: 25, status: 'Đang học' }, 
                            { id: 'L002', name: 'Lớp 45B - TDD', students: 18, status: 'Chờ khai giảng' },
                            { id: 'L003', name: 'Lớp 46C - TDD', students: 30, status: 'Đang học' }],
            };
        }
        return undefined;
    }, [courseId]);


    if (!courseDetail) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ title: "Không tìm thấy" }} />
                <Ionicons name="alert-circle-outline" size={50} color="#dc3545" />
                <Text style={styles.errorText}>Không tìm thấy khóa học có ID: {courseId}</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}><Text style={{color: '#007bff', fontSize: 16, fontWeight: 'bold'}}>Quay lại</Text></TouchableOpacity>
            </View>
        );
    }

    const { name, level, hocPhan, price, trangThai, description, classList = [] } = courseDetail;
    const levelColor = LEVEL_COLOR_MAP[level] || '#6c757d';
    
    // LOGIC MÀU TRẠNG THÁI
    const statusBgColor = STATUS_COLORS[trangThai] || STATUS_COLORS['Lưu trữ'];
    const statusTextColor = STATUS_TEXT_COLORS[trangThai] || STATUS_TEXT_COLORS['Lưu trữ'];
    
    // Tính tổng học viên
    const totalStudents = classList.reduce((sum, cls) => sum + cls.students, 0);

    // HÀM CHUYỂN ĐẾN TRANG CHỈNH SỬA
    const handleEditCourse = () => {
        router.push(`/admin/edit_course?id=${courseId}`);
    };


    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen 
                options={{ 
                    title: `${name}`,
                    // ĐÃ SỬA LỖI: Dùng Arrow Function an toàn gọi router.back()
                    headerLeft: () => ( 
                         <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                             <Ionicons name="arrow-back" size={24} color="#333" /> 
                         </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleEditCourse} style={{ marginRight: 10 }}>
                            <Ionicons name="create-outline" size={24} color="#007bff" />
                        </TouchableOpacity>
                    )
                }} 
            />

            {/* PHẦN 1: THÔNG TIN CHÍNH (HEADER) */}
            <View style={[styles.mainHeader, { backgroundColor: levelColor }]}>
                <Text style={styles.headerTitle}>{name}</Text>
                <View style={styles.headerBadgeContainer}>
                    <Text style={styles.headerBadgeText}>Cấp độ: {level}</Text>
                    <Text style={styles.headerBadgeText}>ID: {courseId}</Text>
                </View>
            </View>

            {/* PHẦN 2: CÁC CHỈ SỐ QUAN TRỌNG */}
            <View style={styles.metricsContainer}>
                 {/* Metric: HỌC PHẦN */}
                <View style={[styles.metricCard, styles.metricCardShadow]}>
                    <MaterialCommunityIcons name="view-module" size={30} color="#007bff" />
                    <Text style={styles.metricValue}>{hocPhan}</Text>
                    <Text style={styles.metricLabel}>Tổng Học phần</Text>
                </View>
                 {/* Metric: HỌC VIÊN */}
                <View style={[styles.metricCard, styles.metricCardShadow]}>
                    <Ionicons name="person-outline" size={30} color="#28a745" />
                    <Text style={styles.metricValue}>{totalStudents}</Text>
                    <Text style={styles.metricLabel}>Tổng Học viên</Text>
                </View>
                 {/* Metric: LỚP ÁP DỤNG */}
                <View style={[styles.metricCard, styles.metricCardShadow, { backgroundColor: statusBgColor + '30', borderColor: statusBgColor }]}>
                    <Ionicons name="git-branch-outline" size={30} color={statusBgColor} />
                    <Text style={[styles.metricValue, { color: statusBgColor }]}>{classList.length}</Text>
                    <Text style={styles.metricLabel}>Lớp đang áp dụng</Text>
                </View>
            </View>
            
            {/* PHẦN 3: MÔ TẢ & TRẠNG THÁI */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Mô tả Chi tiết</Text>
                <Text style={styles.descriptionText}>{description}</Text>
                
                <View style={styles.statusRow}>
                    {/* DÒNG HIỂN THỊ GIÁ NIÊM YẾT */}
                    <View style={styles.priceRow}>
                        <Ionicons name="cash-outline" size={20} color="#6c757d" style={{marginRight: 8}} />
                        <Text style={styles.detailValue}>{price.toLocaleString('vi-VN')} VNĐ</Text>
                    </View>
                    
                    {/* THẺ TRẠNG THÁI */}
                    <View style={[styles.statusTag, { backgroundColor: statusBgColor }]}>
                        <Text style={[styles.statusTagText, { color: statusTextColor }]}>{trangThai.toUpperCase()}</Text>
                    </View>
                </View>
            </View>
            

            {/* PHẦN 4: LỚP HỌC ĐANG SỬ DỤNG */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Danh sách Lớp Học Áp Dụng ({classList.length})</Text>
                <View style={styles.classListContainer}>
                    {classList.length > 0 ? (
                        classList.map((cls) => (
                            <ClassCard 
                                key={cls.id}
                                classItem={cls}
                                onPress={() => alert(`Chuyển đến trang Lớp: ${cls.name}`)}
                            />
                        ))
                    ) : (
                        <Text style={styles.emptyText}>Chưa có lớp nào được tạo từ khóa học này.</Text>
                    )}
                </View>
            </View>

            {/* PHẦN 5: NÚT TÁC VỤ */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#dc3545' }]}>
                    <MaterialCommunityIcons name="delete-forever" size={20} color="white" />
                    <Text style={styles.actionButtonText}>XÓA KHÓA HỌC</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: levelColor }]}>
                    <MaterialCommunityIcons name="cloud-upload-outline" size={20} color="white" />
                    <Text style={styles.actionButtonText}>XUẤT BẢN NGAY</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f3f5' },
    errorText: { fontSize: 16, color: '#333', marginTop: 10 },
    
    // PHẦN HEADER CHÍNH
    mainHeader: { 
        padding: 25, 
        paddingTop: 15,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
            android: { elevation: 8 }
        }),
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: 'white',
        marginBottom: 10,
    },
    headerBadgeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.3)',
    },
    headerBadgeText: {
        fontSize: 14,
        color: 'white',
        opacity: 0.8
    },

    // Card Style Chung
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 10,
        marginBottom: 15,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
            android: { elevation: 3 }
        }),
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
    descriptionText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        marginBottom: 15,
    },

    // PHẦN METRICS (3 cột)
    metricsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 10, 
        marginTop: -50, // Đẩy lên nằm trên Header
        marginBottom: 15,
    },
    metricCard: { 
        width: '31.5%', 
        backgroundColor: '#fff', 
        borderRadius: 12, 
        padding: 15, 
        alignItems: 'center', 
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    metricCardShadow: {
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 4 },
            android: { elevation: 6 }
        }),
    },
    metricValue: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#007bff', 
        marginTop: 5 
    },
    metricLabel: { 
        fontSize: 11, 
        color: '#666', 
        textAlign: 'center', 
        marginTop: 3, 
        fontWeight: '500' 
    },

    // Detail Rows
    detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    detailLabel: { fontSize: 15, color: '#666', fontWeight: '500', width: 120 },
    detailValue: { flex: 1, fontSize: 15, fontWeight: '600', color: '#333', },
    
    // Status Row (Sửa lỗi trùng lặp nhãn)
    statusRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderTopWidth: 1, 
        borderTopColor: '#eee', 
        paddingTop: 15 
    },
    priceRow: {
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1
    },
    statusTag: { 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 20, 
    },
    statusTagText: {
        fontWeight: 'bold', 
        fontSize: 12,
    },

    // Class List
    classListContainer: { paddingTop: 5 },
    classCard: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingVertical: 15, 
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    classCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    className: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#333' 
    },
    classDetail: { 
        fontSize: 13, 
        color: '#6c757d', 
        marginTop: 3 
    },
    emptyText: { fontStyle: 'italic', color: '#999', textAlign: 'center', padding: 10 },

    // Action Buttons
    actionButtons: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, marginBottom: 30, marginTop: 10 },
    actionButton: { 
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14, 
        borderRadius: 10, 
        marginHorizontal: 5, 
        elevation: 4, 
    },
    actionButtonText: { 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 14,
        marginLeft: 8
    }
});