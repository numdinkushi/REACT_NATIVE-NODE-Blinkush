import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useAuthStore } from '@state/authStorage';
import { Colors } from '@utils/Constants';
import { deliveryBoy } from 'constants/files/filesConstants';
import CustomText from '@components/ui/CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { resetAndNavigate } from '@utils/navigation-utils';
import { storage, tokenStorage } from '@state/storage';

interface DeliveryHeader {
    name: string;
    email: string;

}

const DeliveryHeader = ({ name, email }: DeliveryHeader) => {
    const { logout } = useAuthStore();

    const handleLogout = () => {
        resetAndNavigate('CustomerLogin');
        logout();
        tokenStorage.clearAll();
        storage.clearAll();
    };
    return (
        <View style={styles.flexRow}>
            <View style={styles.imageContainer}>
                <Image source={deliveryBoy} style={styles.img} />
            </View>
            <View style={styles.infoContainer}>
                <View style={{ display: 'flex', alignItems:'center', justifyContent:'flex-start', flexDirection: 'row' }}>
                    <CustomText variant='h5'> Hello </CustomText>
                    <CustomText variant='h3' style={{fontWeight: 600}}> {name}! </CustomText>
                    <CustomText style={{color: 'white', backgroundColor:'white', borderRadius: 300}}> 👋 </CustomText>
                </View>
                <View>
                    <CustomText variant='h6'> {email} </CustomText>
                </View>
            </View>
            <TouchableOpacity onPress={handleLogout}>
                <Icon name='logout' size={30} color='black' />
            </TouchableOpacity>
        </View>
    );
};

export default DeliveryHeader;

const styles = StyleSheet.create({
    flexRow: {
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    imageContainer: {
        padding: 4,
        borderRadius: 100,
        height: 60,
        width: 60,
        overflow: 'hidden',
        backgroundColor: Colors.backgroundSecondary
    },
    img: {
        width: '100%',
        height: '100%',
        bottom: -8,
        resizeMode: 'contain'
    },
    infoContainer: {
        width: '70%'
    }
});