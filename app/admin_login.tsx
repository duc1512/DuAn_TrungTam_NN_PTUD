import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AdminLoginScreen() {
  const router = useRouter();
  const roleName = "Admin";
  const mainColorLight = "#4d94ff";
  const mainColorDark = "#0056b3";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // ✅ HÀM XỬ LÝ ĐĂNG NHẬP
  const handleLogin = () => {
    // Reset lỗi cũ
    setErrorMessage("");

    // Kiểm tra tài khoản
    if (email === "admin123" && password === "01203455") {
      router.replace("/admin_dashboard");
    } else {
      setErrorMessage("Tài khoản hoặc mật khẩu không chính xác!");
    }
  };

  // ✅ HÀM QUÊN MẬT KHẨU
  const handleForgotPassword = () => {
    router.push("/forgot_pass_admin");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Đăng nhập",
          headerShown: true,
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#000",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      {/* Logo */}
      <Image
        source={require("../assets/images/logo1.png")}
        style={styles.logo}
      />

      <Text style={[styles.roleTitle, { color: mainColorDark }]}>
        {roleName}
      </Text>

      {/* FORM */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập Email/SĐT"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Nhập mật khẩu..."
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity style={styles.iconEye} onPress={toggleShowPassword}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButtonWrapper}
          onPress={handleLogin}
        >
          <LinearGradient
            colors={[mainColorLight, mainColorDark]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientButton}
          >
            <Text style={styles.loginText}>Đăng nhập</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* 🔴 THÔNG BÁO LỖI */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <View style={styles.dividerContainer}>
          <Text style={styles.dividerText}>or</Text>
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={handleForgotPassword}
        >
          <Text
            style={[styles.forgotPasswordText, { color: mainColorDark }]}
          >
            Quên mật khẩu ?
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.terms}>
        Bằng cách tiếp tục, bạn đồng ý với
        <Text style={styles.termsLink}> Điều khoản dịch vụ </Text>
        và
        <Text style={styles.termsLink}> Chính sách bảo mật</Text>
      </Text>
    </View>
  );
}

// 🎨 STYLE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginTop: 20,
  },
  roleTitle: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 25,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    fontSize: 16,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  inputPassword: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  iconEye: {
    padding: 10,
  },
  loginButtonWrapper: {
    width: "100%",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  gradientButton: {
    padding: 14,
    alignItems: "center",
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "500",
  },
  dividerContainer: {
    marginBottom: 15,
  },
  dividerText: {
    fontSize: 14,
    color: "#aaaaaa",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  forgotPassword: {
    marginBottom: 50,
  },
  forgotPasswordText: {
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  terms: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: "auto",
  },
  termsLink: {
    fontWeight: "bold",
    color: "#555",
  },
});
