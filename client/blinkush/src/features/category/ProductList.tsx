import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from '@utils/Constants';
import { FlatList } from 'react-native-gesture-handler';
import { Product } from '@utils/dummyData';
import ProductItem from './ProductItem';
import CustomText from '@components/ui/CustomText';

const ProductList = ({ data }: { data: Product[]; }) => {

    const renderItem = ({ item, index }: { item: Product, index: number | string; }) => {
    //    console.log(1123, item)
    //     const isEmpty = !item;
    //     if (isEmpty) {
    //         return <CustomText style={{color: Colors.text}}>No products</CustomText>;
    //     }
    
        return (
            <ProductItem item={item} index={Number(index)} />
        );
    };

    return (
        <FlatList
            data={data}
            style={styles.container}
            keyExtractor={(item) => {

                return item._id || '';
            }}
            renderItem={renderItem}
            contentContainerStyle={styles.content}
            numColumns={2}
        >

        </FlatList>
    );
};

export default ProductList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: Colors.backgroundSecondary,
        
    },
    content: {
        paddingVertical: 10,
    }
});