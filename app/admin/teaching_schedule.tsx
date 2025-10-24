import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- DỮ LIỆU GIẢ ĐỊNH ---
// Dữ liệu sự kiện lịch dạy (Mô phỏng dữ liệu lớn hơn)
const FULL_SCHEDULE_DATA = [
    { id: 1, date: '2025-10-24', time: '18:00', endTime: '19:30', class: 'IELTS 7.0 - T1A', teacher: 'Thầy Lê Tùng', status: 'Active', color: '#007bff' },
    { id: 2, date: '2025-10-24', time: '19:30', endTime: '21:00', class: 'TOEIC 600 - K2', teacher: 'Cô Trần Mai', status: 'Upcoming', color: '#ff7043' },
    { id: 3, date: '2025-10-25', time: '09:00', endTime: '11:00', class: 'Ngữ Pháp Căn Bản', teacher: 'Cô Nguyễn Vy', status: 'Active', color: '#28a745' },
    { id: 4, date: '2025-10-25', time: '14:00', endTime: '16:00', class: 'Business B2', teacher: 'Thầy Khang', status: 'Completed', color: '#6c757d' },
    { id: 5, date: '2025-10-26', time: '20:00', endTime: '22:00', class: 'Writing Advanced', teacher: 'Cô Trần Mai', status: 'Active', color: '#dc3545' },
];

// Hàm lấy ngày mô phỏng (bảy ngày kể từ ngày cố định)
const getMockDates = () => {
    const dates = [];
    const today = new Date('2025-10-24'); // Cố định ngày bắt đầu để dễ mô phỏng
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push({
            dateString: d.toISOString().split('T')[0],
            dayName: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()],
            dayNumber: d.getDate(),
        });
    }
    return dates;
};
const MOCK_DATES = getMockDates();

// --- COMPONENT PHỤ: THẺ SỰ KIỆN LỊCH DẠY ---
const ScheduleEventCard = ({ event, onPress }) => (
    <TouchableOpacity style={styles.eventCard} onPress={onPress}>
        <View style={[styles.eventTimePill, { backgroundColor: event.color + '20', borderColor: event.color }]}>
            <Text style={[styles.eventTimeText, { color: event.color }]}>{event.time}</Text>
            <Text style={[styles.eventTimeText, { color: event.color }]}>{event.endTime}</Text>
        </View>
        <View style={styles.eventInfo}>
            <Text style={styles.eventClass}>{event.class}</Text>
            <Text style={styles.eventTeacher}>GV: {event.teacher}</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
    </TouchableOpacity>
);

export default function AdminTeachingScheduleScreen() {
    const router = useRouter(); 
    const [selectedDate, setSelectedDate] = useState(MOCK_DATES[0].dateString);

    const handleNavigateToEventDetails = (eventId: number) => {
        router.push(`/admin/schedule_details?id=${eventId}`);
    };

    // --- LOGIC LỌC LỊCH THEO NGÀY ---
    const filteredEvents = useMemo(() => {
        return FULL_SCHEDULE_DATA.filter(event => event.date === selectedDate);
    }, [selectedDate]);

    // --- RENDER COMPONENT ---
    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Toàn bộ Lịch Dạy' }} />

            {/* PHẦN 1: THANH CHỌN NGÀY */}
            <View style={styles.dateSelectorContainer}>
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
                    {filteredEvents.length} Sự kiện vào {MOCK_DATES.find(d => d.dateString === selectedDate)?.dayName}
                </Text>
                
                <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ScheduleEventCard 
                            event={item} 
                            onPress={() => handleNavigateToEventDetails(item.id)}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="sunny-outline" size={40} color="#ccc" />
                            <Text style={styles.emptyText}>Không có sự kiện giảng dạy nào.</Text>
                        </View>
                    )}
                />
            </View>
            
            {/* Nút Thêm Sự kiện (Floating Button) */}
            <TouchableOpacity style={styles.floatingButton} onPress={() => router.push('/admin/add_schedule')}>
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    
    // 1. DATE SELECTOR
    dateSelectorContainer: { 
        paddingVertical: 10, 
        backgroundColor: 'white', 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee' 
    },
    datePill: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    datePillActive: {
        backgroundColor: '#007bff',
    },
    dayName: { fontSize: 11, color: '#666' },
    dayNameActive: { color: 'white', fontWeight: 'bold' },
    dayNumber: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 3 },
    dayNumberActive: { color: 'white' },

    // 2. SCHEDULE LIST
    scheduleListContainer: { 
        flex: 1, 
        paddingHorizontal: 15, 
        paddingTop: 15 
    },
    listTitle: { fontSize: 16, fontWeight: '600', color: '#555', marginBottom: 10 },
    eventCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 1,
        shadowOpacity: 0.05,
        shadowRadius: 2,
        alignItems: 'center',
    },
    eventTimePill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 15,
        width: 70, // Cố định chiều rộng
        alignItems: 'center',
        borderWidth: 1,
    },
    eventTimeText: { fontSize: 11, fontWeight: 'bold' },
    eventInfo: { flex: 1 },
    eventClass: { fontSize: 15, fontWeight: '700', color: '#333' },
    eventTeacher: { fontSize: 13, color: '#666', marginTop: 2 },

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
        backgroundColor: '#dc3545',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4 } }),
    }
});