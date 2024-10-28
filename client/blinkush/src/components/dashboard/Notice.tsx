import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NoticeHeight } from '@utils/scaling';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import Svg, { Defs, G, Path, Use } from 'react-native-svg';
import { wavyData } from '@utils/dummyData';

const Notice = () => {
    return (
        <View style={{ height: NoticeHeight }}>
            <View style={styles.container}>
                <View style={styles.noticeContainer} >
                    <SafeAreaView style={{ padding: 10 }}>
                        <CustomText style={styles.heading} variant='h5' fontFamily={Fonts.Bold}>
                            It's raining near this location
                        </CustomText>
                        <CustomText variant='h6' style={styles.textCenter}>
                            Our Delivery Partners may take longer to reach you
                        </CustomText>
                    </SafeAreaView>
                </View>
            </View>
            <Svg
                width='100%'
                height='35'
                fill='#ccd5e4'
                viewBox='0 0 4000 1000'
                preserveAspectRatio='none'
                style={styles.wave}
            >
                <Defs>
                    <Path id='wavepath' d={wavyData} />
                </Defs>
                <G>
                    <Use href='#wavepath' y='321' />
                </G>
            </Svg>
        </View>
    );
};

export default Notice;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ccd5e4',
        padding: 10,
    },
    noticeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccd5e4',
    },
    heading: {
        color: '#2d3875',
        marginBottom: 7,
        fontWeight: '500',
        textAlign: 'center',
    },
    textCenter: {
        textAlign: 'center',
        marginBottom: 8,
    },
    wave: {
        width: '100%',
        transform: [{ rotateX: '180deg' }]
    }
});