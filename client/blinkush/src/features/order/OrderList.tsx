import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useCartStore } from '@state/cartStore';
import { Image } from 'react-native';
import { clock } from 'constants/files/filesConstants';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';
import OrderItem from './OrderItem';

const OrderList = () => {
    const cartItems = useCartStore((state) => state.cart);
    const totalItems = cartItems.reduce((acc, cart) => acc + cart?.count, 0);

    return (
        <View style={styles.container}>
            <View style={styles.flexRow}>
                <View style={styles.imageContainer}>
                    <Image source={clock} style={styles.img} />
                </View>
                <View>
                    <CustomText variant='h3' fontFamily={Fonts.SemiBold}>Delivery in 9 minutes </CustomText>
                    <CustomText variant='h5' style={{ opacity: 0.5 }} fontFamily={Fonts.SemiBold}>Shipment of {totalItems || 0} items  </CustomText>
                </View>
            </View>
            {cartItems?.map((item) => {
                return (
                    <OrderItem key={item._id} item={item} />
                );
            })}
        </View>
    );
};

export default OrderList;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 15,
        
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    imageContainer: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 10,
        borderRadius: 15,
    },
    img: {
        width: 30,
        height: 30,
    }
});