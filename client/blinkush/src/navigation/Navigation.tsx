import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from '@features/auth/SplashScreen';
import { navigationRef } from '@utils/navigation-utils';
import DeliveryLogin from '@features/auth/DeliveryLogin';
import CustomerLogin from '@features/auth/CustomerLogin';

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName='SplashScreen'
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name='SplashScreen' component={SplashScreen} />
                <Stack.Screen
                    options={{
                        animation: 'fade'
                    }}
                    name='DeliveryLogin'
                    component={DeliveryLogin}
                />
                <Stack.Screen
                    options={{
                        animation: 'fade'
                    }}
                    name='CustomerLogin'
                    component={CustomerLogin}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;