import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { useAuthStore } from '@state/authStorage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigate } from '@utils/navigation-utils';
import Geolocation from '@react-native-community/geolocation';
import { reverseGeoCode } from 'service/mapService';

const Header = ({ showNotice }: { showNotice: () => void; }) => {
    const { setUser, user } = useAuthStore();
    const updateUserLocation = async () => {
        Geolocation.requestAuthorization();
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                reverseGeoCode(latitude, longitude, setUser);
            },
            (error) => {
                console.log('Error getting location', error);
            },
            {
                enableHighAccuracy: false,
                timeout: 20000,
            }
        );
    };

    useEffect(() => {
        updateUserLocation();
    }, []);

    return (
        <View style={styles.subContainer}>
            <TouchableOpacity activeOpacity={0.8}>
                <CustomText variant='h5' fontFamily={Fonts.Bold} style={styles.text}>
                    Delivery in
                </CustomText>
                <View style={styles.flexRowGap}>
                    <CustomText fontFamily={Fonts.SemiBold} variant='h2' style={styles.text}>
                        10 minutes
                    </CustomText>
                    <TouchableOpacity style={styles.noticeButton} onPress={showNotice}>
                        <CustomText variant='h5' fontFamily={Fonts.Bold} style={[styles.text, { color: '#435ee6' }]}>
                            🌧️    Rain
                        </CustomText>
                    </TouchableOpacity>
                </View>
                <View style={styles.flexRow}>
                    <CustomText variant='h6' numberOfLines={1} fontFamily={Fonts.Medium} style={styles.text}>
                        {user?.address || 'Nowhere, Somewhere 😃'}
                    </CustomText>
                    <Icon
                        name='menu-down'
                        color='white'
                        size={RFValue(20)}
                        style={{ bottom: -1 }}
                    />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('Profile')}>
                <Icon name='account-circle-outline' size={RFValue(36)} color='white' />
            </TouchableOpacity>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: Platform.OS === 'android' ? 10 : 5,
        justifyContent: 'space-between',
        marginTop: -15
    },
    text: {
        color: 'white',
        fontWeight: 'bold'
    },
    text2: {
        color: 'white',
        width: '90%'
    },
    flexRow: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 2,
        width: '70%',
        marginTop: 2,
    },
    flexRowGap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        justifyContent: 'center'
    },
    noticeButton: {
        backgroundColor: "#e8eaf5",
        borderRadius: 100,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }
});