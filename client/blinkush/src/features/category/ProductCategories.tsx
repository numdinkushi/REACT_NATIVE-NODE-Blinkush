import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomHeader from '@components/ui/CustomHeader';
import { Colors } from '@utils/Constants';
import Sidebar from './Sidebar';
import { Category } from '@utils/dummyData';
import { getAllCategories } from 'service/productService';

const ProductCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<any>([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(false);
    const [isProductLoading, setIsProductLoading] = useState<boolean>(false);

    const fetchCategories = async () => {
        try {
            setIsCategoriesLoading(true);
            const data = await getAllCategories();
            setCategories(data);
            if (data && data?.length > 0) {
                setSelectedCategory(data[0]);
            }
        } catch (error) {
            console.log('Error fetching categories', error);
        } finally { setIsCategoriesLoading(false); };
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <View style={styles.mainContainer}>
            <CustomHeader title={selectedCategory?.name || 'Categories'} search />
            <View style={styles.subContainer}>
                {isCategoriesLoading
                    ? (<ActivityIndicator color={Colors.border} />)
                    : <Sidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryPress={(category: Category) => setSelectedCategory(category)}
                    />}
            </View>
        </View>
    );
};

export default ProductCategories;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    subContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});