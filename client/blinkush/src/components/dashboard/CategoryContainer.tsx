import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Categories } from '@utils/dummyData';
import ScalePress from '@components/ui/ScalePress';
import { navigate } from '@utils/navigation-utils';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';

const CategoryContainer = ({ data }: { data: Categories[]; }) => {
    const renderItems = (items: Categories[]) => {
        return items.map((item, index: number) => (
            <ScalePress onPress={() => navigate('ProductCategories')} key={index} style={styles.item}>
                <View style={styles.imageContainer}>
                    <Image source={item.image as ImageSourcePropType} style={styles.image} />
                </View>
                <CustomText style={styles.text} variant='h6' fontFamily={Fonts.Medium}>
                    {item.name}
                </CustomText>
            </ScalePress>
        ));
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>{renderItems(data?.slice(0, 4))}</View>
            <View style={styles.row}>{renderItems(data?.slice(4))}</View>
        </View>
    );
};

export default CategoryContainer;

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 25,
    },
    text: {
        textAlign: 'center',
    },
    item: {
        width: '22%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 6,
        backgroundColor: '#e5f3f3',
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});
