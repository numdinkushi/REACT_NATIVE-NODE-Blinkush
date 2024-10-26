import { StyleSheet, Text, View, Animated as RNAnimated } from 'react-native';
import React from 'react';
import { NoticeHeight } from '@utils/scaling';
import Notice from '@components/dashboard/Notice';

const NOTICE_HEIGHT = -(NoticeHeight + 12);

const NoticeAnimation = ({ noticePosition, children }: { noticePosition:  RNAnimated.Value, children: React.ReactNode; }) => {
    return (
        <View style={styles.container}>
            <RNAnimated.View style={[styles.noticeContainer, { transform: [{ translateY: noticePosition }] }]}>
                <Notice />
            </RNAnimated.View>
            <RNAnimated.View style={[styles.contentContainer, {
                paddingTop: noticePosition.interpolate({
                    inputRange: [NOTICE_HEIGHT, 0],
                    outputRange: [0, NOTICE_HEIGHT + 20]
                })
            }]}>
                {children}
            </RNAnimated.View>
        </View>
    );
};

export default NoticeAnimation;

const styles = StyleSheet.create({
    noticeContainer: {
        width: '100%',
        zIndex: 99,
    },
    contentContainer: {
        flex: 1,
        width: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
});