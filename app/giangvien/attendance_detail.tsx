import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- DỮ LIỆU VÀ INTERFACE MỚI ĐÃ ĐỊNH KIỂU ---
const MAIN_COLOR = '#ff7043'; // Cam

// 🔥 ĐỊNH NGHĨA TYPES ĐỂ KHẮC PHỤC LỖI TS(2345)
type AttendanceStatus = "Present" | "Late" | "Absent";
type StudentAttendance = { id: string; name: string; status: AttendanceStatus };

// --- CẤU HÌNH MÀU VÀ TRẠNG THÁI ---
const STATUS_OPTIONS = [
    { key: "Present", label: "Có mặt", color: "#28a745" }, // Xanh lá
    { key: "Late", label: "Đi muộn", color: "#ffc107" },   // Vàng
    { key: "Absent", label: "Vắng", color: "#dc3545" },    // Đỏ
];

// DỮ LIỆU MẪU ĐÃ ĐỊNH KIỂU RÕ RÀNG
const FULL_STUDENT_DATA: StudentAttendance[] = [
    { id: "SV001", name: "Nguyễn Văn A", status: "Present" },
    { id: "SV002", name: "Trần Thị B", status: "Present" },
    { id: "SV003", name: "Phạm Văn C", status: "Absent" },
    { id: "SV004", name: "Lê Thị D", status: "Present" },
    { id: "SV005", name: "Hoàng Minh E", status: "Late" },
    { id: "SV006", name: "Đặng Tú F", status: "Absent" },
    { id: "SV007", name: "Mai Văn G", status: "Absent" },
    { id: "SV008", name: "Bùi Thị H", status: "Present" },
    { id: "SV009", name: "Vũ Đình K", status: "Present" },
    { id: "SV010", name: "Trịnh Thị L", status: "Absent" },
    { id: "SV011", name: "Phan Văn M", status: "Present" },
    { id: "SV012", name: "Ngô Thị N", status: "Present" },
];

const CLASS_INFO = {
    className: "IELTS Writing (G3)",
    session: "Buổi 10: Phân tích Dạng bài",
    date: new Date().toLocaleDateString('vi-VN'),
};


