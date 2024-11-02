import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useAuthStore } from '@state/authStorage';
import { getOrderById } from 'service/orderService';
import { Colors, Fonts } from '@utils/Constants';
import LiveTrackingHeader from './LiveTrackingHeader';
import LiveMap from './LiveMap';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import DeliveryDetails from './DeliveryDetails';
import { Order, User } from 'types/types';
import OrderSummary from './OrderSummary';
import withLiveStatus from './withLiveStatus';

const LiveTracking = () => {
    const { currentOrder, setCurrentOrder } = useAuthStore();

    const fetchOrderDetails = async () => {
        if (!currentOrder?._id) return;

        const data = await getOrderById(currentOrder?._id);
        setCurrentOrder(data);
    };

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    let message = 'Packing your order';
    let time = 'Arriving in 10 minutes';

    if (currentOrder?.status === 'confirmed') {
        message = 'Arriving soon';
        time = 'Estimated arrival in 8 minutes';
    }

    if (currentOrder?.status === 'arriving') {
        message = 'Order Picked up';
        time = 'Arriving in 6 minutes';
    }

    if (currentOrder?.status === 'delivered') {
        message = 'Order delivered';
        time = 'Fastest Delivery ⚡';
    }

    return (
        <View style={styles.container}>
            <LiveTrackingHeader
                type='Customer'
                title={message}
                secondTitle={time}
            />
            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <LiveMap />
                <View style={styles.flexRow}>
                    <View style={styles.iconContainer}>
                        <Icon
                            name={currentOrder?.deliveryPartner ? 'phone' : 'shopping'}
                            color={Colors.disabled}
                            size={RFValue(24)}
                        />
                    </View>
                    <View style={{ width: '82%' }}>
                        <CustomText numberOfLines={1} style={{ fontWeight: 600 }} variant='h5'>
                            {currentOrder?.deliveryPartner?.name || 'We will soon assign a delivery partner.'}
                        </CustomText>
                        {currentOrder?.deliveryPartner &&
                            <CustomText variant='h5' fontFamily={Fonts.Medium}>
                                {currentOrder?.deliveryPartner?.phone}
                            </CustomText>}
                        <CustomText variant='h7'>
                            {currentOrder?.deliveryPartner ? 'For Delivery instructions you can contact here' : message}
                        </CustomText>
                    </View>
                </View>
                <DeliveryDetails details={currentOrder?.customer as User} />
                <OrderSummary order={currentOrder as Order} />
                <View style={styles.flexRow}>
                    <View style={styles.iconContainer}>
                        <Icon name='cards-heart-outline' color={Colors.disabled} size={RFValue(22)} />
                    </View>
                    <View style={{ width: '82%' }}>
                        <CustomText variant='h5'> Do you like our App clone? </CustomText>
                        <CustomText> Then show me some love!</CustomText>
                    </View>
                </View>
                <CustomText style={{ alignSelf: 'center', marginTop: 5, opacity: 0.5 }}>
                    Kushi Numdin E. X Blinkush
                </CustomText>
            </ScrollView >
        </View >
    );
};

export default withLiveStatus(LiveTracking);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondary
    },
    scrollContent: {
        paddingBottom: 30,
        padding: 10,
        backgroundColor: Colors.backgroundSecondary
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        borderRadius: 15,
        paddingVertical: 10,
        backgroundColor: 'white',
        padding: 10,
        borderBottomWidth: 0.7,
        borderColor: Colors.border,
    },
    iconContainer: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});