import React from 'react';
import { StyleSheet, TouchableOpacity, View, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from './CustomText';
import { useTheme } from '@utils/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, themeMode, isDark, setThemeMode, toggleTheme } = useTheme();

    const getThemeIcon = () => {
        switch (themeMode) {
            case 'light':
                return 'sunny-outline';
            case 'dark':
                return 'moon-outline';
            case 'system':
                return 'phone-portrait-outline';
            default:
                return 'sunny-outline';
        }
    };

    const getThemeLabel = () => {
        switch (themeMode) {
            case 'light':
                return 'Light Mode';
            case 'dark':
                return 'Dark Mode';
            case 'system':
                return 'System Default';
            default:
                return 'Light Mode';
        }
    };

    const cycleTheme = () => {
        switch (themeMode) {
            case 'light':
                setThemeMode('dark');
                break;
            case 'dark':
                setThemeMode('system');
                break;
            case 'system':
                setThemeMode('light');
                break;
        }
    };

    return (
        <TouchableOpacity onPress={cycleTheme} style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: theme.backgroundSecondary }]}>
                <Icon name={getThemeIcon()} color={theme.text} size={RFValue(16)} />
            </View>
            <View style={styles.content}>
                <CustomText variant='h5'>
                    {getThemeLabel()}
                </CustomText>
                <CustomText variant='h8' style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Tap to change
                </CustomText>
            </View>
        </TouchableOpacity>
    );
};

export default ThemeToggle;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 10,
        paddingVertical: 5,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderRadius: 100,
    },
    content: {
        flex: 1,
    },
    subtitle: {
        marginTop: 2,
        opacity: 0.7,
    },
}); 