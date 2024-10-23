import { SafeAreaView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';

interface CustomSafeAreaViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

const CustomSafeAreaView = ({
    children,
    style
}: CustomSafeAreaViewProps) => {
    return (
        <SafeAreaView style={[styles.container, style]}>
            <View style={[styles.container, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};

export default CustomSafeAreaView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});