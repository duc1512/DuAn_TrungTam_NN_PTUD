import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// DỮ LIỆU MẪU: Học viên và trạng thái điểm danh
const MOCK_STUDENTS = [
    { id: 'HV2001', name: 'Nguyễn Văn A', email: 'a.n@tdd.edu' },
    { id: 'HV2002', name: 'Trần Thị B', email: 'b.t@tdd.edu' },
    { id: 'HV2003', name: 'Phạm Văn C', email: 'c.p@tdd.edu' },
    { id: 'HV2004', name: 'Lê Thị D', email: 'd.l@tdd.edu' },
    { id: 'HV2005', name: 'Võ Minh E', email: 'e.v@tdd.edu', },
    { id: 'HV2006', name: 'Hoàng Thị F', email: 'f.h@tdd.edu', },
    { id: 'HV2007', name: 'Đặng Văn G', email: 'g.d@tdd.edu', },
    { id: 'HV2008', name: 'Mai Thị H', email: 'h.m@tdd.edu', },
];

// Trạng thái điểm danh
type AttendanceStatus = 'Có mặt' | 'Vắng mặt' | 'Nghỉ có phép';
const STATUS_OPTIONS: { [key in AttendanceStatus]: { label: string, color: string } } = {
    'Có mặt': { label: 'Có mặt', color: '#28a745' },
    'Vắng mặt': { label: 'Vắng', color: '#dc3545' },
    'Nghỉ có phép': { label: 'Nghỉ phép', color: '#ffc107' },
};

export default function AdminAttendanceScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const className = params.className as string || "Lớp [Không xác định]";
    const classId = params.classId as string;

    const [attendance, setAttendance] = useState<{ [studentId: string]: AttendanceStatus }>(
        MOCK_STUDENTS.reduce((acc, student) => ({ ...acc, [student.id]: 'Có mặt' }), {})
    );
    const [date, setDate] = useState('24/10/2025'); 

    const summary = useMemo(() => {
        const vangs = Object.values(attendance).filter(s => s === 'Vắng mặt').length;
        const nghiPhep = Object.values(attendance).filter(s => s === 'Nghỉ có phép').length;
        return { vangs, nghiPhep };
    }, [attendance]);

    const toggleStatus = (studentId: string, currentStatus: AttendanceStatus) => {
        const statuses: AttendanceStatus[] = ['Có mặt', 'Vắng mặt', 'Nghỉ có phép'];
        const currentIndex = statuses.indexOf(currentStatus);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        
        setAttendance(prev => ({
            ...prev,
            [studentId]: nextStatus
        }));
    };

    const saveAttendanceToDatabase = () => {
        // MÔ PHỎNG LƯU VÀO DB
        console.log("--- DỮ LIỆU ĐIỂM DANH ĐÃ LƯU ---");
        console.table(MOCK_STUDENTS.map(student => ({
            studentId: student.id,
            status: attendance[student.id],
            date: date,
            classId: classId
        })));
        return true; 
    };


    // HÀM ĐÃ SỬA: LƯU TRỰC TIẾP VÀ CHUYỂN TRANG, KHÔNG DÙNG ALERT
    const handleSaveAttendance = () => {
        if (saveAttendanceToDatabase()) {
            
            // Log thành công và chuẩn bị chuyển hướng
            console.log(`Đã lưu thành công cho lớp ${className}. Chuyển về trang trước...`);
            
            // Dùng setTimeout để đảm bảo điều hướng được thực thi sau tác vụ lưu đồng bộ
            setTimeout(() => {
                router.back(); 
            }, 10); 

        } else {
            // Trường hợp lưu thất bại, chỉ cần alert đơn giản
            Alert.alert("Lỗi", "Lỗi lưu dữ liệu. Vui lòng thử lại.");
        }
    };

    // Hàm render từng học viên
    const renderStudentItem = (student) => {
        const currentStatus = attendance[student.id];
        const { color, label } = STATUS_OPTIONS[currentStatus];
        
        return (
            <View style={[styles.studentItem, styles.cardShadow]} key={student.id}>
                <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentId}>Mã HV: {student.id}</Text>
                </View>
                
                {/* Nút Trạng thái điểm danh (Chạm để chuyển đổi) */}
                <TouchableOpacity 
                    style={[styles.statusButton, { backgroundColor: color, shadowColor: color }]}
                    onPress={() => toggleStatus(student.id, currentStatus)}
                >
                    <Text style={styles.statusButtonText}>{label}</Text>
                </TouchableOpacity>
            </View>
        );
    };


    return (
        <View style={styles.mainContainer}>
            <Stack.Screen 
                options={{ 
                    title: 'Quản lý Điểm Danh',
                    // Đã sửa lỗi onPress: Dùng router.back() trực tiếp
                    headerLeft: () => ( 
                         <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                             <Ionicons name="arrow-back" size={24} color="#333" /> 
                         </TouchableOpacity>
                    )
                }} 
            /> 
            
            {/* THÔNG TIN LỚP VÀ BUỔI HỌC */}
            <View style={styles.infoBar}>
                <Text style={styles.classTitle}>{className}</Text>
                <Text style={styles.dateText}>Ngày điểm danh: {date}</Text>
            </View>

            {/* DANH SÁCH HỌC VIÊN */}
            <ScrollView contentContainerStyle={styles.listContent}>
                {MOCK_STUDENTS.map(renderStudentItem)}
            </ScrollView>

            {/* FOOTER LƯU DỮ LIỆU (Cố định ở dưới) */}
            <View style={[styles.footer, styles.footerShadow]}>
                <View>
                    <Text style={styles.summaryTextBold}>TỔNG CỘNG: {MOCK_STUDENTS.length} HV</Text>
                    <Text style={styles.summaryText}>
                        Vắng: {summary.vangs} | 
                        Nghỉ phép: {summary.nghiPhep}
                    </Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSaveAttendance} // Gọi hàm đã sửa
                >
                    <MaterialCommunityIcons name="content-save-outline" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.saveButtonText}>LƯU ĐIỂM DANH</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    mainContainer: { flex: 1, backgroundColor: '#f5f5f5' },
    
    // Info Bar
    infoBar: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', },
    classTitle: { fontSize: 18, fontWeight: 'bold', color: '#17a2b8', },
    dateText: { fontSize: 14, color: '#666', marginTop: 5, },
    
    // List & Item
    listContent: { padding: 15, },
    studentItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, },
    studentInfo: { flex: 1, },
    studentName: { fontSize: 16, fontWeight: '600', color: '#333', },
    studentId: { fontSize: 12, color: '#999', },
    
    // Status Button
    statusButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20, 
        minWidth: 100,
        alignItems: 'center',
        elevation: 5, 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    statusButtonText: { color: 'white', fontWeight: 'bold', fontSize: 13, },

    // Footer & Save
    footer: {
        borderTopWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerShadow: { // Shadow cho Footer (đẩy nội dung lên)
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.15, shadowRadius: 3 },
            android: { elevation: 15 }
        })
    },
    summaryText: { fontSize: 14, color: '#777', },
    summaryTextBold: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 3, },
    saveButton: { flexDirection: 'row', backgroundColor: '#28a745', padding: 12, borderRadius: 10, alignItems: 'center', elevation: 3, },
    saveButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 8, fontSize: 16 }
});