import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomHeader from '@components/ui/CustomHeader';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors } from '@utils/Constants';
import OrderList from './OrderList';
import { coupon } from 'constants/files/filesConstants';
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons';

const ProductOrder = () => {
    return (
        <View style={styles.container}>
            <CustomHeader title='Checkout' />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <OrderList />
                <View style={styles.flexRowBetween}>
                    <View style={styles.flexRow}>
                    <Image source={coupon} style={{width: 25, height: 25 }} />
                    </View>
                    <Icon name='chevron-right' />
                </View>
            </ScrollView>
        </View>
    );
};

export default ProductOrder;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 10,
        paddingBottom: 250
    },
    flexRowBetween: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent:'space-between',
        padding:10,
        borderRadius: 15,
        flexDirection: 'row'
    },
    flexRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    }
});