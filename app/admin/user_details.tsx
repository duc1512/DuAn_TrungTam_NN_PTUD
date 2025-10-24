import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// IMPORT DỮ LIỆU GLOBAL (Giả định đã có)
import { CURRENT_USERS } from "./accounts";

// Định nghĩa Interface (Giữ nguyên)
interface User {
    id: string;
    name: string;
    role: 'Giảng viên' | 'Học viên' | 'Admin';
    email: string;
    status: string;
    phone?: string; 
}

export default function UserDetailsScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const userId = params.id as string;
    
    const [userData, setUserData] = useState<User | undefined>(undefined);
    const [isEditing, setIsEditing] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false); 
    const [newPassword, setNewPassword] = useState(''); 

    const ROLES = ['Học viên', 'Giảng viên', 'Admin'];

    // LOGIC TẢI DỮ LIỆU
    useEffect(() => {
        const foundUser = CURRENT_USERS.find(u => u.id === userId);
        if (foundUser) {
            setUserData({...foundUser}); 
        } else {
            Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng này.");
            router.back();
        }
    }, [userId]);

    const handleUpdateField = (key: keyof User, value: string) => {
        setUserData(prev => prev ? ({...prev, [key]: value}) : undefined);
    };

    const handleSave = () => {
        if (!userData || !userData.name || !userData.email) {
            Alert.alert("Lỗi", "Tên và Email không được để trống.");
            return;
        }

        const index = CURRENT_USERS.findIndex(u => u.id === userId);
        if (index !== -1) {
            CURRENT_USERS[index] = userData;
            
            Alert.alert("Thành công", `Đã lưu thông tin mới cho ${userData.name}.`);
            setIsEditing(false);
        } else {
             Alert.alert("Lỗi", "Không thể tìm thấy người dùng để cập nhật.");
        }
    };
    
    // HÀM XỬ LÝ XÓA TÀI KHOẢN (ĐÃ ÁP DỤNG FIX LỖI SỰ KIỆN)
    const handleDelete = () => {
        // Áp dụng setTimeout để đảm bảo hộp thoại ALERT được ưu tiên hiển thị
        setTimeout(() => {
            Alert.alert(
                "Xác nhận Xóa Tài khoản",
                `Bạn có chắc chắn muốn xóa vĩnh viễn hồ sơ của ${userData?.name} (${userData?.id})? Hành động này không thể hoàn tác.`,
                [
                    { text: "HỦY", style: "cancel" },
                    { 
                        text: "XÓA VĨNH VIỄN", 
                        style: "destructive", 
                        onPress: () => {
                            const index = CURRENT_USERS.findIndex(u => u.id === userId);
                            if (index !== -1) {
                                CURRENT_USERS.splice(index, 1); 
                                
                                // Dùng setTimeout lần nữa để đảm bảo Alert thứ hai hiển thị sau khi xử lý xóa
                                setTimeout(() => {
                                    Alert.alert("Thành công", `Tài khoản ${userData?.name} đã bị xóa.`);
                                    router.back(); 
                                }, 100); 
                            }
                        }
                    },
                ]
            );
        }, 10); // Thêm một độ trễ nhỏ để tách biệt sự kiện
    };

    // HÀM XỬ LÝ RESET MẬT KHẨU
    const handlePasswordReset = () => {
        if (newPassword.length < 6) {
            Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        Alert.alert("Thành công", `Mật khẩu mới đã được đặt cho ${userData?.name}.`);
        setNewPassword('');
        setIsResettingPassword(false);
    };


    if (!userData) {
        return <View style={styles.loadingContainer}><Text>Đang tải...</Text></View>;
    }
    
    // Component hiển thị trường thông tin (dạng Text hoặc Input)
    const InfoRow = ({ label, value, stateKey, isRequired = false }: { label: string, value: string, stateKey?: keyof User, isRequired?: boolean }) => (
        <View style={styles.infoRow}>
            <Text style={styles.label}>{label}{isRequired && ' *'}:</Text>
            {isEditing && stateKey ? (
                <TextInput 
                    style={styles.inputField} 
                    value={value} 
                    onChangeText={(text) => handleUpdateField(stateKey, text)} 
                    editable={isEditing}
                />
            ) : (
                <Text style={styles.value}>{value}</Text>
            )}
        </View>
    );

    return (
        <ScrollView style={styles.scrollContainer}>
            <Stack.Screen 
                options={{ 
                    title: `Chi tiết: ${userData.name}`,
                    headerRight: () => isEditing ? (
                        <TouchableOpacity onPress={handleSave} style={{ marginRight: 10 }}>
                            <Ionicons name="save-outline" size={24} color="#007bff" />
                        </TouchableOpacity>
                    ) : (
                         <TouchableOpacity onPress={() => setIsEditing(true)} style={{ marginRight: 10 }}>
                            <Ionicons name="create-outline" size={24} color="#007bff" />
                        </TouchableOpacity>
                    )
                }} 
            />

            {/* PROFILE HEADER */}
            <View style={styles.header}>
                <Text style={styles.nameText}>{userData.name}</Text>
                <Text style={styles.idText}>ID: {userData.id}</Text>
            </View>

            {/* THÔNG TIN CƠ BẢN */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông tin Cơ bản</Text>
                
                <InfoRow label="Họ và Tên" value={userData.name} stateKey="name" isRequired={true} />
                <InfoRow label="Email" value={userData.email} stateKey="email" isRequired={true} />
                <InfoRow label="Điện thoại" value={userData.phone || 'Chưa cập nhật'} stateKey="phone" />
                
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Vai trò:</Text>
                    {isEditing ? (
                        <View style={styles.roleSelector}>
                            {ROLES.map(r => (
                                <TouchableOpacity 
                                    key={r}
                                    style={[styles.roleButton, userData.role === r && styles.roleButtonActive]}
                                    onPress={() => handleUpdateField('role', r)}
                                >
                                    <Text style={[styles.roleText, userData.role === r && styles.roleTextActive]}>{r}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                         <Text style={[styles.roleTag, userData.role === 'Giảng viên' ? styles.tagGiangVien : styles.tagHocVien]}>
                            {userData.role}
                        </Text>
                    )}
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Trạng thái:</Text>
                    <Text style={[styles.value, userData.status === 'Active' ? styles.statusActive : styles.statusInactive]}>
                        {userData.status === 'Active' ? 'Hoạt động' : 'Tạm khóa'}
                    </Text>
                </View>
            </View>
            
            {/* TÁC VỤ KHÁC */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Các Tác vụ Khác</Text>
                
                {/* NÚT RESET MẬT KHẨU */}
                <TouchableOpacity style={styles.actionButton} onPress={() => setIsResettingPassword(true)}>
                    <Ionicons name="lock-closed-outline" size={20} color="#007bff" />
                    <Text style={styles.actionText}>Reset Mật khẩu</Text>
                </TouchableOpacity>
                
                {/* NÚT CẬP NHẬT THÔNG TIN */}
                <TouchableOpacity 
                    style={[styles.actionButton, isEditing && styles.actionButtonActive]} 
                    onPress={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                    <Ionicons name={isEditing ? "save-outline" : "create-outline"} size={20} color={isEditing ? "white" : "#007bff"} />
                    <Text style={[styles.actionText, isEditing && styles.actionTextActive]}>
                        {isEditing ? "LƯU THAY ĐỔI" : "CẬP NHẬT THÔNG TIN"}
                    </Text>
                </TouchableOpacity>

                {/* XÓA TÀI KHOẢN (GỌI HÀM XÁC NHẬN VÀ XÓA) */}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={20} color="white" />
                    <Text style={styles.deleteText}>Xóa Tài khoản</Text>
                </TouchableOpacity>
                
                {isEditing && (
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                        <Text style={styles.cancelText}>Hủy Chỉnh sửa</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* MODAL RESET MẬT KHẨU (GIAO DIỆN) */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isResettingPassword}
                onRequestClose={() => setIsResettingPassword(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Đặt lại Mật khẩu</Text>
                        <Text style={styles.modalSubtitle}>Cho tài khoản: {userData.name}</Text>
                        
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                            secureTextEntry={true}
                            onChangeText={setNewPassword}
                            value={newPassword}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setIsResettingPassword(false)}>
                                <Text style={styles.modalCancelText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalConfirm} onPress={handlePasswordReset}>
                                <Text style={styles.modalConfirmText}>Đặt lại</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
    
    scrollContainer: { flex: 1, backgroundColor: '#f5f5f5' },
    errorText: { fontSize: 18, color: '#dc3545' },
    backButton: { color: '#007bff', marginTop: 15, fontSize: 16 },

    header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 10 },
    nameText: { fontSize: 24, fontWeight: 'bold', color: '#007bff' },
    idText: { fontSize: 14, color: '#666', marginTop: 5 },

    section: { backgroundColor: '#fff', padding: 15, marginHorizontal: 10, borderRadius: 10, marginBottom: 15, elevation: 2 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
    
    infoRow: { flexDirection: 'row', paddingVertical: 8, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
    label: { width: 100, fontWeight: '600', color: '#555', fontSize: 15 },
    value: { flex: 1, color: '#333', fontSize: 15 },
    inputField: { flex: 1, color: '#333', fontSize: 15, borderBottomWidth: 1, borderBottomColor: '#007bff50', paddingVertical: 2 },

    // Role Selector Styles
    roleSelector: { flexDirection: 'row', flex: 1, flexWrap: 'wrap' },
    roleButton: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15, backgroundColor: '#eee', marginRight: 8 },
    roleButtonActive: { backgroundColor: '#007bff' },
    roleText: { color: '#333', fontWeight: '500', fontSize: 12 },
    roleTextActive: { color: 'white', fontWeight: 'bold', fontSize: 12 },

    // Tag Styles
    roleTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontWeight: 'bold', fontSize: 12, overflow: 'hidden' },
    tagGiangVien: { backgroundColor: '#ff7043', color: 'white' },
    tagHocVien: { backgroundColor: '#fdd835', color: '#333' },
    statusActive: { color: '#28a745', fontWeight: 'bold' },
    statusInactive: { color: '#dc3545', fontWeight: 'bold' },

    // Action Buttons
    actionButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 12, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee', 
        backgroundColor: 'transparent' 
    },
    actionButtonActive: { 
        backgroundColor: '#007bff', 
        borderRadius: 8, 
        borderBottomWidth: 0,
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5
    },
    actionText: { marginLeft: 10, color: '#007bff', fontWeight: '600' },
    actionTextActive: { color: 'white', fontWeight: 'bold' },
    
    deleteButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#dc3545', 
        padding: 12, 
        borderRadius: 8, 
        marginTop: 10, 
        justifyContent: 'center' 
    },
    deleteText: { marginLeft: 10, color: 'white', fontWeight: 'bold', fontSize: 16 },
    
    cancelButton: { alignItems: 'center', paddingVertical: 10 },
    cancelText: { color: '#888', fontWeight: '500' },

    // Styles cho Modal
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#007bff',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    modalInput: {
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalCancel: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#eee',
        marginRight: 10,
        alignItems: 'center',
    },
    modalCancelText: {
        fontWeight: 'bold',
        color: '#555',
    },
    modalConfirm: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#007bff',
        alignItems: 'center',
    },
    modalConfirmText: {
        fontWeight: 'bold',
        color: 'white',
    },
});