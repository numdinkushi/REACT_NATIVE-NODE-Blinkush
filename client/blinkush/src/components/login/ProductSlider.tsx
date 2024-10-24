import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo, useMemo } from 'react';
import { imageData } from '@utils/dummyData';
import AutoScroll from '@homielab/react-native-auto-scroll';
import { screenWidth } from '@utils/scaling';

const ProductSlider = () => {
    const rows = useMemo(() => {
        const result: typeof imageData[][] = [];
        for (let i = 0; i < imageData.length; i += 4) {
            result.push(imageData.slice(i, i + 4));
        }
        return result;
    }, [imageData]);

    return (
        <View pointerEvents='none'>
            <AutoScroll
                style={styles.autoScroll}
                endPaddingWidth={0}
                duration={10000}
            >
                <View style={styles.gridContainer}>
                    {rows?.map((row, rowIndex) => (
                        <MemoizedRow key={rowIndex} row={row} rowIndex={rowIndex} />
                    ))}
                </View>
            </AutoScroll>
        </View>
    );
};

const Row = ({ row, rowIndex }: { row: typeof imageData; rowIndex: number; }) => {
    const horizontalShift = rowIndex % 2 === 0 ? -18 : 18;

    return (
        <View style={[styles.row]}>
            {row.map((image, imageIndex) => {
                const source = typeof image === 'string' ? { uri: image } : image;
                return (
                    <View key={imageIndex} style={[styles.itemContainer, {transform: [{translateX: horizontalShift}]}]}>
                        <Image source={source} style={styles.image} />
                    </View>
                );
            })}
        </View>
    );
};

const MemoizedRow = memo(Row);

const styles = StyleSheet.create({
    itemContainer: {
        marginBottom: 12,
        marginHorizontal: 10,
        width: screenWidth * 0.26,
        height: screenWidth * 0.26,
        backgroundColor: '#d5fcf9f8',
        justifyContent: 'center',
        marginTop:20,
        borderRadius: 25,
        alignItems: 'center',
    },
    autoScroll: {
        position: 'absolute',
        zIndex: -2
    },
    gridContainer: {
        justifyContent: 'center',
        overflow: 'visible',
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default ProductSlider;
