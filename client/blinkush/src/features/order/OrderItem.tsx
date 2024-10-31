import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Product } from '@utils/dummyData';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';
import UniversalAdd from '@components/ui/UniversalAdd';
import { CartItem } from '@state/cartStore';

const OrderItem = ({ item }: { item: CartItem; }) => {
    return (
        <View style={styles.flexRow}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item?.item?.image }} style={styles.img} />
            </View>
            <View style={{ width: '55%' }}>
                <CustomText numberOfLines={2} variant='h5' fontFamily={Fonts.Medium}>
                    {item.item.name}
                </CustomText>
                <CustomText variant='h7'>
                    {item.item.quantity}
                </CustomText>
            </View>
            <View style={{ width: '20%', alignItems: 'flex-end' }}>
                <UniversalAdd item={item.item} />
                <CustomText
                    variant='h6'
                    fontFamily={Fonts.Medium}
                    style={{ alignSelf: 'flex-end', marginTop: 4 }}
                >
                    ${item.count * item.item.price}
                </CustomText>
            </View>
        </View>
    );
};

export default OrderItem;

const styles = StyleSheet.create({
    img: {
        width: 40,
        height: 40,
    },
    imageContainer: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 10,
        borderRadius: 15,
        width: '17%'
    },
    flexRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap:12,
        paddingHorizontal: 10,
        paddingVertical:12,
        borderBottomWidth: 0.6,
        borderColor: Colors.border,
    }
});