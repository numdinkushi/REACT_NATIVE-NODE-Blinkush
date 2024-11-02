import CustomText from "@components/ui/CustomText";
import { useNavigationState } from "@react-navigation/native";
import { useAuthStore } from "@state/authStorage";
import { useCartStore } from "@state/cartStore";
import { hocStyles } from "@styles//GlobalStyles";
import { Colors } from "@utils/Constants";
import { navigate } from "@utils/navigation-utils";
import { defaultCartImage2 } from "constants/files/filesConstants";
import { FC, useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { getSocketURL } from "service/config";
import { getOrderById } from "service/orderService";
import io from "socket.io-client";

const SOCKET_URL = getSocketURL();

const withLiveStatus = <P extends object>(WrappedComponent: React.ComponentType): FC<P> => {
    const WithLiveStatusComponent: FC<P> = (props) => {
        const { currentOrder, setCurrentOrder } = useAuthStore();
        const routeName = useNavigationState(state => state.routes[state.index]?.name);
        const fetchOrderDetails = async () => {
            const data = await getOrderById(currentOrder?._id as string);
            setCurrentOrder(data);
        };

        const orderItemName = currentOrder?.items[0]?.item.name;
        const remainingOrder = currentOrder && currentOrder?.items?.length - 1;
        const isMoreThanOneItem = remainingOrder && remainingOrder > 0;

        useEffect(() => {
            console.log(2345, 'Testing', {currentOrder})
            if (currentOrder) {
                const socketInstance = io(SOCKET_URL, {
                    transports: ['websocket'],
                    withCredentials: false
                });
                socketInstance.emit('joinRoom', currentOrder?._id);
                socketInstance.on('liveTrackingUpdates', (updatedOrder) => {
                    fetchOrderDetails();
                    console.log('Receiving LIVE UPDATES...');
                });
                socketInstance.on('orderConfirmed', (confirmOrder) => {
                    fetchOrderDetails();
                    console.log('ORDER CONFIRM LIVE UPDATES...');
                });

                return () => {
                    socketInstance.disconnect();
                };
            }
        }, [currentOrder]);

        return (
            <View style={styles.container}>
                <WrappedComponent {...props} />
                {currentOrder && routeName === 'ProductDashboard' && (
                    <View style={[hocStyles.cartContainer, { flexDirection: 'row' }]}>
                        <View style={styles.flexRow}>
                            <View style={styles.image}>
                                <Image
                                    source={defaultCartImage2}
                                    style={{ width: 20, height: 20 }}
                                />
                            </View>
                            <View style={{ width: '68%' }}>
                                <CustomText variant="h5">
                                    Order is {currentOrder?.status}
                                </CustomText>
                                <CustomText variant="h7">
                                    {orderItemName + (isMoreThanOneItem ? `and ${remainingOrder}+ items` : '')}
                                </CustomText>
                                {/* <CustomText variant="h7">
                                    {currentOrder?.items[0]?.item.name +
                                        (currentOrder?.items?.length - 1 > 0 ? `and ${(currentOrder?.items?.length - 1)}+ items` : '')}
                                </CustomText> */}
                            </View>
                            <TouchableOpacity onPress={() => navigate('LiveTracking')} style={styles.btn}>
                                <CustomText variant="h6" style={{ color: Colors.secondary }}>  View</CustomText>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return WithLiveStatusComponent;
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flexRow: {
        flexDirection: 'row',
        gap: 10,
        borderRadius: 15,
        marginBottom: 15,
        paddingVertical: 10,
        padding: 10,
    },
    image: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.7,
        borderColor: Colors.secondary,
        borderRadius: 5,
        marginTop: 3
    }
});

export default withLiveStatus;