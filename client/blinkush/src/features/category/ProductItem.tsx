import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Product } from '@utils/dummyData';
import { screenHeight } from '@utils/scaling';
import { clock } from 'constants/files/filesConstants';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '@utils/Constants';
import UniversalAdd from '@components/ui/UniversalAdd';

interface ProductItemProps {
    item: Product;
    index: number;

}

const ProductItem = ({ item, index }: ProductItemProps) => {
    const isSecondColumn = index % 2 != 0;

    return (
        <View style={[styles.container, { marginRight: isSecondColumn ? 10 : 0 }]}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
            </View>
            <View style={styles.content}>
                <View style={styles.flexRow}>
                    <Image source={clock} style={styles.clockIcon} />
                    <CustomText fontSize={RFValue(8)} fontFamily={Fonts.Medium}>
                        8 Mins
                    </CustomText>
                </View>
                <CustomText variant='h6' numberOfLines={2} style={{ marginVertical: 4, fontWeight: 400 }}>
                    {item.name}
                </CustomText>
                <View style={styles.priceContainer}>
                    <View>
                        <CustomText variant='h6' style={{ fontWeight: 500 }}>
                            ${item.price}
                        </CustomText>
                        <CustomText variant='h6' style={{ fontWeight: 300, textDecorationLine: 'line-through' }}>
                            ${item.discountPrice}
                        </CustomText>
                    </View>
                    <UniversalAdd item={item} />
                </View>
            </View>
        </View>
    );
};

export default ProductItem;

const styles = StyleSheet.create({
    container: {
        width: '45%',
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 10,
        marginLeft: 10,
        overflow: 'hidden',
    },
    imageContainer: {
        height: screenHeight * 0.2,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    image: {
        width: '80%',
        height: '100%',
        aspectRatio: 1 / 1,
        resizeMode: 'contain'
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
    },
    flexRow: {
        flexDirection: 'row',
        padding: 2,
        borderRadius: 4,
        alignItems: 'center',
        gap: 2,
        backgroundColor: Colors.backgroundSecondary,
        alignSelf: 'flex-start'
    },
    clockIcon: {
        height: 15,
        width: 15,
        tintColor: Colors.primary,
        marginHorizontal: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 10,
        marginTop: 'auto'
    }
});