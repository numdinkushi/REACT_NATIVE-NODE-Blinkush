import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@state/authStorage';
import { confirmOrder, getOrderById, sendLiveOrderUpdates } from 'service/orderService';
import { Colors, Fonts } from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import { Location, Order, User } from 'types/types';
import { useRoute } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import LiveMap from '@features/map/LiveMap';
import LiveTrackingHeader from '@features/map/LiveTrackingHeader';
import DeliveryDetails from '@features/map/DeliveryDetails';
import OrderSummary from '@features/map/OrderSummary';
import { hocStyles } from '@styles//GlobalStyles';
import CustomButton from '@components/ui/CustomButton';

const DeliveryMap = () => {
    const user = useAuthStore(state => state.user);
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [myLocation, setMyLocation] = useState<Location | null>(null);
    const route = useRoute();
    const orderDetails = route?.params as Order;
    const showAcceptOrderButton = orderData?.status !== 'delivered' && orderData?.status !== 'cancelled';
    const showOrderPickedUpButton = orderData?.status === 'confirmed' && orderData?.deliveryPartner?._id === user?._id;
    const orderArriving = orderData?.status === 'arriving' && orderData?.deliveryPartner?._id === user?._id;
    const { currentOrder, setCurrentOrder } = useAuthStore();

    const fetchOrderDetails = async () => {
        const data = await getOrderById(orderDetails?._id);
        setOrderData(data);
    };

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    useEffect(() => {
        const watchId = Geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setMyLocation({ latitude, longitude });
            },
            (err) => console.log('Error Fetching Geolocation', err),
            {
                enableHighAccuracy: true,
                distanceFilter: 2
            }
        );

        return () => Geolocation.clearWatch(watchId);

    }, []);

    let message = 'Start this order';
    if (orderData?.deliveryPartner?._id == user?._id && orderData?.status === 'confirmed') {
        message = 'Grab your order';
    }

    if (orderData?.deliveryPartner?._id == user?._id && orderData?.status === 'arriving') {
        message = 'Complete your order';
    }

    if (orderData?.deliveryPartner?._id == user?._id && orderData?.status?.toLocaleLowerCase() === 'delivered') {
        message = 'Your milestone';
    }

    if (orderData?.deliveryPartner?._id !== user?._id && orderData?.status !== 'available') {
        message = 'You missed it!';
    }

    useEffect(() => {
        async function sendLiveUpdates() {
            const canSendLiveOrderUpdates = orderData?.deliveryPartner?._id !== user?._id
                && orderData?.status !== 'delivered'
                && orderData?.status !== 'cancelled';

            if (canSendLiveOrderUpdates && myLocation && orderData?.status) {
                sendLiveOrderUpdates(orderData?._id as string, myLocation, orderData?.status);
                fetchOrderDetails();
            }
        }
    }, [myLocation]);

    const acceptOrder = async () => {
        try {
            const data = await confirmOrder(orderData?._id as string, myLocation as Location);
            if (data) {
                setCurrentOrder(data);
                Alert.alert("Order Accepted, Grab your package");
            }
        } catch (error) {
            Alert.alert('There was an error');
        } finally {
            fetchOrderDetails();
        }
    };

    const orderPickedUp = async () => {
        try {
            const data = await sendLiveOrderUpdates(orderData?._id as string, myLocation as Location, 'arriving');
            if (data) {
                setCurrentOrder(data);
                Alert.alert("Order Accepted, Grab your package");
            }
        } catch (error) {
            Alert.alert('There was an error');
        } finally {
            fetchOrderDetails();
        }
    };

    const orderDelivered = async () => {
        try {
            const data = await sendLiveOrderUpdates(orderData?._id as string, myLocation as Location, 'delivered');
            if (data) {
                setCurrentOrder(data);
                Alert.alert("Order Accepted, Grab your package");
            }
        } catch (error) {
            Alert.alert('There was an error');
        } finally {
            fetchOrderDetails();
        }
    };

    return (
        <View style={styles.container}>
            <LiveTrackingHeader
                type='Delivery'
                title={message}
                secondTitle='Delivery in 10 minutes'
            />
            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <LiveMap />
                <DeliveryDetails details={orderData?.customer as User} />
                <OrderSummary order={orderData as Order} />

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
            {showAcceptOrderButton &&
                <View style={[hocStyles.cartContainer, styles.btnContainer]}>
                    {orderData?.status === 'available' &&
                        <CustomButton
                            disabled={false}
                            title='Accept Order'
                            onPress={acceptOrder}
                            isLoading={false}
                        />
                    }
                    {showOrderPickedUpButton &&
                        <CustomButton
                            disabled={false}
                            title='Order Picked up'
                            onPress={orderPickedUp}
                            isLoading={false}
                        />
                    }
                    {orderArriving &&
                        <CustomButton
                            disabled={false}
                            title='Delivered'
                            onPress={orderDelivered}
                            isLoading={false}
                        />
                    }
                </View>
            }
        </View >
    );
};

export default DeliveryMap;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary
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
    btnContainer: {
        padding: 10,
    },
});