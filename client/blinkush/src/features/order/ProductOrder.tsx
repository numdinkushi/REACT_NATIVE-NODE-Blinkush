import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import CustomHeader from '@components/ui/CustomHeader';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors } from '@utils/Constants';
import OrderList from './OrderList';
import { coupon, home } from 'constants/files/filesConstants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '@components/ui/CustomText';
import { useCartStore } from '@state/cartStore';
import BillDetails from './BillDetails';
import { hocStyles } from '@styles//GlobalStyles';
import { useAuthStore } from '@state/authStorage';
import { RFValue } from 'react-native-responsive-fontsize';
import ArrowButton from '@components/ui/ArrowButton';
import { navigate } from '@utils/navigation-utils';
import { createOrder } from 'service/orderService';

const ProductOrder = () => {
    const { getTotalPrice, getItemCount, cart, clearCart } = useCartStore();
    const totalItemPrice = getTotalPrice();
    const { user, setCurrentOrder, currentOrder } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const handlePlaceOrder = async () => {
        if (currentOrder !== null) {
            Alert.alert('Let your first order be delivered');

            return;
        }

        const formattedData = cart.map((item) => ({
            id: item._id,
            item: item?.item,
            count: item.count
        }));

        if (formattedData.length === 0) {
            Alert.alert('Add any item to place order');

            return;
        }

        setLoading(true);
        const data = await createOrder(formattedData, totalItemPrice);

        if (data !== null) {
            setCurrentOrder(data);
            clearCart();
            navigate('OrderSuccess', { ...data });
        } else {
            Alert.alert('There was an error');
        }

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <CustomHeader title='Checkout' />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <OrderList />
                <View style={styles.flexRowBetween}>
                    <View style={styles.flexRow}>
                        <Image source={coupon} style={{ width: 25, height: 25 }} />
                        <CustomText variant='h4'>
                            Use Coupons
                        </CustomText>
                    </View>
                    <Icon name='chevron-right' />
                </View>
                <BillDetails totalItemPrice={totalItemPrice} />
                <View style={styles.flexRowBetween}>
                    <View>
                        <CustomText variant='h5' style={{ fontWeight: 500 }}>Cancellation Policy</CustomText>
                        <CustomText variant='h6' style={styles.cancelText}>Orders cannot be cancelled once packaged for delivery. In case of unexpected delivery, a refund will be provided if applicable</CustomText>
                    </View>
                </View>
            </ScrollView>
            <View style={hocStyles.cartContainer}>
                <View style={styles.absoluteContainer}>
                    <View style={styles.addressContainer}>
                        <View style={styles.flexRow}>
                            <Image source={home} style={{ width: 20, height: 20 }} />
                            <View style={{ width: '75%' }}>
                                <CustomText variant='h6'> Delivering to Home</CustomText>
                                <CustomText variant='h7' numberOfLines={2} style={{ opacity: 0.6 }}> {user?.address}</CustomText>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <CustomText variant='h6' style={{ color: Colors.secondary }}>Change</CustomText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.paymentGateway}>
                        <View style={{ width: '30%' }}>
                            <CustomText fontSize={RFValue(8)}>💸 PAY USING </CustomText>
                            <CustomText variant='h7' style={{ marginTop: 2 }}>Cash on Delivery</CustomText>
                        </View>
                        <View style={{ width: '60%' }}>
                            <ArrowButton
                                loading={loading}
                                price={totalItemPrice}
                                title='Place Order'
                                onPress={async () => { await handlePlaceOrder(); }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ProductOrder;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 10,
        paddingBottom: 250
    },
    flexRowBetween: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 15,
        flexDirection: 'row'
    },
    flexRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    cancelText: {
        marginTop: 4,
        opacity: 0.6,
    },
    absoluteContainer: {
        marginVertical: 15,
        marginBottom: Platform.OS === 'ios' ? 30 : 10
    },
    addressContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderBottomWidth: 0.7,
        borderColor: Colors.border
    },
    paymentGateway: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 14
    }
});