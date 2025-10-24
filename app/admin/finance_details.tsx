import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// =========================================================================
// I. INTERFACES VÀ DỮ LIỆU
// =========================================================================

interface Transaction {
    date: string; type: string; amount: number; note: string; isDebt: boolean; transactionId: string;
}

interface FinanceDetail {
    id: string; studentName: string; studentId: string; studentPhone: string; type: string; totalAmount: number; paidAmount: number; remainingAmount: number; dueDate: string; status: string; color: string; description: string; transactions: Transaction[];
}

// DỮ LIỆU MẪU (Đã khôi phục)
const FULL_FINANCE_DATA: Record<string, FinanceDetail> = {
    'F001': { id: 'F001', studentName: 'Nguyễn Văn A', studentId: 'HV2001', studentPhone: '0901234567', type: 'Công nợ Học phí', totalAmount: 3500000, paidAmount: 0, remainingAmount: 3500000, dueDate: '01/10/2025', status: 'Quá hạn', color: '#dc3545', description: 'Học phí khóa IELTS Foundation', transactions: [{ date: '15/08/2025', type: 'Phát sinh công nợ', amount: 3500000, note: 'Khóa IELTS Foundation (Hợp đồng #1234)', isDebt: true, transactionId: 'T001' }] },
    'F009': { id: 'F009', studentName: 'Mai Thị H', studentId: 'HV2009', studentPhone: '0912345678', type: 'Học phí', totalAmount: 3000000, paidAmount: 1000000, remainingAmount: 2000000, dueDate: '05/11/2025', status: 'Sắp đến hạn', color: '#ffc107', description: 'Học phí khóa TOEIC 600+', transactions: [{ date: '25/10/2025', type: 'Thanh toán', amount: 1000000, note: 'Thanh toán đợt 1 tiền mặt', isDebt: false, transactionId: 'T003' }, { date: '01/10/2025', type: 'Phát sinh học phí', amount: 3000000, note: 'Hóa đơn khóa học TOEIC', isDebt: true, transactionId: 'T002' }] },
    'F005': { id: 'F005', studentName: 'Lê Thị D', studentId: 'HV2005', studentPhone: '0987654321', type: 'Học phí', totalAmount: 4800000, paidAmount: 4800000, remainingAmount: 0, dueDate: '10/10/2025', status: 'Đã thanh toán', color: '#28a745', description: 'Học phí khóa Giao tiếp chuyên sâu', transactions: [{ date: '10/10/2025', type: 'Thanh toán', amount: 4800000, note: 'Thanh toán toàn bộ chuyển khoản', isDebt: false, transactionId: 'T005' }, { date: '01/10/2025', type: 'Phát sinh học phí', amount: 4800000, note: 'Hóa đơn khóa học Giao tiếp', isDebt: true, transactionId: 'T004' }] }
};

// BƯỚC KHẮC PHỤC: ĐỊNH NGHĨA SHADOW BÊN NGOÀI STYLESHEET.CREATE
const SHARED_SHADOW_STYLE = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    android: {
        elevation: 3,
    }
});


