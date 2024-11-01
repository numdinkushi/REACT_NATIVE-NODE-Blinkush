import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Colors } from '@utils/Constants';
import CustomText from './CustomText';
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';

interface ArrowButtonProps {
    title: string;
    onPress?: () => void;
    price?: number;
    loading?: boolean;
}
 
const ArrowButton = ({ title, onPress, price, loading }: ArrowButtonProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={loading}
            onPress={onPress}
            style={[styles.btn, { justifyContent: price != 0 ? 'space-between' : 'center' }]}
        >
            {
                price != 0 && price &&
                <View>
                    <CustomText
                        variant='h7'
                        style={{ color: 'white' }}

                    >
                        ${price + 34}
                    </CustomText>
                    <CustomText
                        variant='h7'
                        style={{ color: 'white' }}
                    >
                        Total
                    </CustomText>
                </View>
            }
            <View style={styles.flexRow}>
                <CustomText variant='h4' style={{ color: 'white' }}>
                    {title}
                </CustomText>
                {
                    loading ? <ActivityIndicator
                        color='white'
                        style={{ marginHorizontal: 5 }}
                        size='small'
                    /> : <Icon name='arrow-right' color='white' size={RFValue(27)} />
                }
            </View>
        </TouchableOpacity>
    );
};

export default ArrowButton;

const styles = StyleSheet.create({
    btn: {
        backgroundColor: Colors.secondary,
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 12,
        marginVertical: 10,
        marginHorizontal: 15
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});