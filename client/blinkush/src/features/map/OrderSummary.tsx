import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Order } from 'types/types';
import { Colors } from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import BillDetails from '@features/order/BillDetails';
import { Image } from 'react-native';

const OrderSummary = ({ order }: { order: Order; }) => {
    const totalPrice = order?.items
        ?.reduce((total, cartItem) =>
            total + (cartItem.item.price * cartItem.count), 0) || 0;

    return (
        <View style={styles.container}>
            <View style={styles.flexRow}>
                <View style={styles.iconContainer}>
                    <Icon name='shopping-outline' color={Colors.disabled} size={RFValue(22)} />
                </View>
                <View>
                    <CustomText variant='h5'>Order Summary </CustomText>
                    <CustomText variant='h6'>Order ID - #${order?.orderId} </CustomText>
                </View>
            </View>
            {
                order?.items?.map((item, index) => {
                    return (
                        <View style={styles.flexRow} key={index}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item?.item?.image }} style={styles.img} />
                            </View>
                            <View style={{ width: '55%' }}>
                                <CustomText numberOfLines={2}>
                                    {item?.item.name}
                                </CustomText>
                                <CustomText variant='h7'>
                                    {item?.item.quantity}
                                </CustomText>
                            </View>
                            <View style={{ width: '20%', alignItems: 'flex-end' }}>
                                <CustomText style={{ alignSelf: 'flex-end' }}> ${item?.item.price * item?.count} </CustomText>
                                <CustomText style={{ alignSelf: 'flex-end' }}> {item?.count}x  </CustomText>
                            </View>
                        </View>
                    );
                })
            }
            <BillDetails totalItemPrice={totalPrice} />
        </View>
    );
};

export default OrderSummary;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 15,
        marginVertical: 15,
        paddingVertical: 10,
        backgroundColor: 'white'
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
        borderBottomWidth: 0.7,
        borderColor: Colors.border,
    },
    iconContainer: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        width: 40,
        height: 40
    },
    imageContainer: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 8,
        borderRadius: 15,
        width: '17%'
    }
});