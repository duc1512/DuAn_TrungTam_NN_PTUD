import { Ionicons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// --- INTERFACE VÀ KHAI BÁO DỮ LIỆU ---
interface User {
    id: string;
    name: string;
    role: 'Giảng viên' | 'Học viên' | 'Admin'; 
    email: string;
    status: 'Active' | 'Inactive';
}

// 🔥 HÀM HELPER TẠO DỮ LIỆU THUẦN (50 HV, 15 GV)
const createPureUserData = (count: number, role: 'Học viên' | 'Giảng viên') => {
    const prefix = role === 'Học viên' ? 'HV' : 'GV';
    const users: User[] = [];

    for (let i = 1; i <= count; i++) {
        const index = i.toString().padStart(4, '0');
        // Ngẫu nhiên 20% là Inactive
        const status: 'Active' | 'Inactive' = (i % 5 === 0) ? 'Inactive' : 'Active';

        users.push({
            id: `${prefix}${index}`,
            name: `${role} ${index} TestName`,
            email: `${prefix.toLowerCase()}${index}@tdd.edu`,
            role: role,
            status: status,
        } as User);
    }
    return users;
};

// 🔥 DỮ LIỆU CHÍNH: 50 HỌC VIÊN + 15 GIẢNG VIÊN + 1 ADMIN
export let CURRENT_USERS: User[] = [ 
    // 1. Admin
    { id: 'ADM0001', name: 'Admin TDD', role: 'Admin', email: 'admin@tdd.edu', status: 'Active' },
    // 2. 15 Giảng viên
    ...createPureUserData(15, 'Giảng viên'),
    // 3. 50 Học viên
    ...createPureUserData(50, 'Học viên'),
];

const ROLES = ['Tất cả', 'Giảng viên', 'Học viên', 'Admin'];

// --------------------------------------------------------

export default function AdminAccountsScreen() {
    const router = useRouter(); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('Tất cả');
    
    // BƯỚC 2: SỬ DỤNG STATE ĐỂ QUẢN LÝ DANH SÁCH HIỂN THỊ
    const [allUsers, setAllUsers] = useState<User[]>(CURRENT_USERS); 

    // BƯỚC 3: DÙNG useFocusEffect ĐỂ TẢI LẠI DANH SÁCH KHI TRANG ĐƯỢC MỞ LẠI
    useFocusEffect(
        useCallback(() => {
            // Cập nhật state bằng dữ liệu mới nhất từ nguồn global (khi có người dùng mới được thêm)
            setAllUsers([...CURRENT_USERS]); 
        }, [])
    );
    
    // HÀM ĐIỀU HƯỚNG SANG TRANG THÊM MỚI
    const handleAddUser = () => {
        router.push('/admin/add_user'); 
    };

    // HÀM ĐIỀU HƯỚNG SANG TRANG CHI TIẾT
    const handleViewDetails = (userId: string) => {
        router.push({
            pathname: '/admin/user_details',
            params: { id: userId }
        });
    };

    // Logic Lọc Dữ liệu (Sử dụng allUsers)
    const filteredUsers = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return allUsers.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(term) || user.id.includes(searchTerm);
            const matchesRole = filterRole === 'Tất cả' || user.role === filterRole;
            return matchesSearch && matchesRole;
        });
    }, [searchTerm, filterRole, allUsers]);

    // HÀM RENDER TỪNG ITEM
    const renderUserItem = ({ item }: { item: User }) => (
        <TouchableOpacity style={styles.userItem} onPress={() => handleViewDetails(item.id)}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userId}>{item.id} | {item.email}</Text>
            </View>
            <View style={styles.userStatus}>
                <Text 
                    style={[styles.roleTag, { 
                        backgroundColor: item.role === 'Giảng viên' ? '#ff7043' : (item.role === 'Học viên' ? '#fdd835' : '#007bff'),
                        color: item.role === 'Học viên' ? '#333' : 'white' 
                    }]}
                >
                    {item.role}
                </Text>
                
                <TouchableOpacity style={styles.editButton} onPress={(e) => {
                    e.stopPropagation(); 
                    handleViewDetails(item.id);
                }}>
                    <Ionicons name="create-outline" size={22} color="#007bff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
    
    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ title: 'Quản lý Tài Khoản' }} />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Quản lý Tài Khoản Hệ thống</Text>
            </View>

            <View style={styles.controls}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Tìm kiếm theo Tên, Mã ID..."
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddUser}> 
                    <Ionicons name="person-add" size={20} color="white" />
                    <Text style={styles.addButtonText}>Thêm</Text>
                </TouchableOpacity>
            </View>

            {/* Lọc theo vai trò (Horizontal Scroll) */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {ROLES.map((role) => (
                        <TouchableOpacity 
                            key={role} 
                            style={[styles.filterButton, filterRole === role && styles.filterButtonActive]}
                            onPress={() => setFilterRole(role)}
                        >
                            <Text style={[styles.filterText, filterRole === role && styles.filterTextActive]}>
                                {role} ({role === 'Tất cả' ? allUsers.length : allUsers.filter(u => u.role === role).length})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Danh sách người dùng */}
            <Text style={styles.listHeader}>
                Tổng số Tài khoản phù hợp: {filteredUsers.length}
            </Text>
            
            <FlatList
                data={filteredUsers}
                renderItem={renderUserItem}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                initialNumToRender={10} 
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>Không tìm thấy tài khoản nào.</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },
    
    // Controls and Search
    controls: { flexDirection: 'row', padding: 15, alignItems: 'center', backgroundColor: '#fff' },
    searchInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, marginRight: 10, backgroundColor: '#fff' },
    addButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
    addButtonText: { color: 'white', marginLeft: 5, fontWeight: 'bold' },

    // Filters
    filterContainer: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    filterButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#eee', marginRight: 10 },
    filterButtonActive: { backgroundColor: '#007bff' },
    filterText: { color: '#333', fontWeight: '500', fontSize: 13 },
    filterTextActive: { color: 'white' },
    listHeader: { fontSize: 14, fontWeight: 'bold', color: '#555', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff' },

    // List Styles
    list: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
    listContent: { paddingBottom: 20 },

    userItem: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    userInfo: { flex: 1 },
    userName: { fontSize: 16, fontWeight: '600', color: '#333' },
    userId: { fontSize: 12, color: '#999', marginTop: 3 },
    userStatus: { flexDirection: 'row', alignItems: 'center' },
    roleTag: { 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 15, 
        fontSize: 10, 
        fontWeight: 'bold',
        marginLeft: 10,
        overflow: 'hidden'
    },
    editButton: { 
        marginLeft: 10, 
        padding: 5,
        borderRadius: 5,
    },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
});