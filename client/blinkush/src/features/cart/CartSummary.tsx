import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { screenHeight, screenWidth } from '@utils/scaling';
import { Colors, Fonts } from '@utils/Constants';
import { defaultCartImage2 } from 'constants/files/filesConstants';
import CustomText from '@components/ui/CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconIo from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { navigate } from '@utils/navigation-utils';

interface CartSummaryProps {
    cartCount: number;
    cartImage: string;

}

const CartSummary = ({ cartCount, cartImage }: CartSummaryProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.flexRow}>
                <Image
                    source={cartImage === null
                        ? defaultCartImage2
                        : { uri: cartImage }}
                    style={styles.image}
                />
                <CustomText fontFamily={Fonts.SemiBold}>
                    {cartCount} item{cartCount > 1 ? 's' : ''}
                </CustomText>
                {/* <Icon name='arrow-drop-up' color={Colors.secondary} size={RFValue(12)} /> */}
                <TouchableOpacity
                    style={styles.btn}
                    activeOpacity={0.7}
                    onPress={() => navigate('ProductOrder')}
                >
                    <CustomText style={styles.btnText}> Next</CustomText>
                    {/* <IconIo name='arrow-right' color='fff' size={RFValue(12)} /> */}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CartSummary;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: screenWidth * 0.05,
        paddingBottom: screenHeight * 0.03,
        paddingTop: screenHeight * 0.014,
    },
    flexRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: screenWidth * 0.03,
    },
    image: {
        width: screenWidth * 0.1,
        height: screenWidth * 0.1,
        borderRadius: screenWidth * 0.025,
        borderColor: Colors.border,
        borderWidth: 1,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: screenWidth * 0.025,
        paddingVertical: screenHeight * 0.01,
        backgroundColor: Colors.secondary,
        paddingHorizontal: screenWidth * 0.1,
    },
    btnText: {
        marginLeft: screenWidth * 0.02,
        color: 'white',
        fontWeight: 'bold',
    }

});