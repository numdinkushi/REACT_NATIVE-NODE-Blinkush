import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { CartItem } from '@state/cartStore';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';

interface Order {
    orderId: string;
    items: CartItem[];
    totalPrice: number;
    createdAt: string;
    status: string;
}

const OrderItem = ({ item, index }: { item: Order, index: number; }) => {
    return (
        <View style={styles.container}>
            <View style={styles.flexRowBetween}>
                <CustomText variant='h6' fontFamily={Fonts.Medium}>
                    #{item.orderId}
                </CustomText>
                <View style={[
                    styles.statusContainer
                ]}>

                </View>
            </View>
        </View>
    );
};

export default OrderItem;

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.7,
        padding: 10,
        borderColor: Colors.border,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: 'white'
    },
    flexRowBetween: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    statusContainer: {
        paddingVertical: 4,
       paddingHorizontal: 10,
       borderRadius: 20,
    },
    statusText: {
      textTransform: 'capitalize',
      color: 'white',
    },
    itemContainer: {
        width: '100%',
    }
});