import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Category } from '@utils/dummyData';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '@utils/Constants';

interface SidebarProps {
    categories: Category[];
    selectedCategory: Category | null;
    onCategoryPress: (category: Category) => void;
}

const Sidebar = ({ categories, selectedCategory, onCategoryPress }: SidebarProps) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const indicatorPosition = useSharedValue(0);
    const animatedValues = categories?.map(() => useSharedValue(0));

    useEffect(() => {
        let targetIndex = -1;
        categories?.forEach((category, index: number) => {
            const isSelected = selectedCategory?._id === category._id;
            animatedValues[index].value = withTiming(isSelected ? 2 : -15, { duration: 500 });
            if (isSelected) targetIndex = index;

        });

        if (targetIndex !== 1) {
            indicatorPosition.value = withTiming(targetIndex * 100, { duration: 500 });
            runOnJS(() => {
                scrollViewRef.current?.scrollTo({ y: targetIndex * 100, animated: true });
            });
        }

    }, [selectedCategory]);

    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: indicatorPosition.value }]
    }));

    return (
        <View style={styles.Sidebar}>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{ paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}>
               <Animated.View style={[styles.indicator, indicatorStyle]} />
                <Animated.View>
                    {categories?.map((category: Category, index: number) => {
                        const animatedStyle = useAnimatedStyle(() => ({
                            bottom: animatedValues[index].value
                        }));

                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={1}
                                style={styles.categoryButton}
                                onPress={() => onCategoryPress(category)}>
                                <View style={[styles.imageContainer]}>
                                    <Animated.Image
                                        source={{ uri: category.image }}
                                        style={[styles.image, animatedStyle, selectedCategory?.id === category?._id && styles.selectedImageContainer]}
                                    />
                                </View>
                                <CustomText fontSize={RFValue(10)} style={{ textAlign: 'center' }}>
                                    {category.name}
                                </CustomText>
                            </TouchableOpacity>
                        );
                    })}
                </Animated.View>
            </ScrollView>
        </View>
    );
};

export default Sidebar;

const styles = StyleSheet.create({
    Sidebar: {
        width: '24%',
        backgroundColor: 'white',
        borderRightWidth: 0.8,
        borderRightColor: '#eee',
        position: 'relative'
    },
    categoryButton: {
        padding: 10,
        height: 100,
        paddingVertical: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    image: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain'
    },
    imageContainer: {
        borderRadius: 100,
        height: '50%',
        marginBottom: 10,
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f7',
        overflow: 'hidden',
    },
    selectedImageContainer: {
        backgroundColor: '#cfffdb'
    },
    indicator: {
        position: 'absolute',
        right: 0,
        width: 4,
        height: 80,
        top: 10,
        alignSelf: 'center',
        backgroundColor: Colors.secondary,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    }
});