import { SafeAreaView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@utils/ThemeContext';

interface CustomSafeAreaViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

const CustomSafeAreaView = ({
    children,
    style
}: CustomSafeAreaViewProps) => {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }, style]}>
            <View style={[styles.container, { backgroundColor: theme.background }, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};

export default CustomSafeAreaView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});