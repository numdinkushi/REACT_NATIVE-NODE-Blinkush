
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import { Colors, Fonts } from '@utils/Constants';

interface CustomButtonProps {
    onPress: () => void;
    title: string;
    disabled?: boolean;
    isLoading?: boolean;
}

const CustomButton = ({
    onPress,
    title,
    disabled,
    isLoading
}: CustomButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
            style={[styles.button, { backgroundColor: disabled ? Colors.disabled : Colors.secondary }]}
        >
            {

                isLoading
                    ? <ActivityIndicator
                        color='white'
                        size='small'
                    />
                    : <CustomText
                        variant='h6'
                        style={styles.text}
                        fontFamily={Fonts.SemiBold}
                    >
                        {title}
                    </CustomText>

            }
        </TouchableOpacity>
    );
};

export default CustomButton;

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 15,
        marginVertical: 15,
        width: '100%',
    },
    text: {
        color: 'white',
    }
});