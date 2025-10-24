import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, Keyboard, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// --- INTERFACE VÀ DỮ LIỆU CỐ ĐỊNH ---
interface GradeItem {
    studentId: string;
    score: number;
}
interface Student {
    id: string;
    name: string;
}
interface Assignment {
    key: string; // Tên viết tắt
    name: string; // Tên đầy đủ của bài kiểm tra/môn học
    maxScore: number;
    passScore: number;
}

const MAIN_COLOR = '#ff7043'; // Màu chủ đạo Giảng viên
const MAX_SCORE = 10.0;

// Danh sách học viên cố định cho lớp này (Mô phỏng 15 HV)
const FIXED_STUDENTS: Student[] = [
    { id: 'U101', name: 'Nguyễn Văn A' }, { id: 'U102', name: 'Trần Thị B' },
    { id: 'U103', name: 'Lê Văn C' }, { id: 'U104', name: 'Phạm Thị D' },
    { id: 'U105', name: 'Hoàng Thị E' }, { id: 'U106', name: 'Đặng Văn F' },
    { id: 'U107', name: 'Mai Thị G' }, { id: 'U108', name: 'Bùi Đức H' },
    { id: 'U109', name: 'Vũ Thị K' }, { id: 'U110', name: 'Trịnh Văn L' },
    { id: 'U111', name: 'Phan Thị M' }, { id: 'U112', name: 'Ngô Văn N' },
    { id: 'U113', name: 'Hà Thị P' }, { id: 'U114', name: 'Châu Minh Q' },
    { id: 'U115', name: 'Đoàn Thị R' },
];

// 🔥 DANH SÁCH CÁC HỌC PHẦN/BÀI KIỂM TRA CHO LỚP NÀY
const MOCK_ASSIGNMENTS: Assignment[] = [
    { key: 'MID', name: 'Điểm giữa kỳ', maxScore: 10, passScore: 7.0 },
    { key: 'FINAL', name: 'Điểm cuối kỳ', maxScore: 10, passScore: 7.5 },
    { key: 'PRJ', name: 'Bài tập Dự án', maxScore: 10, passScore: 6.0 },
    { key: 'ATT', name: 'Điểm chuyên cần', maxScore: 10, passScore: 9.0 },
];

// Hàm Helper tạo điểm ngẫu nhiên (chỉ dùng để mô phỏng dữ liệu ban đầu)
const getRandomScore = (min: number, max: number): number => {
    // 80% có điểm, 20% là 0 (chưa chấm)
    if (Math.random() < 0.2) return 0; 
    return parseFloat((Math.random() * (max - min) + min).toFixed(1));
};


