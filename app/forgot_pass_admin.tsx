import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [emailOrSdt, setEmailOrSdt] = useState('');
    const mainColor = '#0056b3'; // Màu xanh đậm Admin

    // Hàm xử lý khi gửi yêu cầu quên mật khẩu
    const handleSubmit = () => {
        if (!emailOrSdt) {
            alert("Vui lòng nhập Email hoặc SĐT đã đăng ký!");
            return;
        }
        
        // **GIẢ ĐỊNH LOGIC GỬI YÊU CẦU**
        alert(`Yêu cầu đặt lại mật khẩu đã được gửi đến ${emailOrSdt}. Vui lòng kiểm tra.`);
        
        // Sau khi gửi yêu cầu, chuyển người dùng về trang đăng nhập
        router.replace('/admin_login'); 
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            
            {/* Tùy chỉnh Header */}
            <Stack.Screen 
                options={{ 
                    title: "Quên Mật Khẩu", 
                    headerShown: true,
                    headerStyle: { backgroundColor: '#fff' },
                    headerTintColor: '#000',
                    headerTitleStyle: { fontWeight: 'bold' }
                }} 
            />

            <View style={styles.content}>
                <MaterialCommunityIcons name="lock-reset" size={80} color={mainColor} style={styles.icon} />
                
                <Text style={styles.title}>Quên Mật Khẩu?</Text>
                <Text style={styles.subtitle}>
                    Vui lòng nhập Email hoặc Số điện thoại đã đăng ký để đặt lại mật khẩu.
                </Text>

                {/* Input Email/SĐT */}
                <TextInput
                    style={styles.input}
                    placeholder="Email hoặc SĐT"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={setEmailOrSdt}
                    value={emailOrSdt}
                />

                {/* Nút Gửi Yêu cầu */}
                <TouchableOpacity 
                    style={[styles.submitButton, { backgroundColor: mainColor }]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitText}>GỬI YÊU CẦU</Text>
                </TouchableOpacity>

                {/* Nút Quay lại Đăng nhập */}
                <TouchableOpacity 
                    onPress={() => router.replace('/admin_login')}
                    style={styles.backButton}
                >
                    <Text style={styles.backText}>Quay lại </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
    },
    icon: {
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        color: '#666',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    submitButton: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    backButton: {
        marginTop: 20,
    },
    backText: {
        color: '#0056b3',
        fontSize: 16,
        fontWeight: '600',
    }
});