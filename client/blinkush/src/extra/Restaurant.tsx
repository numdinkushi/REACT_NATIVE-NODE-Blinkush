import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '@components/ui/CustomText';
import CustomHeader from '@components/ui/CustomHeader';
import { Colors, Fonts } from '@utils/Constants';
import { navigate } from '@utils/navigation-utils';
import withCart from '@features/cart/WithCart';

const { width } = Dimensions.get('window');

interface Restaurant {
    _id: string;
    name: string;
    image: string;
    rating: number;
    deliveryTime: string;
    deliveryFee: number;
    description: string;
    cuisineType: string[];
    address: string;
    phone: string;
    isOpen: boolean;
    openingHours: string;
    minimumOrder: number;
}

interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isVeg: boolean;
    isAvailable: boolean;
}

interface RestaurantDetailProps {
    route: {
        params: {
            restaurantId: string;
        };
    };
}

const RestaurantDetail: React.FC<RestaurantDetailProps> = ({ route }) => {
    const { restaurantId } = route.params;
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>(['All']);

    useEffect(() => {
        fetchRestaurantDetails();
    }, [restaurantId]);

    const fetchRestaurantDetails = async () => {
        try {
            setLoading(true);
            // Mock API call - replace with actual service
            // const restaurantData = await getRestaurantById(restaurantId);
            // const menuData = await getMenuByRestaurantId(restaurantId);

            // Mock data for demonstration
            const mockRestaurant: Restaurant = {
                _id: restaurantId,
                name: "Pizza Palace",
                image: "https://example.com/restaurant.jpg",
                rating: 4.5,
                deliveryTime: "25-35 min",
                deliveryFee: 2.99,
                description: "Best pizza in town with fresh ingredients",
                cuisineType: ["Italian", "Fast Food"],
                address: "123 Main St, City",
                phone: "+1-234-567-8900",
                isOpen: true,
                openingHours: "10:00 AM - 11:00 PM",
                minimumOrder: 15,
            };

            const mockMenuItems: MenuItem[] = [
                {
                    _id: "1",
                    name: "Margherita Pizza",
                    description: "Classic pizza with fresh mozzarella and basil",
                    price: 12.99,
                    image: "https://example.com/pizza1.jpg",
                    category: "Pizza",
                    isVeg: true,
                    isAvailable: true,
                },
                {
                    _id: "2",
                    name: "Pepperoni Pizza",
                    description: "Spicy pepperoni with melted cheese",
                    price: 15.99,
                    image: "https://example.com/pizza2.jpg",
                    category: "Pizza",
                    isVeg: false,
                    isAvailable: true,
                },
                {
                    _id: "3",
                    name: "Caesar Salad",
                    description: "Fresh romaine lettuce with caesar dressing",
                    price: 8.99,
                    image: "https://example.com/salad1.jpg",
                    category: "Salads",
                    isVeg: true,
                    isAvailable: true,
                },
            ];

            setRestaurant(mockRestaurant);
            setMenuItems(mockMenuItems);

            const uniqueCategories = ['All', ...new Set(mockMenuItems.map(item => item.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMenuItems = selectedCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    const renderMenuItem = ({ item }: { item: MenuItem; }) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigate('ProductDetail', { productId: item._id })}
        >
            <Image source={{ uri: item.image }} style={styles.menuItemImage} />
            <View style={styles.menuItemContent}>
                <View style={styles.menuItemHeader}>
                    <CustomText variant="h6" fontFamily={Fonts.Medium}>
                        {item.name}
                    </CustomText>
                    <View style={styles.vegIndicator}>
                        <Icon
                            name="circle"
                            size={12}
                            color={item.isVeg ? Colors.success : Colors.error}
                        />
                    </View>
                </View>
                <CustomText variant="h8" style={styles.menuItemDescription}>
                    {item.description}
                </CustomText>
                <View style={styles.menuItemFooter}>
                    <CustomText variant="h6" fontFamily={Fonts.Medium}>
                        ${item.price.toFixed(2)}
                    </CustomText>
                    <TouchableOpacity style={styles.addButton}>
                        <Icon name="plus" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderCategoryTab = ({ item }: { item: string; }) => (
        <TouchableOpacity
            style={[
                styles.categoryTab,
                selectedCategory === item && styles.selectedCategoryTab
            ]}
            onPress={() => setSelectedCategory(item)}
        >
            <CustomText
                variant="h7"
                style={[
                    styles.categoryTabText,
                    selectedCategory === item && styles.selectedCategoryTabText
                ]}
            >
                {item}
            </CustomText>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!restaurant) {
        return (
            <View style={styles.errorContainer}>
                <CustomText variant="h6">Restaurant not found</CustomText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomHeader title={restaurant.name} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Restaurant Image */}
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />

                {/* Restaurant Status Overlay */}
                {!restaurant.isOpen && (
                    <View style={styles.closedOverlay}>
                        <CustomText variant="h6" style={styles.closedText}>
                            Currently Closed
                        </CustomText>
                    </View>
                )}

                {/* Restaurant Info */}
                <View style={styles.restaurantInfo}>
                    <View style={styles.restaurantHeader}>
                        <CustomText variant="h5" fontFamily={Fonts.Medium}>
                            {restaurant.name}
                        </CustomText>
                        <View style={styles.ratingContainer}>
                            <Icon name="star" size={16} color={Colors.warning} />
                            <CustomText variant="h7" style={styles.ratingText}>
                                {restaurant.rating}
                            </CustomText>
                        </View>
                    </View>

                    <CustomText variant="h7" style={styles.cuisineType}>
                        {restaurant.cuisineType.join(" • ")}
                    </CustomText>

                    <CustomText variant="h8" style={styles.description}>
                        {restaurant.description}
                    </CustomText>

                    {/* Delivery Info */}
                    <View style={styles.deliveryInfo}>
                        <View style={styles.deliveryItem}>
                            <Icon name="clock-outline" size={16} color={Colors.text} />
                            <CustomText variant="h8" style={styles.deliveryText}>
                                {restaurant.deliveryTime}
                            </CustomText>
                        </View>
                        <View style={styles.deliveryItem}>
                            <Icon name="bike" size={16} color={Colors.text} />
                            <CustomText variant="h8" style={styles.deliveryText}>
                                ${restaurant.deliveryFee.toFixed(2)} delivery
                            </CustomText>
                        </View>
                        <View style={styles.deliveryItem}>
                            <Icon name="currency-usd" size={16} color={Colors.text} />
                            <CustomText variant="h8" style={styles.deliveryText}>
                                ${restaurant.minimumOrder} minimum
                            </CustomText>
                        </View>
                    </View>
                </View>

                {/* Category Tabs */}
                <FlatList
                    data={categories}
                    renderItem={renderCategoryTab}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryTabs}
                    contentContainerStyle={styles.categoryTabsContent}
                />

                {/* Menu Items */}
                <FlatList
                    data={filteredMenuItems}
                    renderItem={renderMenuItem}
                    keyExtractor={(item) => item._id}
                    scrollEnabled={false}
                    style={styles.menuList}
                />
            </ScrollView>
        </View>
    );
};

export default withCart(RestaurantDetail);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    restaurantImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    closedOverlay: {
        position: 'absolute',
        top: 160,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closedText: {
        color: 'white',
    },
    restaurantInfo: {
        padding: 16,
    },
    restaurantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 4,
    },
    cuisineType: {
        color: Colors.text,
        marginBottom: 8,
    },
    description: {
        color: Colors.text,
        marginBottom: 16,
    },
    deliveryInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    deliveryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    deliveryText: {
        marginLeft: 4,
        color: Colors.text,
    },
    categoryTabs: {
        maxHeight: 50,
    },
    categoryTabsContent: {
        paddingHorizontal: 16,
    },
    categoryTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    selectedCategoryTab: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    categoryTabText: {
        color: Colors.text,
    },
    selectedCategoryTabText: {
        color: 'white',
    },
    menuList: {
        padding: 16,
    },
    menuItem: {
        flexDirection: 'row',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        paddingBottom: 16,
    },
    menuItemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    menuItemContent: {
        flex: 1,
    },
    menuItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    vegIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemDescription: {
        color: Colors.text,
        marginBottom: 8,
    },
    menuItemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});