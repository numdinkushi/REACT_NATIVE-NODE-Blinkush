import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomHeader from '@components/ui/CustomHeader';
import { Colors } from '@utils/Constants';
import Sidebar from './Sidebar';
import { Category, Product, } from '@utils/dummyData';
import { getAllCategories, getProductsByCategoryId } from 'service/productService';
import ProductList from './ProductList';
import withCart from '@features/cart/WithCart';

const ProductCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
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

    const fetchProducts = async (categoryId: string) => {
        try {
            setIsProductLoading(true);
            const data = await getProductsByCategoryId(categoryId);
            setProducts(data);
            if (data && data?.length > 0) {
                setProducts(data);
            }
        } catch (error) {
            console.log('Error fetching products', error);
        } finally { setIsProductLoading(false); };
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory?._id) {
            fetchProducts(selectedCategory?._id);
        }
    }, [selectedCategory]);

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
                    />
                }
                {
                    isProductLoading
                        ? (<ActivityIndicator
                            color={Colors.border}
                            style={styles.center}
                        />)
                        : (
                            <ProductList
                                data={products}
                            />
                        )
                }
            </View>
        </View>
    );
};

export default withCart(ProductCategories);

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