import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- DỮ LIỆU CÓ THỂ THAY ĐỔI (DÙNG CHUNG CHO PROFILE VÀ EDIT) ---
let MUTABLE_STUDENT_PROFILE = {
    id: 'HV2001',
    name: 'Trần Duy Hà',
    role: 'Học viên',
    email: 'ha.t@tdd.edu',
    phone: '0901234567', 
    totalCourses: 3,
    avgScore: 7.8,
    status: 'Đang học',
    joinDate: '01/09/2024',
};

const MAIN_ACCENT_COLOR = '#007bff'; // Màu chủ đạo Học viên
const SECONDARY_COLOR = '#ff7043'; // Màu cam
const PASS_COLOR = '#28a745'; // Xanh lá

// HÀM FORMAT SỐ ĐIỆN THOẠI
const formatPhoneNumber = (phone: string) => {
    if (!phone) return 'N/A';
    const numbers = phone.replace(/[^0-9]/g, ''); 
    if (numbers.length >= 10 && numbers.length <= 11) {
        return `${numbers.substring(0, 4)} ${numbers.substring(4, 7)} ${numbers.substring(7)}`;
    }
    return phone; 
};

// --- COMPONENT PHỤ: HÀNG THÔNG TIN CHI TIẾT ---
interface ProfileRowProps {
    icon: keyof typeof Ionicons.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    value: string | number;
    color: string;
    isAction?: boolean; 
    onPress?: () => void;
}
const ProfileRow: React.FC<ProfileRowProps> = ({ icon, label, value, color, isAction = false, onPress }) => (
    <TouchableOpacity 
        style={styles.detailRow} 
        onPress={onPress}
        disabled={!isAction}
    >
        <Ionicons name={icon as any} size={22} color={color} style={{marginRight: 15}} />
        <View style={styles.detailTextWrapper}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
        {isAction && <Ionicons name="chevron-forward-outline" size={20} color="#666" />}
    </TouchableOpacity>
);
// ---------------------------------------------


export default function HocVienProfileScreen() {
    const router = useRouter(); 
    // State để lưu trữ dữ liệu hiện tại
    const [currentProfile, setCurrentProfile] = useState(MUTABLE_STUDENT_PROFILE);
    
    // TẢI LẠI DỮ LIỆU ĐƯỢC ĐẢM BẢO KHI QUAY LẠI TỪ MÀN HÌNH CHỈNH SỬA
    const loadProfileData = () => {
        // TẠO BẢN SAO SÂU (Deep Copy) để đọc dữ liệu mới nhất
        const latestData = JSON.parse(JSON.stringify(MUTABLE_STUDENT_PROFILE));

        setCurrentProfile({
            ...latestData, 
            phone: formatPhoneNumber(latestData.phone) 
        });
    };

    // useFocusEffect: Kích hoạt loadProfileData mỗi khi màn hình được tập trung
    useFocusEffect(
        useCallback(() => {
            loadProfileData();
            return () => {};
        }, [])
    );
    
    const handleEditProfile = () => {
        router.push('/hocvien/edit_profile'); // Trang chỉnh sửa thông tin cá nhân (cần tạo)
    };

    const handleChangePassword = () => {
        alert('Mở form đổi mật khẩu.');
    };

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{paddingBottom: 40}}>
            <Stack.Screen 
                options={{ 
                    title: 'Thông tin Cá nhân',
                    headerRight: () => (
                         <TouchableOpacity onPress={handleEditProfile} style={{ marginRight: 10 }}>
                            <Ionicons name="create-outline" size={24} color={MAIN_ACCENT_COLOR} />
                        </TouchableOpacity>
                    )
                }} 
            />

            {/* PHẦN 1: HEADER & AVATAR */}
            <View style={styles.profileHeader}>
                <Ionicons name="person-circle-outline" size={100} color={MAIN_ACCENT_COLOR} />
                <Text style={styles.profileName}>{currentProfile.name}</Text>
                <Text style={styles.profileRole}>{currentProfile.role} | {currentProfile.id}</Text>
            </View>

            {/* PHẦN 2: THỐNG KÊ TIẾN ĐỘ */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Tiến độ Học tập</Text>
                <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricValue}>{currentProfile.totalCourses}</Text>
                        <Text style={styles.metricLabel}>Khóa học Đã đăng ký</Text>
                    </View>
                    <View style={styles.metricItem}>
                        <Text style={[styles.metricValue, {color: PASS_COLOR}]}>{currentProfile.avgScore.toFixed(1)}</Text>
                        <Text style={styles.metricLabel}>ĐTB Tích lũy</Text>
                    </View>
                    <View style={styles.metricItem}>
                        <Text style={[styles.metricValue, {color: SECONDARY_COLOR}]}>89%</Text>
                        <Text style={styles.metricLabel}>Tỉ lệ Hoàn thành</Text>
                    </View>
                </View>
            </View>

            {/* PHẦN 3: THÔNG TIN LIÊN HỆ & CÁ NHÂN */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Thông tin Liên hệ</Text>
                
                <ProfileRow 
                    icon="mail-outline" 
                    label="Email" 
                    value={currentProfile.email} 
                    color="#007bff"
                />
                <ProfileRow 
                    icon="call-outline" 
                    label="Điện thoại" 
                    value={currentProfile.phone} 
                    color="#28a745"
                />
                <ProfileRow 
                    icon="ribbon-outline" 
                    label="Trạng thái" 
                    value={currentProfile.status} 
                    color={MAIN_ACCENT_COLOR}
                />
                <ProfileRow 
                    icon="calendar-outline" 
                    label="Ngày gia nhập" 
                    value={currentProfile.joinDate} 
                    color="#666"
                />
            </View>

            {/* PHẦN 4: CÀI ĐẶT TÀI KHOẢN */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Cài đặt Tài khoản</Text>
                
                <ProfileRow 
                    icon="lock-closed-outline" 
                    label="Đổi mật khẩu" 
                    value="Cập nhật mật khẩu bảo mật" 
                    color="#dc3545"
                    isAction 
                    onPress={handleChangePassword}
                />
                <ProfileRow 
                    icon="log-out-outline" 
                    label="Đăng xuất" 
                    value="Thoát khỏi hệ thống" 
                    color="#333"
                    isAction 
                    onPress={() => router.replace('/hocvien_login')}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f0f3f5' },
    profileHeader: { padding: 20, backgroundColor: 'white', alignItems: 'center', marginBottom: 10 },
    profileName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 10 },
    profileRole: { fontSize: 14, color: '#666', marginTop: 5, marginBottom: 10 },
    card: { padding: 15, backgroundColor: 'white', marginHorizontal: 15, marginBottom: 15, borderRadius: 10, elevation: 3, shadowOpacity: 0.1 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
    metricsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    metricItem: { width: '30%', padding: 5, borderRadius: 8, alignItems: 'center' },
    metricValue: { fontSize: 22, fontWeight: 'bold', color: MAIN_ACCENT_COLOR, marginTop: 5 },
    metricLabel: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 3 },
    detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f7f7f7' },
    detailTextWrapper: { flex: 1, flexDirection: 'column', marginRight: 10 },
    detailLabel: { fontSize: 13, color: '#999' },
    detailValue: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 2 },
});