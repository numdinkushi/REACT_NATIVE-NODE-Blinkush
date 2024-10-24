import { Keyboard, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

const useKeyboardOffsetHeight = () => {
    const [keyboardOffsetHeight, setKeyboardOffsetHeight] = useState(0);

    useEffect(() => {
        const keyboardWillAndroidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            e => {
                setKeyboardOffsetHeight(e.endCoordinates.height);
            }
        );

        const keyboardWillAndroidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            e => {
                setKeyboardOffsetHeight(0);
            }
        );

        const keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            e => {
                setKeyboardOffsetHeight(e.endCoordinates.height);
            }
        );

        const keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            e => {
                setKeyboardOffsetHeight(e.endCoordinates.height);
            }
        );

        return () => {
            keyboardWillAndroidShowListener.remove();
            keyboardWillAndroidHideListener.remove();
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };

    }, []);

    return keyboardOffsetHeight;
};

export default useKeyboardOffsetHeight;

const styles = StyleSheet.create({});