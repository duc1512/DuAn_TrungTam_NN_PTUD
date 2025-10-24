import { Ionicons } from '@expo/vector-icons'; // 🔥 ĐÃ THÊM MaterialCommunityIcons
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, FlatList, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Lấy chiều rộng màn hình để điều chỉnh layout
const screenWidth = Dimensions.get('window').width;

// --- DỮ LIỆU LỊCH GIẢNG DẠY CỐ ĐỊNH CHO CÔ SƯƠNG ---
interface ClassScheduleItem {
    time: string;
    classId: string;
    className: string;
    status: 'Đã hoàn thành' | 'Sắp tới' | 'Đang diễn ra'; 
    color: string;
    courseName: string;
}

interface DailySchedule {
    date: string; 
    dateString: string; 
    schedule: ClassScheduleItem[];
}

const START_DAY = '2025-10-27'; 

const FULL_SCHEDULE_DATA: DailySchedule[] = [
    {
        date: "Thứ Hai, 27/10/2025",
        dateString: START_DAY,
        schedule: [
            { time: '17:30 - 19:00', classId: 'L101', className: 'IELTS Writing (G3)', status: 'Sắp tới', color: '#ff7043', courseName: 'IELTS Writing' },
            { time: '19:00 - 20:30', classId: 'L102', className: 'Ngữ Pháp Nâng Cao', status: 'Sắp tới', color: '#007bff', courseName: 'Ngữ Pháp Chuyên sâu' },
        ],
    },
    {
        date: "Thứ Ba, 28/10/2025",
        dateString: '2025-10-28',
        schedule: [], 
    },
    {
        date: "Thứ Tư, 29/10/2025",
        dateString: '2025-10-29',
        schedule: [
            { time: '18:00 - 19:30', classId: 'L103', className: 'TOEIC Giao Tiếp (B2)', status: 'Đang diễn ra', color: '#28a745', courseName: 'TOEIC Giao Tiếp' },
        ],
    },
    {
        date: "Thứ Năm, 30/10/2025",
        dateString: '2025-10-30',
        schedule: [
            { time: '19:00 - 20:30', classId: 'L104', className: 'IELTS Speaking (G3)', status: 'Sắp tới', color: '#007bff', courseName: 'IELTS Speaking' },
        ],
    },
    {
        date: "Thứ Sáu, 31/10/2025",
        dateString: '2025-10-31',
        schedule: [], 
    },
    {
        date: "Thứ Bảy, 01/11/2025",
        dateString: '2025-11-01',
        schedule: [
            { time: '09:00 - 11:00', classId: 'L105', className: 'Tổng ôn Ngữ Pháp', status: 'Đã hoàn thành', color: '#6c757d', courseName: 'Ngữ Pháp Chuyên sâu' },
        ],
    },
    {
        date: "Chủ Nhật, 02/11/2025",
        dateString: '2025-11-02',
        schedule: [], 
    },
];


// Hàm lấy ngày mô phỏng (Dùng dữ liệu từ FULL_SCHEDULE_DATA để đồng bộ)
const getMockDates = () => {
    return FULL_SCHEDULE_DATA.map(day => ({
        dateString: day.dateString,
        dayName: day.date.split(',')[0],
        dayNumber: new Date(day.dateString).getDate(),
    }));
};
const MOCK_DATES = getMockDates();

// Export biến rỗng để tránh lỗi import trong Dashboard
export const CURRENT_USERS = [];


// --- COMPONENT PHỤ: THẺ SỰ KIỆN AGEND (ĐÃ XÓA HIỂN THỊ STATUS) ---
const AgendaItemCard: React.FC<{ item: ClassScheduleItem, onPress: (classId: string) => void }> = ({ item, onPress }) => {
    
    // Loại bỏ biến statusTextColor và việc sử dụng nó
    
    return (
        <TouchableOpacity 
            style={[styles.agendaCard, { borderLeftColor: item.color }]}
            onPress={() => onPress(item.classId)}
        >
            <View style={styles.agendaTimeBlock}>
                <Text style={styles.agendaTimeText}>{item.time.split(' - ')[0]}</Text>
                <Text style={styles.agendaTimeEnd}>{item.time.split(' - ')[1]}</Text>
            </View>

            <View style={styles.agendaInfo}>
                <Text style={styles.agendaClassName}>{item.className}</Text>
                <Text style={styles.agendaCourseText}>{item.courseName}</Text>
            </View>

            {/* KHỐI CHỈ CÒN MŨI TÊN CHUYỂN TIẾP */}
            <View style={styles.forwardIconContainer}>
                <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
            </View>
        </TouchableOpacity>
    );
};


