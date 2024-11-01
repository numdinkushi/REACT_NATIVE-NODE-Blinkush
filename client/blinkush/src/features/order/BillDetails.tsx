import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomText from '@components/ui/CustomText';
import { Colors } from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';

interface ReportItemProps {
    iconName: string,
    underline?: boolean;
    title: string;
    price: number;
}
const ReportItem = ({ underline, iconName, title, price }: ReportItemProps) => {
    return (
        <View style={[styles.flexRowBetween, { marginBottom: 10 }]}>
            <View style={styles.flexRow}>
                <Icon name={iconName} style={{ opacity: 0.7, height:20, width: 20 }} size={RFValue(12)} color={Colors.text} />
                <CustomText
                    style={{ textDecorationLine: underline ? 'underline' : 'none', textDecorationStyle: 'dashed' }}
                    variant='h6'
                >
                    {title}
                </CustomText>
            </View>
            <CustomText variant='h6'>
                ${price}
            </CustomText>
        </View>
    );
};

const BillDetails = ({ totalItemPrice }: { totalItemPrice: number; }) => {
    return (
        <View style={styles.container} >
            <CustomText style={styles.text} variant='h5'>Bill Details</CustomText>
            <View style={styles.billContainer}>
                <ReportItem iconName='receipt' title='Items total' price={totalItemPrice} />
                <ReportItem iconName='bike-fast' title='Delivery Charge' price={29} />
                <ReportItem iconName='shopping' title='Handling Charge' price={29} />
                <ReportItem iconName='weather-rainy' title='Surge Charge' price={29} />
            </View>
            <View style={[styles.flexRowBetween, { marginBottom: 15 }]}>
                <CustomText style={[styles.text, {fontWeight: 700}]} variant='h5'> Grant Total </CustomText>
                <CustomText style={[styles.text, {fontWeight: 700}]} > ${totalItemPrice + 34} </CustomText>
            </View>
        </View>
    );
};

export default BillDetails;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginVertical: 15,
    },
    text: {
        marginHorizontal: 10,
        marginTop: 15,
        fontWeight: 400,
    },
    billContainer: {
        padding: 10,
        paddingBottom: 0,
        borderBottomColor: Colors.border,
        borderBottomWidth: 0.7
    },
    flexRowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 5,
        justifyContent: 'center',
    }
});