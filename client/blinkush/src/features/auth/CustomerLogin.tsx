import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

import { Alert, Animated, Image, Keyboard, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import ProductSlider from '@components/login/ProductSlider';
import { resetAndNavigate } from '@utils/navigation-utils';
import { logo } from 'constants/files/filesConstants';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts, lightColors } from '@utils/Constants';
import CustomInput from '@components/ui/CustomInput';
import CustomButton from '@components/ui/CustomButton';
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight';
import LinearGradient from 'react-native-linear-gradient';
import { customerLogin } from 'service/authService';

const bottomColors = [...lightColors].reverse();

const CustomerLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [gestureSequence, setGestureSequence] = useState<string[]>([]);
    const keyboardOffsetHeight = useKeyboardOffsetHeight();

    const handleGesture = ({ nativeEvent }: any) => {
        if (nativeEvent.state === State.END) {
            const { translationX, translationY } = nativeEvent;
            let direction = '';

            if (Math.abs(translationX) > Math.abs(translationY)) {
                direction = translationX > 0 ? 'right' : 'left';
            } else {
                direction = translationY > 0 ? 'down' : 'up';
            }

            const newSequence = [...gestureSequence, direction].slice(-5);
            setGestureSequence(newSequence);

            if (newSequence.join(' ') === 'up up down left right') {
                setGestureSequence([]);
                resetAndNavigate('DeliveryLogin');
            }
        }
    };

    const handleAuth = async () => {
        Keyboard.dismiss();
        setLoading(true);
        try {
            const res = await customerLogin(phoneNumber);
            // if (res?.data) {
            //     resetAndNavigate('LiveTracking');
            // }
            if (res?.data) {
                resetAndNavigate('ProductDashboard');
            }
        } catch (error) {
            Alert.alert('Login Failed');
        } finally {
            setLoading(false);
        }
    };

    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (keyboardOffsetHeight === 0) {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animatedValue, {
                toValue: -keyboardOffsetHeight * 0.84,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        }
    }, [keyboardOffsetHeight]);

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.container}>
                <CustomSafeAreaView>
                    <ProductSlider />
                    <PanGestureHandler onHandlerStateChange={handleGesture}>
                        <Animated.ScrollView
                            bounces={false}
                            keyboardDismissMode='on-drag'
                            keyboardShouldPersistTaps='handled'
                            contentContainerStyle={styles.subContainer}
                            style={{ transform: [{ translateY: animatedValue }] }}
                        >
                            <LinearGradient colors={bottomColors} style={styles.gradient} />
                            <View style={styles.content}>
                                <Image source={logo} style={styles.logo} />
                                <CustomText variant='h2' fontFamily={Fonts.Bold}>
                                    India's Last Minute App
                                </CustomText>
                                <CustomText variant='h2' fontFamily={Fonts.SemiBold} style={styles.text}>
                                    Login or sign up
                                </CustomText>
                                <CustomInput
                                    onChangeText={(text) => { setPhoneNumber(text.slice(0, 10)); }}
                                    onClear={() => setPhoneNumber('')}
                                    value={phoneNumber}
                                    left={<CustomText
                                        style={styles.phoneText}
                                        variant='h6'
                                        fontFamily={Fonts.SemiBold}
                                    >
                                        + 91
                                    </CustomText>
                                    }
                                    placeholder='Enter mobile number'
                                    inputMode='numeric'
                                />
                                <CustomButton
                                    disabled={phoneNumber?.length != 10}
                                    onPress={() => handleAuth()}
                                    isLoading={loading}
                                    title='Continue'
                                />
                            </View>
                        </Animated.ScrollView>
                    </PanGestureHandler>
                </CustomSafeAreaView>
                <View style={styles.footer}>
                    <SafeAreaView>
                        <CustomText

                            variant='h6'
                            fontFamily={Fonts.SemiBold}
                        >
                            By continuing you agree to our Terms of Service & Privacy Policy
                        </CustomText>

                    </SafeAreaView>
                </View>
            </View>
        </GestureHandlerRootView>
    );
};

export default CustomerLogin;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    subContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    logo: {
        height: 50,
        width: 50,
        borderRadius: 20,
        marginVertical: 10
    },
    text: {
        marginTop: 2,
        marginBottom: 25,
        opacity: 0.8
    },
    phoneText: {
        marginLeft: 10,
    },
    footer: {
        borderTopWidth: 0.8,
        borderTopColor: Colors.border,
        paddingBottom: 10,
        zIndex: 22,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 10,
        backgroundColor: '#f8f9fc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gradient: {
        paddingTop: 60,
        width: '100%',
    }
});