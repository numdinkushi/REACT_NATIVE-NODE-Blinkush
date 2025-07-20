
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '@components/ui/CustomText';
import CustomHeader from '@components/ui/CustomHeader';
import { Colors, Fonts } from '@utils/Constants';
import { navigate } from '@utils/navigation-utils';
import { CartItem } from '@state/cartStore';

interface Address {
    id: string;
    label: string;
    address: string;
    isDefault: boolean;
}

interface PaymentMethod {
    id: string;
    type: 'card' | 'cash' | 'digital';
    label: string;
    details: string;
    icon: string;
}

interface CheckoutScreenProps {
    route: {
        params: {
            cartItems: CartItem[];
            total: number;
        };
    };
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ route }) => {
    const { cartItems, total } = route.params;

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Mock data - replace with actual data from your stores
    const addresses: Address[] = [
        {
            id: '1',
            label: 'Home',
            address: '123 Main St, Apartment 4B, New York, NY 10001',
            isDefault: true,
        },
        {
            id: '2',
            label: 'Work',
            address: '456 Business Ave, Suite 200, New York, NY 10002',
            isDefault: false,
        },
    ];

    const paymentMethods: PaymentMethod[] = [
        {
            id: '1',
            type: 'card',
            label: 'Credit Card',
            details: '**** **** **** 1234',
            icon: 'credit-card',
        },
        {
            id: '2',
            type: 'cash',
            label: 'Cash on Delivery',
            details: 'Pay when your order arrives',
            icon: 'cash',
        },
        {
            id: '3',
            type: 'digital',
            label: 'Digital Wallet',
            details: 'PayPal, Apple Pay, Google Pay',
            icon: 'wallet',
        },
    ];

    React.useEffect(() => {
        // Set default selections
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
            setSelectedAddress(defaultAddress);
        }
        setSelectedPayment(paymentMethods[0]);
    }, []);

    const handlePlaceOrder = async () => {
        if (!selectedAddress || !selectedPayment) {
            Alert.alert('Error', 'Please select delivery address and payment method');
            return;
        }

        setIsPlacingOrder(true);

        try {
            // Mock API call - replace with actual service
            const orderData = {
                items: cartItems,
                deliveryAddress: selectedAddress,
                paymentMethod: selectedPayment,
                deliveryInstructions,
                total,
            };

            // await placeOrder(orderData);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert(
                'Order Placed!',
                'Your order has been placed successfully. You will receive a confirmation shortly.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigate('OrderTracking', { orderId: 'ORD-123456' }),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const renderAddressOption = (address: Address) => (
        <TouchableOpacity
            key={address.id}
            style={[
                styles.addressOption,
                selectedAddress?.id === address.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedAddress(address)}
        >
            <View style={styles.addressHeader}>
                <View style={styles.addressLabelContainer}>
                    <Icon name="map-marker" size={20} color={Colors.primary} />
                    <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.addressLabel}>
                        {address.label}
                    </CustomText>
                    {address.isDefault && (
                        <View style={styles.defaultBadge}>
                            <CustomText variant="h9" style={styles.defaultBadgeText}>
                                Default
                            </CustomText>
                        </View>
                    )}
                </View>
                <View style={styles.radioButton}>
                    {selectedAddress?.id === address.id && (
                        <View style={styles.radioButtonSelected} />
                    )}
                </View>
            </View>
            <CustomText variant="h8" style={styles.addressText}>
                {address.address}
            </CustomText>
        </TouchableOpacity>
    );

    const renderPaymentOption = (payment: PaymentMethod) => (
        <TouchableOpacity
            key={payment.id}
            style={[
                styles.paymentOption,
                selectedPayment?.id === payment.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedPayment(payment)}
        >
            <View style={styles.paymentHeader}>
                <View style={styles.paymentLabelContainer}>
                    <Icon name={payment.icon} size={20} color={Colors.primary} />
                    <View style={styles.paymentTextContainer}>
                        <CustomText variant="h6" fontFamily={Fonts.Medium}>
                            {payment.label}
                        </CustomText>
                        <CustomText variant="h8" style={styles.paymentDetails}>
                            {payment.details}
                        </CustomText>
                    </View>
                </View>
                <View style={styles.radioButton}>
                    {selectedPayment?.id === payment.id && (
                        <View style={styles.radioButtonSelected} />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <CustomHeader title="Checkout" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Order Summary */}
                <View style={styles.section}>
                    <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
                        Order Summary
                    </CustomText>
                    <View style={styles.orderSummary}>
                        <CustomText variant="h7">
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                        </CustomText>
                        <CustomText variant="h6" fontFamily={Fonts.Medium}>
                            ${total.toFixed(2)}
                        </CustomText>
                    </View>
                </View>

                {/* Delivery Address */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
                            Delivery Address
                        </CustomText>
                        <TouchableOpacity onPress={() => navigate('AddressManagement')}>
                            <CustomText variant="h7" style={styles.addNewText}>
                                Add New
                            </CustomText>
                        </TouchableOpacity>
                    </View>
                    {addresses.map(renderAddressOption)}
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
                            Payment Method
                        </CustomText>
                        <TouchableOpacity onPress={() => navigate('PaymentMethods')}>
                            <CustomText variant="h7" style={styles.addNewText}>
                                Add New
                            </CustomText>
                        </TouchableOpacity>
                    </View>
                    {paymentMethods.map(renderPaymentOption)}
                </View>

                {/* Delivery Instructions */}
                <View style={styles.section}>
                    <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
                        Delivery Instructions (Optional)
                    </CustomText>
                    <TextInput
                        style={styles.instructionsInput}
                        placeholder="Add delivery instructions..."
                        value={deliveryInstructions}
                        onChangeText={setDeliveryInstructions}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>

                {/* Order Details */}
                <View style={styles.section}>
                    <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
                        Order Details
                    </CustomText>
                    {cartItems.map((item, index) => (
                        <View key={index} style={styles.orderItem}>
                            <CustomText variant="h7">
                                {item.count}x {item.item.name}
                            </CustomText>
                            <CustomText variant="h7">
                                ${(item.item.price * item.count).toFixed(2)}
                            </CustomText>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Place Order Button */}
            <View style={styles.checkoutContainer}>
                <TouchableOpacity
                    style={[styles.placeOrderButton, isPlacingOrder && styles.disabledButton]}
                    onPress={handlePlaceOrder}
                    disabled={isPlacingOrder}
                >
                    {isPlacingOrder ? (
                        <View style={styles.loadingContainer}>
                            <Icon name="loading" size={20} color="white" />
                            <CustomText variant="h6" style={styles.placeOrderText}>
                                Placing Order...
                            </CustomText>
                        </View>
                    ) : (
                        <CustomText variant="h6" style={styles.placeOrderText}>
                            Place Order • ${total.toFixed(2)}
                        </CustomText>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    addNewText: {
        color: Colors.primary,
    },
    orderSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
    },
    addressOption: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    selectedOption: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '10',
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addressLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    addressLabel: {
        marginLeft: 8,
    },
    defaultBadge: {
        backgroundColor: Colors.success,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8,
    },
    defaultBadgeText: {
        color: 'white',
        fontSize: RFValue(10),
    },
    addressText: {
        color: Colors.text,
        marginLeft: 28,
    },
    paymentOption: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    paymentTextContainer: {
        marginLeft: 12,
    },
    paymentDetails: {
        color: Colors.text,
        marginTop: 2,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
    },
    instructionsInput: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: RFValue(12),
        minHeight: 80,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    checkoutContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    placeOrderButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: Colors.border,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeOrderText: {
        color: 'white',
        fontFamily: Fonts.Medium,
        marginLeft: 8,
    },
});
