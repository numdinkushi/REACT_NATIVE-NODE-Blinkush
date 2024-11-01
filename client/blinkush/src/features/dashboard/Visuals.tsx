import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { darkWeatherColors } from '@utils/Constants';
import { screenHeight, screenWidth } from '@utils/scaling';
import { cloud, raining } from 'constants/files/filesConstants';
import LottieView from 'lottie-react-native';
import { useCollapsibleContext } from '@r0b0t3d/react-native-collapsible';

const Visuals = () => {
    const { scrollY } = useCollapsibleContext();
    const headerAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [0, 120], [1, 0]);
        return { opacity };
    });
console.log(111, cloud)
    return (
        <Animated.View style={[styles.container, headerAnimatedStyle]}>
            <LinearGradient colors={darkWeatherColors} style={styles.gradient} />
            <Image source={cloud} style={styles.cloud} />
            <LottieView
                autoPlay
                enableMergePathsAndroidForKitKatAndAbove={true}
                loop
                style={styles.lottie}
                source={raining}
            />
        </Animated.View>
    );
};

export default Visuals;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: -55,
        left: 0,
        right: 0,
        height: screenHeight * 0.1, // Adjust based on your needs
    },
    lottie: {
        width: '100%',
        height: 150,
        position: 'absolute',
        transform: [{ scaleX: -1 }]
    },
    gradient: {
        height: screenHeight * 0.4,
        width: '100%',
        position: 'absolute',
    },
    cloud: {
        width: screenWidth,
        resizeMode: 'stretch',
        height: 100,
    }
});