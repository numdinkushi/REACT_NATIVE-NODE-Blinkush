import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { screenWidth } from '@utils/scaling';
import Carousel from 'react-native-reanimated-carousel';
// import { Image } from 'react-native';

const AdCarousel = ({ adData }: { adData: ImageSourcePropType[]; }) => {
    const progressValue = useSharedValue(0);
    const baseOptions = {
        vertical: false,
        width: screenWidth,
        height: screenWidth * 0.5
    };

    return (
        <View style={{ left: -10, marginVertical: 20 }}>
            <Carousel
                {...baseOptions}
                loop
                pagingEnabled
                snapEnabled
                autoPlay
                autoPlayInterval={3000}
                mode='parallax'
                data={adData}
                modeConfig={{
                    parallaxScrollingOffset: 0.94,
                    parallaxScrollingScale: 0.4
                }}
                renderItem={({ item }: { item: ImageSourcePropType | undefined; }) => {
                    return (<Image style={styles.img} source={item} />);
                }}
            />
        </View>
    );
};

export default AdCarousel;

const styles = StyleSheet.create({
    imageContainer: {
        height: '100%',
        width: '100%',
    },
    img: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 20
    },
    dots: {

    }
});