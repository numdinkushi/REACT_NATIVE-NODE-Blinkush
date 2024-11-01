import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from '@state/authStorage';
import { RFValue } from 'react-native-responsive-fontsize';
import { navigate } from '@utils/navigation-utils';
import CustomText from '@components/ui/CustomText';

interface LiveTrackingHeaderProps {
    type: 'Customer' | 'Delivery';
    title?: string;
    secondTitle?: string;
}

const LiveTrackingHeader = ({ type, secondTitle, title, }: LiveTrackingHeaderProps) => {
    const isCustomer = type === 'Customer';
    const { currentOrder, setCurrentOrder } = useAuthStore();

    return (
        <SafeAreaView >
            <View style={styles.headerContainer}>
                <Pressable style={styles.backButton} onPress={() => {
                    if (isCustomer) {
                        navigate('ProductDashboard');
                        if (currentOrder?.status === 'delivered') {
                            setCurrentOrder(null);
                        }

                        return;
                    }
                    navigate('DeliveryDashboard');
                }}>
                    <Icon name='chevron-back' size={RFValue(18)} color={isCustomer ? 'white' : 'black'} />
                </Pressable>
                <CustomText variant='h6' style={isCustomer ? styles.tittleTextWhite : styles.tittleTextBlack}>
                    {title}
                </CustomText>
                <CustomText  variant='h3' style={isCustomer ? styles.tittleTextWhite : styles.tittleTextBlack}>
                    {secondTitle}
                </CustomText>
            </View>
        </SafeAreaView>
    );
};

export default LiveTrackingHeader;

const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: 'center',
        paddingVertical: 10,
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 20
    },
    tittleTextBlack: {
        color: 'black',
        fontWeight: 500,
    },
    tittleTextWhite: {
        color: 'white',
        fontWeight: 500,
    },
});