export default function GiangVienGradingScreen() {
    const router = useRouter();
    const { classId, className, courseName, schedule } = useLocalSearchParams(); 

    // 🔥 Dữ liệu State chứa điểm cho TẤT CẢ các học phần (Key là Assignment Key)
    const [allGrades, setAllGrades] = useState<Record<string, GradeItem[]>>(() => {
        const initialGrades: Record<string, GradeItem[]> = {};
        
        MOCK_ASSIGNMENTS.forEach(assignment => {
            // Tạo điểm ngẫu nhiên ban đầu cho mỗi học viên và mỗi học phần
            initialGrades[assignment.key] = FIXED_STUDENTS.map(student => ({
                studentId: student.id,
                score: getRandomScore(5.0, assignment.maxScore)
            }));
        });
        return initialGrades;
    });
    
    const [selectedAssignmentKey, setSelectedAssignmentKey] = useState(MOCK_ASSIGNMENTS[0].key);

    const currentClassName = (className as string) || "Lớp A3";
    const currentCourseName = (courseName as string) || "Tiếng anh siêu cấp";
    const currentSchedule = (schedule as string) || "21/10 đến1/1-2025";
    const currentClassId = (classId as string) || "2351212";

    // Lấy thông tin học phần đang chọn
    const currentAssignment = MOCK_ASSIGNMENTS.find(a => a.key === selectedAssignmentKey)!;
    // Lấy bảng điểm hiện tại
    const currentGrades = allGrades[selectedAssignmentKey] || [];
    
    // --- HÀM XỬ LÝ NHẬP ĐIỂM ---
    const handleScoreChange = (text: string, studentId: string) => {
        const score = parseFloat(text.replace(',', '.')); 
        
        if (isNaN(score) || score < 0 || score > currentAssignment.maxScore) {
            return; 
        }
        
        setAllGrades(prevAllGrades => ({
            ...prevAllGrades,
            [selectedAssignmentKey]: prevAllGrades[selectedAssignmentKey].map(gradeItem => 
                gradeItem.studentId === studentId ? { ...gradeItem, score: score } : gradeItem
            ),
        }));
    };

    // --- HÀM LƯU TẤT CẢ ĐIỂM ---
    const handleSaveAllGrades = () => {
        Alert.alert(
            "Lưu Điểm thành công",
            `Đã cập nhật điểm cho ${currentGrades.length} học viên trong ${currentAssignment.name}.`,
            [{ text: "OK", onPress: () => router.back() }]
        );
        Keyboard.dismiss(); 
    };

    // --- HÀM RENDER ITEM ---
    const renderGradeItem = ({ item: student, index }: { item: Student, index: number }) => {
        const gradeItem = currentGrades.find(g => g.studentId === student.id);
        const score = gradeItem ? gradeItem.score : 0;
        const scoreString = score === 0 ? '' : score.toFixed(1);
        
        const scoreColor = score >= currentAssignment.passScore ? '#28a745' : (score > 0 ? MAIN_COLOR : '#ccc');

        return (
            <View style={styles.gradeItem}>
                <View style={styles.studentIndexContainer}>
                    <Text style={styles.studentIndex}>{index + 1}.</Text>
                    <Text style={styles.studentName} numberOfLines={1}>{student.name}</Text>
                    <Text style={styles.studentId}>ID: {student.id}</Text>
                </View>

                {/* KHỐI NHẬP ĐIỂM VÀ HIỂN THỊ */}
                <View style={styles.scoreBlock}>
                    <Text style={[styles.statusTag, { backgroundColor: scoreColor }]}>
                        {score >= currentAssignment.passScore ? 'ĐẠT' : (score > 0 ? 'CHƯA ĐẠT' : 'CHƯA CHẤM')}
                    </Text>
                    <TextInput
                        style={[styles.scoreInput, { borderColor: scoreColor }]}
                        placeholder={`/${currentAssignment.maxScore.toFixed(0)}`}
                        keyboardType="numeric"
                        // Giá trị ban đầu cần được làm tròn và chuyển sang chuỗi
                        defaultValue={scoreString} 
                        onChangeText={(text) => handleScoreChange(text, student.id)}
                        onBlur={(e) => {
                             if (e.nativeEvent.text.trim() === '') {
                                handleScoreChange('0', student.id);
                             }
                        }}
                    />
                </View>
            </View>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Nhập/Sửa Điểm' }} />

            {/* HEADER TÓM TẮT THÔNG TIN LỚP */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bảng Điểm Lớp</Text>
                <View style={styles.headerDetailsRow}>
                    <Text style={styles.classNameText}>Lớp: <Text style={{fontWeight: 'bold', color: MAIN_COLOR}}>{currentClassName}</Text></Text>
                    <Text style={styles.classNameText}>Môn: <Text style={{fontWeight: 'bold', color: '#28a745'}}>{currentCourseName}</Text></Text>
                </View>
                <Text style={styles.infoText}>Lịch học: <Text style={{fontWeight: 'bold', color: '#6f42c1'}}>{currentSchedule}</Text></Text>
                <Text style={styles.infoText}>Mã lớp: {currentClassId}</Text>
            </View>
            
            {/* 🔥 THANH CHỌN HỌC PHẦN */}
            <View style={styles.assignmentSelectorContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {MOCK_ASSIGNMENTS.map((assignment) => (
                        <TouchableOpacity
                            key={assignment.key}
                            style={[
                                styles.assignmentPill,
                                selectedAssignmentKey === assignment.key && styles.assignmentPillActive
                            ]}
                            onPress={() => setSelectedAssignmentKey(assignment.key)}
                        >
                            <Text style={[
                                styles.assignmentPillText,
                                selectedAssignmentKey === assignment.key && styles.assignmentPillTextActive
                            ]}>
                                {assignment.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={styles.assignmentDetailsBar}>
                    <Text style={styles.assignmentDetailText}>Điểm đạt: {currentAssignment.passScore}/{currentAssignment.maxScore}</Text>
                    <Text style={styles.assignmentDetailText}>HV: {FIXED_STUDENTS.length}</Text>
                </View>
            </View>


            {/* FLATLIST DANH SÁCH ĐIỂM */}
            <FlatList
                data={FIXED_STUDENTS} // Render danh sách học viên cố định
                renderItem={renderGradeItem}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
            />

            {/* NÚT LƯU ĐIỂM NỔI BẬT */}
            <View style={styles.saveButtonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveAllGrades}>
                    <MaterialCommunityIcons name="content-save-check-outline" size={24} color="white" />
                    <Text style={styles.saveButtonText}>LƯU ĐIỂM {currentAssignment.name.toUpperCase()}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// KHỐI STYLES
const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    header: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 5 },
    headerTitle: { fontSize: 20, fontWeight: '900', color: '#333' },
    classNameText: { fontSize: 16, color: '#666', marginTop: 8 },
    headerDetailsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    infoText: { fontSize: 14, color: '#999', marginTop: 3 },
    
    // 🔥 ASSIGNMENT SELECTOR STYLES
    assignmentSelectorContainer: { 
        backgroundColor: 'white', 
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    assignmentPill: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f9f9f9',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    assignmentPillActive: {
        backgroundColor: MAIN_COLOR,
        borderColor: MAIN_COLOR,
    },
    assignmentPillText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    assignmentPillTextActive: {
        color: 'white',
    },
    assignmentDetailsBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    assignmentDetailText: {
        fontSize: 12,
        color: '#666',
    },

    // List Styles
    list: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
    listContent: { paddingBottom: 20 },
    
    // ITEM CARD
    gradeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 8,
        elevation: 3,
        shadowColor: MAIN_COLOR, 
        shadowOpacity: 0.1,
        shadowRadius: 3,
        ...Platform.select({ ios: { shadowOffset: { width: 0, height: 1 } } }),
    },
    studentIndexContainer: { 
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginRight: 10,
    },
    studentIndex: { fontSize: 16, fontWeight: 'bold', color: '#666', width: 25 },
    studentInfo: { flex: 1, marginRight: 10 },
    studentName: { fontSize: 16, fontWeight: '600', color: '#333' },
    studentId: { fontSize: 12, color: '#999', marginTop: 2 },
    
    // Score Input Block
    scoreBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 120, // Cố định khối điểm
    },
    statusTag: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 15,
        overflow: 'hidden',
        marginRight: 10,
        minWidth: 55,
        textAlign: 'center'
    },
    scoreInput: {
        width: 60,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 5,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        borderWidth: 2,
    },
    
    // Save Button
    saveButtonContainer: {
        padding: 15,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    saveButton: {
        backgroundColor: MAIN_COLOR,
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});