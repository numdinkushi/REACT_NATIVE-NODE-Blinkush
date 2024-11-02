import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {  User } from 'types/types';
import { Colors } from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';

const DeliveryDetails = ({ details }: { details: User; }) => {
    return (
        <View style={styles.container}>
            <View style={styles.flexRow}>
                <View style={styles.iconContainer}>
                    <Icon name='bike-fast' color={Colors.disabled} size={RFValue(22)} />
                </View>
                <View>
                    <CustomText variant='h4'>Your delivery details </CustomText>
                    <CustomText variant='h6'>Details of your current order </CustomText>
                </View>
            </View>
            <View style={styles.flexRow}>
                <View style={styles.iconContainer}>
                    <Icon name='map-marker-outline' color={Colors.disabled} size={RFValue(22)} />
                </View>
                <View style={{ width: '80%' }}>
                    <CustomText variant='h4'>Delivery at Home </CustomText>
                    <CustomText variant='h6' numberOfLines={2}>{details?.address || '------'} </CustomText>
                </View>
            </View>
            <View style={styles.flexRow}>
                <View style={styles.iconContainer}>
                    <Icon name='phone-outline' color={Colors.disabled} size={RFValue(22)} />
                </View>
                <View style={{ width: '80%' }}>
                    <CustomText variant='h4'>{details?.name || '--'} {details?.phone || 'xxxxxxxxxx'} </CustomText>
                    <CustomText variant='h6' numberOfLines={2}>Receiver's contact no </CustomText>
                </View>
            </View>
            <CustomText style={{alignSelf:'center', marginTop: 5, opacity: 0.5}}>
                Kushi Numdin E. X Blinkush
            </CustomText>
        </View>
    );
};

export default DeliveryDetails;

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
    flexRow2: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
    },
    iconContainer: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});