export default function FinanceDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const financeId = params.financeId as string;

    const data: FinanceDetail = FULL_FINANCE_DATA[financeId] || FULL_FINANCE_DATA['F001']; 

    const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + ' VNĐ';

    const handleAction = (action: string) => {
        Alert.alert(`${action}`, `Bạn muốn thực hiện hành động "${action}" cho công nợ của ${data.studentName} (ID: ${financeId})?`);
    };

    const CustomHeaderLeft = () => (
        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <Ionicons name="arrow-back" size={24} color="#333" /> 
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
            <Stack.Screen 
                options={{ 
                    title: `Công nợ: ${data.studentName}`,
                    headerLeft: CustomHeaderLeft,
                }} 
            /> 
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* THẺ TỔNG QUAN VÀ TRẠNG THÁI */}
                {/* SỬ DỤNG SPREAD OPERATOR ĐỂ ÁP DỤNG SHADOW BÊN NGOÀI */}
                <View style={[styles.summaryCard, { borderLeftColor: data.color }, SHARED_SHADOW_STYLE]}> 
                    <View style={styles.summaryHeader}>
                        <Text style={styles.studentName}>{data.studentName} ({data.studentId})</Text>
                        <View style={[styles.statusTag, { backgroundColor: data.color }]}>
                            <Text style={styles.statusText}>{data.status}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                         <Ionicons name="person-outline" size={16} color="#007bff" />
                         <Text style={styles.detailText}>ID HV: <Text style={styles.boldText}>{data.studentId}</Text></Text>
                    </View>
                    <View style={styles.infoRow}>
                         <Ionicons name="call-outline" size={16} color="#007bff" />
                         <Text style={styles.detailText}>SĐT: <Text style={styles.boldText} onPress={() => Alert.alert('Gọi điện', `Liên hệ ${data.studentPhone}`)}>{data.studentPhone}</Text></Text>
                    </View>
                    <View style={styles.infoRow}>
                         <Ionicons name="calendar-outline" size={16} color="#007bff" />
                         <Text style={styles.detailText}>Hạn: <Text style={[styles.boldText, data.status === 'Quá hạn' && { color: '#dc3545' }]}>{data.dueDate}</Text></Text>
                    </View>
                    <Text style={styles.descriptionText}>
                        <Ionicons name="reader-outline" size={16} color="#007bff" />
                        {' '}Mô tả: {data.description}
                    </Text>
                </View>

                {/* THẺ SỐ TIỀN */}
                <View style={[styles.amountCard, SHARED_SHADOW_STYLE]}>
                    <Text style={styles.cardTitle}>💰 Chi tiết Thanh toán</Text>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Tổng công nợ phát sinh:</Text>
                        <Text style={[styles.amountValue, { color: '#333' }]}>{formatCurrency(data.totalAmount)}</Text>
                    </View>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Đã thanh toán:</Text>
                        <Text style={[styles.amountValue, { color: '#28a745' }]}>{formatCurrency(data.paidAmount)}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabelRemaining}>CẦN THANH TOÁN (Còn lại):</Text>
                        <Text style={[styles.amountValue, styles.remainingAmount]}>{formatCurrency(data.remainingAmount)}</Text>
                    </View>
                </View>

                {/* THẺ LỊCH SỬ GIAO DỊCH */}
                <View style={[styles.historyCard, SHARED_SHADOW_STYLE]}>
                    <Text style={styles.cardTitle}>📜 Lịch sử Giao dịch</Text>
                    {data.transactions.map((t: Transaction, index: number) => (
                        <View key={t.transactionId} style={styles.transactionItem}>
                            <FontAwesome 
                                name={t.isDebt ? "arrow-circle-up" : "arrow-circle-down"} 
                                size={20} 
                                color={t.isDebt ? '#dc3545' : '#28a745'} 
                                style={{marginRight: 10}}
                            />
                            <View style={styles.historyInfo}>
                                <Text style={styles.historyNote}>{t.note}</Text>
                                <Text style={styles.historyDate}>Ngày: {t.date} | Loại: {t.type}</Text>
                            </View>
                            <Text style={[
                                styles.historyAmount, 
                                t.isDebt ? styles.debtAmount : styles.paidAmount
                            ]}>
                                {t.isDebt ? '-' : '+'} {formatCurrency(t.amount)}
                            </Text>
                        </View>
                    ))}
                    {data.transactions.length === 0 && (
                        <Text style={{ textAlign: 'center', color: '#999', paddingVertical: 10 }}>Không có giao dịch nào.</Text>
                    )}
                </View>

            </ScrollView>

            {/* THANH HÀNH ĐỘNG CỐ ĐỊNH Ở DƯỚI */}
            <View style={[styles.actionFooter, SHARED_SHADOW_STYLE]}>
                <TouchableOpacity 
                    style={styles.remindButton} 
                    onPress={() => handleAction('Gửi nhắc nhở')}
                >
                    <Ionicons name="chatbox-ellipses-outline" size={20} color="#007bff" />
                    <Text style={styles.remindButtonText}>Nhắc nhở (Zalo/SMS)</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.payButton, data.remainingAmount === 0 && styles.payButtonDisabled]} 
                    onPress={() => handleAction('Thanh toán/Ghi nhận')}
                    disabled={data.remainingAmount === 0}
                >
                    <MaterialCommunityIcons name="receipt" size={20} color="white" />
                    <Text style={styles.payButtonText}>GHI NHẬN TT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// KHỐI STYLES ĐÃ KHẮC PHỤC LỖI TS(7022)
const styles = StyleSheet.create({
    // SUMMARY CARD styles: ... (Bỏ cardShadow khỏi đây và sử dụng SHARED_SHADOW_STYLE bên ngoài)
    // ... (Khối styles giữ nguyên) ...
    mainContainer: { flex: 1, backgroundColor: '#f5f5f5' },
    scrollContent: { padding: 15 },
    
    // Summary Card
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 5, 
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    studentName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    statusTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        minWidth: 90,
        alignItems: 'center',
    },
    statusText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    
    infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    detailText: { fontSize: 14, color: '#666', marginLeft: 8 },
    descriptionText: { fontSize: 14, color: '#666', marginTop: 10, paddingLeft: 24, lineHeight: 20 },
    boldText: { fontWeight: '600', color: '#333' },
    
    // Amount Card
    amountCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#007bff', marginBottom: 10 },
    amountRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
    amountLabel: { fontSize: 15, color: '#666' },
    amountLabelRemaining: { fontSize: 16, color: '#333', fontWeight: 'bold' },
    amountValue: { fontSize: 15, fontWeight: '600' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
    remainingAmount: { fontSize: 20, fontWeight: 'bold', color: '#dc3545' },

    // History Card
    historyCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    historyInfo: { flex: 1, marginRight: 10 },
    historyDate: { fontSize: 12, color: '#999', marginTop: 2 },
    historyNote: { fontSize: 14, color: '#333', fontWeight: '500' },
    historyAmount: { fontSize: 15, fontWeight: 'bold' },
    paidAmount: { color: '#28a745' },
    debtAmount: { color: '#dc3545' },

    // Action Footer
    actionFooter: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    remindButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#007bff',
    },
    remindButtonText: { color: '#007bff', fontWeight: 'bold', marginLeft: 8, fontSize: 13 },

    payButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#28a745',
    },
    payButtonDisabled: {
        backgroundColor: '#ccc',
    },
    payButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 8, fontSize: 13 },
});