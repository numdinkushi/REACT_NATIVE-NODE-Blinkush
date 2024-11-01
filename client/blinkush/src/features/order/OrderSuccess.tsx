import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { screenWidth } from '@utils/scaling';
import { Colors } from '@utils/Constants';
import LottieView from 'lottie-react-native';
import { lottieOrderSuccess } from 'constants/files/filesConstants';
import CustomText from '@components/ui/CustomText';
import { useAuthStore } from '@state/authStorage';
import { replace } from '@utils/navigation-utils';

const OrderSuccess = ({ }) => {
    const { user } = useAuthStore();

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            replace('LiveTracking');
        }, 2300);

        return () => clearTimeout(timeOutId);
    }, []);

    return (
        <View style={styles.container}>
            <LottieView
                source={lottieOrderSuccess}
                autoPlay
                duration={2000}
                loop={false}
                speed={1}
                style={styles.lottieView}
                enableMergePathsAndroidForKitKatAndAbove
                hardwareAccelerationAndroid
            />
            <CustomText variant='h5' style={[styles.orderPlaceItem, { fontWeight: 600 }]} >
                ORDER PLACED
            </CustomText>
            <View style={styles.deliverContainer}>
                <CustomText style={styles.deliverText}>
                    Delivering to Home
                </CustomText>
            </View>
            <CustomText variant='h6' style={styles.addressText}>
                {user?.address || 'Somewhere, nowhere'}
            </CustomText>
        </View>
    );
};

export default OrderSuccess;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    lottieView: {
        width: screenWidth * 0.6,
        height: 150
    },
    orderPlaceItem: {
        opacity: 0.4
    },
    deliverContainer: {
        borderBottomWidth: 2,
        paddingBottom: 4,
        marginBottom: 5,
        borderColor: Colors.secondary
    },
    deliverText: {
        marginTop: 15,
        borderColor: Colors.secondary
    },
    addressText: {
        opacity: 0.8,
        width: '80%',
        textAlign: 'center',
        marginTop: 10
    }
});