// --- COMPONENT PHỤ: Item Học viên ---
const StudentAttendanceItem: React.FC<{
    student: StudentAttendance;
    onStatusChange: (studentId: string, newStatus: AttendanceStatus) => void;
}> = ({ student, onStatusChange }) => {
    
    // Hàm lấy màu nền cho status Pill
    const getStatusColor = (status: AttendanceStatus) => {
        return STATUS_OPTIONS.find(opt => opt.key === status)?.color || '#ccc';
    };

    return (
        <View style={attendanceStyles.row}>
            <Text style={attendanceStyles.name}>{student.name}</Text>
            
            <View style={attendanceStyles.statusContainer}>
                {STATUS_OPTIONS.map((option) => (
                    <TouchableOpacity
                        key={option.key}
                        style={[
                            attendanceStyles.statusPill,
                            { backgroundColor: option.key === student.status ? option.color : '#f0f0f0' }
                        ]}
                        onPress={() => onStatusChange(student.id, option.key as AttendanceStatus)}
                    >
                        <Text 
                            style={[
                                attendanceStyles.statusText,
                                { color: option.key === student.status ? '#fff' : '#333' }
                            ]}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
// ---------------------------------------------


export default function GiangVienDiemDanhScreen() {
    const [attendanceList, setAttendanceList] = useState<StudentAttendance[]>(FULL_STUDENT_DATA);
    const router = useRouter();

    // Hàm cập nhật trạng thái
    const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
        setAttendanceList(prevList => 
            prevList.map(student => 
                student.id === studentId ? { ...student, status: newStatus } : student
            )
        );
    };
    
    // 🔥 KHẮC PHỤC LỖI TS(7053): TÍNH TOÁN STATS BÊN NGOÀI HÀM RENDER
    const calculateAttendanceStats = (list: StudentAttendance[]) => {
        return list.reduce((acc, student) => {
            // Ép kiểu an toàn cho khóa truy cập (student.status)
            const statusKey = student.status as AttendanceStatus; 
            acc[statusKey] = (acc[statusKey] || 0) + 1;
            return acc;
        }, {} as Record<AttendanceStatus, number>);
    };

    const attendanceStats = calculateAttendanceStats(attendanceList);


    // Hàm xử lý khi lưu điểm danh
    const handleSaveAttendance = () => {
        const stats = calculateAttendanceStats(attendanceList);

        Alert.alert(
            "Xác nhận Lưu",
            `Bạn muốn lưu điểm danh cho buổi học này?\n\n- Có mặt: ${stats.Present || 0} HV\n- Đi muộn: ${stats.Late || 0} HV\n- Vắng: ${stats.Absent || 0} HV`,
            [
                { text: "Hủy", style: "cancel" },
                { 
                    text: "Lưu", 
                    onPress: () => {
                        // TODO: Gọi API lưu attendanceList
                        Alert.alert("Thành công", "Điểm danh đã được lưu lại!");
                        // router.back(); 
                    },
                    style: 'default'
                },
            ]
        );
    };

    return (
        <View style={attendanceStyles.fullContainer}>
            <Stack.Screen options={{ title: 'Điểm danh' }} />

            {/* Thông tin Buổi học */}
            <View style={attendanceStyles.header}>
                <Text style={attendanceStyles.classTitle}>{CLASS_INFO.className}</Text>
                <Text style={attendanceStyles.sessionText}>
                    <Ionicons name="calendar-outline" size={14} color="#666" /> {CLASS_INFO.session} ({CLASS_INFO.date})
                </Text>
                
                {/* Tổng kết nhanh */}
                <View style={attendanceStyles.summaryContainer}>
                    <Text style={[attendanceStyles.summaryText, {color: STATUS_OPTIONS[0].color}]}>
                        Có mặt: {attendanceStats.Present || 0}
                    </Text>
                    <Text style={[attendanceStyles.summaryText, {color: STATUS_OPTIONS[1].color}]}>
                        Muộn: {attendanceStats.Late || 0}
                    </Text>
                    <Text style={[attendanceStyles.summaryText, {color: STATUS_OPTIONS[2].color}]}>
                        Vắng: {attendanceStats.Absent || 0}
                    </Text>
                    <Text style={attendanceStyles.summaryTotal}>
                        Tổng: {attendanceList.length}
                    </Text>
                </View>

            </View>

            {/* Danh sách Điểm danh */}
            <ScrollView style={attendanceStyles.listContainer}>
                {attendanceList.map((student) => (
                    <StudentAttendanceItem
                        key={student.id}
                        student={student}
                        onStatusChange={handleStatusChange}
                    />
                ))}
            </ScrollView>

            {/* Nút Lưu Điểm danh */}
            <TouchableOpacity 
                style={attendanceStyles.saveButton}
                onPress={handleSaveAttendance}
            >
                <Ionicons name="save-outline" size={24} color="#fff" />
                <Text style={attendanceStyles.saveButtonText}>LƯU ĐIỂM DANH ({attendanceList.length} HV)</Text>
            </TouchableOpacity>

        </View>
    );
}

const attendanceStyles = StyleSheet.create({
    fullContainer: { 
        flex: 1, 
        backgroundColor: '#f0f3f5' 
    },
    header: { 
        padding: 15, 
        backgroundColor: 'white', 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee', 
        marginBottom: 10 
    },
    classTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    sessionText: { 
        fontSize: 14, 
        color: '#666', 
        marginTop: 5,
        marginBottom: 10,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    summaryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    summaryTotal: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        elevation: 1, 
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        flex: 1,
    },
    statusContainer: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    statusPill: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 15,
        marginLeft: 5,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    saveButton: {
        flexDirection: 'row',
        backgroundColor: MAIN_COLOR,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 0, 
        elevation: 5,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});