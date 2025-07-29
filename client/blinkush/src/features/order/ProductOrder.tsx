import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import CustomHeader from '@components/ui/CustomHeader';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors, Fonts } from '@utils/Constants';
import { useTheme } from '@utils/ThemeContext';
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
    const { theme } = useTheme();
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
            Alert.alert('Failed to place the order');
        }

        setLoading(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <CustomHeader title='Checkout' />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <OrderList />
                <View style={[styles.flexRowBetween, { backgroundColor: theme.backgroundSecondary }]}>
                    <View style={styles.flexRow}>
                        <Image source={coupon} style={styles.img} />
                        <CustomText variant='h6'>
                            Use Coupons
                        </CustomText>
                    </View>
                    <Icon name='chevron-right' color={theme.text} size={RFValue(16)} />
                </View>

                <BillDetails />

                <View style={[styles.flexRowBetween, { backgroundColor: theme.backgroundSecondary }]}>
                    <View style={styles.flexRow}>
                        <Image source={home} style={styles.img} />
                        <View style={{ width: '77%' }}>
                            <CustomText variant='h6'>
                                Delivering to Home
                            </CustomText>
                            <CustomText variant='h9' style={{ opacity: 0.6 }}>
                                {user?.address || 'Address is not set'}
                            </CustomText>
                        </View>
                    </View>
                    <Icon name='chevron-right' color={theme.text} size={RFValue(16)} />
                </View>

                <View style={[hocStyles.cartContainer, { backgroundColor: theme.surface }]}>
                    <View style={hocStyles.cartContainer}>
                        <View style={styles.flexRowBetween}>
                            <View>
                                <CustomText variant='h7' fontFamily={Fonts.Medium}>
                                    ₹{totalItemPrice + 34}.00
                                </CustomText>
                                <CustomText
                                    variant='h9'
                                    style={{ opacity: 0.6, marginTop: 2 }}>
                                    TOTAL
                                </CustomText>
                            </View>
                            <ArrowButton
                                loading={loading}
                                price={totalItemPrice + 34}
                                title='Place Order'
                                onPress={handlePlaceOrder}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 10,
        paddingBottom: 250,
    },
    flexRowBetween: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 15,
        flexDirection: 'row',
    },
    flexRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    img: {
        width: 30,
        height: 30,
    },
});

export default ProductOrder;