// --- COMPONENT CHÍNH ---
export default function FullScheduleScreen() {
    const router = useRouter(); 
    const [selectedDate, setSelectedDate] = useState(MOCK_DATES[0].dateString);

    const handleClassPress = (classId: string) => {
        // Đường dẫn đã được sửa thành schedule_details
        router.push(`/giangvien/schedule_details?id=${classId}`); 
    };

    const currentDailyData = FULL_SCHEDULE_DATA.find(daily => 
        daily.dateString === selectedDate
    );
    const filteredEvents = currentDailyData?.schedule || [];

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Toàn bộ Lịch Giảng Dạy' }} />
            
            {/* PHẦN 1: THANH CHỌN NGÀY (Nổi bật) */}
            <View style={styles.dateSelectorArea}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={MOCK_DATES}
                    keyExtractor={(item) => item.dateString}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.datePill,
                                selectedDate === item.dateString && styles.datePillActive,
                            ]}
                            onPress={() => setSelectedDate(item.dateString)}
                        >
                            <Text style={[styles.dayName, selectedDate === item.dateString && styles.dayNameActive]}>
                                {item.dayName}
                            </Text>
                            <Text style={[styles.dayNumber, selectedDate === item.dateString && styles.dayNumberActive]}>
                                {item.dayNumber}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* PHẦN 2: DANH SÁCH SỰ KIỆN LỊCH DẠY */}
            <View style={styles.scheduleListContainer}>
                <Text style={styles.listTitle}>
                    {currentDailyData?.date || 'Chọn ngày'} | {filteredEvents.length} Sự kiện
                </Text>
                
                <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
                    <View style={styles.scheduleList}>
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((item, itemIndex) => (
                                <AgendaItemCard 
                                    key={itemIndex} 
                                    item={item} 
                                    onPress={handleClassPress}
                                />
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="calendar-outline" size={40} color="#ccc" />
                                <Text style={styles.emptyText}>Ngày này không có sự kiện giảng dạy nào.</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
            
            {/* Nút Thêm Sự kiện (Floating Button) */}
            <TouchableOpacity style={styles.floatingButton} onPress={() => router.push('/giangvien/add_schedule')}>
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f3f5' },
    
    // 1. DATE SELECTOR AREA
    dateSelectorArea: { 
        paddingVertical: 10, 
        backgroundColor: 'white', 
        borderBottomWidth: 1, 
        borderBottomColor: '#ddd',
    },
    datePill: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#f9f9f9',
    },
    datePillActive: {
        backgroundColor: '#ff7043',
        borderColor: '#ff7043',
        ...Platform.select({ ios: { shadowColor: '#ff7043', shadowOpacity: 0.3, shadowRadius: 5 }, android: { elevation: 3 } }),
    },
    dayName: { fontSize: 11, color: '#666' },
    dayNameActive: { color: 'white', fontWeight: 'bold' },
    dayNumber: { fontSize: 18, fontWeight: '900', color: '#333', marginTop: 3 },
    dayNumberActive: { color: 'white' },

    // 2. SCHEDULE LIST
    scheduleListContainer: { 
        flex: 1, 
        paddingHorizontal: 15, 
        paddingTop: 15,
    },
    listTitle: { 
        fontSize: 15, 
        fontWeight: 'bold', 
        color: '#555', 
        marginBottom: 10,
    },
    scheduleList: { 
        paddingBottom: 20, 
    },
    
    // --- ITEM CARD STYLES ---
    agendaCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        shadowOpacity: 0.1,
        borderLeftWidth: 6, // Viền màu nổi bật
        alignItems: 'center',
    },
    agendaTimeBlock: {
        width: 80, // Cố định chiều rộng cho khối thời gian
        paddingRight: 10,
        alignItems: 'flex-start',
    },
    agendaTimeText: { 
        fontSize: 15, 
        fontWeight: 'bold',
        color: '#333'
    },
    agendaTimeEnd: { 
        fontSize: 12, 
        color: '#999',
        marginTop: 2,
    },
    agendaInfo: { 
        flex: 1, 
        marginLeft: 10 
    },
    agendaClassName: { 
        fontSize: 16, 
        fontWeight: '700', 
        color: '#333' 
    },
    agendaCourseText: { 
        fontSize: 12, 
        color: '#999', 
        marginTop: 3 
    },
    
    // KHỐI CHỈ CÒN MŨI TÊN (Thay thế agendaStatusContainer)
    forwardIconContainer: { 
        flexDirection: 'row', 
        alignItems: 'center',
        marginLeft: 10,
        paddingLeft: 10, // Thêm padding để cân bằng
    },

    // Empty State
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#999', marginTop: 10, fontSize: 16 },
    
    // Floating Button
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007bff', // Màu xanh dương cho hành động thêm
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        ...Platform.select({ ios: { shadowColor: '#007bff', shadowOpacity: 0.4, shadowRadius: 5 } }),
    }
});