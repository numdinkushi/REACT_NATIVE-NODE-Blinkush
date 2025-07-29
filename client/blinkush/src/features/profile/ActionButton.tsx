import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Colors } from '@utils/Constants';
import { useTheme } from '@utils/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';

interface ActionButtonProps {
    icon: string;
    label: string;
    onPress?: () => void;
}
const ActionButton = ({ icon, label, onPress }: ActionButtonProps) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity onPress={onPress} style={styles.btn}>
            <View style={[styles.iconContainer, { backgroundColor: theme.backgroundSecondary }]}>
                <Icon name={icon} color={theme.text} size={RFValue(16)} />
            </View>
            <CustomText variant='h5'>
                {label}
            </CustomText>
        </TouchableOpacity>
    );
};

export default ActionButton;

const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 10
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderRadius: 100,
    }
});