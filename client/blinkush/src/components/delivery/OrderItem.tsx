import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { CartItem } from '@state/cartStore';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { getStatusColor } from '@utils/getStatusColor';
import { Order } from 'types/types';
import { formatIsoToCustom } from '@utils/dateUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigate } from '@utils/navigation-utils';

const OrderItem = ({ item, index }: { item: Order, index: number; }) => {
    // console.log(1010, item);
    
    return (
        <View style={styles.container}>
            <View style={styles.flexRowBetween}>
                <CustomText variant='h6' fontFamily={Fonts.Medium}>
                    #{item.orderId}
                </CustomText>
                <View style={[
                    styles.statusContainer,
                    // { borderColor: getStatusColor() }
                ]}>
                    <CustomText
                        variant='h6'
                        style={[styles.statusText, { color: getStatusColor(item.status) }]}
                    >
                        {item.status}
                    </CustomText>
                </View>
            </View>
            <View style={styles.container}>
                {item.items.slice(0, 2).map((i, index) => {

                    return (
                        <CustomText variant='h6' numberOfLines={1} key={index}>
                            {i?.count} x {i?.item?.name}
                        </CustomText>
                    );
                })}
            </View>
            <View style={[styles.flexRowBetween, styles.addressContainer]}>
                <View style={styles.addressTextContainer}>
                    <CustomText variant='h6' numberOfLines={2}>
                        {item?.deliveryLocation?.address}
                    </CustomText>
                    <CustomText style={styles.dateText}>
                        {formatIsoToCustom(item?.createdAt)}
                    </CustomText>
                </View>
                <TouchableOpacity style={styles.iconContainer} onPress={() => {
                    navigate('DeliveryMap', {
                        ...item
                    });
                }}>
                    <Icon name='arrow-right-circle' size={RFValue(24)} color={Colors.primary} />
                </TouchableOpacity>
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
        width: '50%',
        marginTop: 10
    },
    addressContainer: {
        marginTop: 10,
    },
    addressTextContainer: {
        width: '70%',
    },
    dateText: {
        marginTop: 2,
        fontSize: RFValue(10)
    },
    iconContainer: {
        alignItems: 'flex-end'
    }
});