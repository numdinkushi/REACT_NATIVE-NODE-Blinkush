import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@state/authStorage';
import { useCartStore } from '@state/cartStore';
import { fetchCustomerOrders } from 'service/orderService';
import CustomHeader from '@components/ui/CustomHeader';
import { Order } from 'types/types';
import CustomText from '@components/ui/CustomText';
import WalletSection from './WalletSection';
import ActionButton from './ActionButton';
import OrderItem from './OrderItem';
import ThemeToggle from '@components/ui/ThemeToggle';
import { tokenStorage } from '@state/storage';
import { resetAndNavigate } from '@utils/navigation-utils';
import { useTheme } from '@utils/ThemeContext';

const Profile = () => {
    const [orders, setOrders] = useState<Order[] | []>([]);
    const { logout, user } = useAuthStore();
    const { clearCart } = useCartStore();
    const { theme } = useTheme();

    const fetchOrders = async () => {
        if (!user?._id) return;

        const data = await fetchCustomerOrders(user?._id);
        setOrders(data);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleLogout = () => {
        clearCart();
        logout();
        tokenStorage.clearAll();  //some of these should be in the main logout function
        resetAndNavigate('CustomerLogin');
    };

    const renderHeader = () => {
        return (
            <View style={styles.informatics}>
                <CustomText variant='h3'>
                    Your account
                </CustomText>
                <CustomText variant='h5'>
                    {user?.phone}
                </CustomText>
                <WalletSection />
                <CustomText variant='h8' style={styles.informatics}>
                    YOUR INFORMATION
                </CustomText>
                <ActionButton icon='book-outline' label='Address book' />
                <ActionButton icon='information-circle-outline' label='About us' />
                <ThemeToggle />
                <ActionButton icon='log-out-outline' label='Logout' onPress={handleLogout} />
                <CustomText variant='h6' style={styles.pastText} >
                    PAST ORDERS
                </CustomText>
            </View>
        );
    };

    const renderOrders = ({ item, index }: { item: Order; index: number; }) => {
        return (
            <OrderItem
                index={index}
                item={item}
            />
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <CustomHeader title='Profile' />
            <FlatList
                data={orders}
                ListHeaderComponent={renderHeader}
                renderItem={renderOrders}
                keyExtractor={(item) => item?.orderId}
                contentContainerStyle={styles.scrollViewContent}
            />
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        padding: 10,
        paddingTop: 20,
        paddingBottom: 40
    },
    informatics: {
        opacity: 0.7,
        marginBottom: 20
    },
    pastText: {
        marginTop: 20
    }
});