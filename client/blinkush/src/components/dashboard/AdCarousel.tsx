import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { screenWidth } from '@utils/scaling';
import Carousel from 'react-native-reanimated-carousel';
import ScalePress from '@components/ui/ScalePress';

const AdCarousel = ({ adData }: { adData: ImageSourcePropType[]; }) => {
    const baseOptions = {
        vertical: false,
        width: screenWidth,
        height: screenWidth * 0.5
    };

    return (
        <View style={{ left: -20, marginVertical: 20, }}>
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
                    parallaxScrollingOffset: 0,
                    parallaxScrollingScale: 0.94
                }}
                renderItem={({ item }: { item: ImageSourcePropType | undefined; }) => {
                    return (
                        <ScalePress style={styles.imageContainer}>
                            <Image style={styles.img} source={item} />
                        </ScalePress>
                    );
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