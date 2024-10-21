import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { Colors } from '@utils/Constants';
import { screenHeight, screenWidth } from '@utils/scaling';
import Logo from "@assets/images/splash_logo.jpeg";
import Geolocation from "@react-native-community/geolocation";

Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'always',
    enableBackgroundLocationUpdates: true,
    locationProvider: 'auto'
});

const SplashScreen = () => {

    useEffect(() => {
        const fetchUserLocation = async () => {
            try {
                Geolocation.requestAuthorization();
            } catch (error) {
                Alert.alert("Sorry we need location service to give you a better shopping experience");
            }
        };

        const timeoutId = setTimeout(fetchUserLocation, 1000);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <View style={styles.container}>
            <Image source={Logo} style={styles.logoImage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoImage: {
        height: screenHeight * 0.7,
        width: screenWidth * 0.7,
        resizeMode: 'contain',
        // marginBottom: 20
    }
});

export default SplashScreen;