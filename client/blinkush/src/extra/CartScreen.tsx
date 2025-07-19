import React, { useState, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Alert,
    Image,
    TextInput,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '@components/ui/CustomText';
import CustomHeader from '@components/ui/CustomHeader';
import { Colors, Fonts } from '@utils/Constants';
import { navigate } from '@utils/navigation-utils';
import { CartItem } from '@state/cartStore';

// Constants
const PROMO_CODES = {
    SAVE10: 'save10',
} as const;

const FEES = {
    DELIVERY: 2.99,
    TAX_RATE: 0.08,
} as const;

const DISCOUNT_RATES = {
    [PROMO_CODES.SAVE10]: 0.1,
} as const;

// Types
interface CartScreenProps {
    cartItems: CartItem[];
    updateQuantity: (id: string, quantity: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
}

interface OrderSummary {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
}

// Custom Hooks
const usePromoCode = () => {
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [discount, setDiscount] = useState(0);

    const applyPromoCode = useCallback((subtotal: number) => {
        const normalizedCode = promoCode.toLowerCase();
        const discountRate = DISCOUNT_RATES[normalizedCode as keyof typeof DISCOUNT_RATES];

        if (discountRate) {
            setDiscount(subtotal * discountRate);
            setPromoApplied(true);
            Alert.alert('Success', `Promo code applied! ${(discountRate * 100)}% discount added.`);
        } else {
            Alert.alert('Error', 'Invalid promo code');
        }
    }, [promoCode]);

    const resetPromoCode = useCallback(() => {
        setPromoCode('');
        setPromoApplied(false);
        setDiscount(0);
    }, []);

    return {
        promoCode,
        setPromoCode,
        promoApplied,
        discount,
        applyPromoCode,
        resetPromoCode,
    };
};

// Utility Functions
const calculateOrderSummary = (cartItems: CartItem[], discount: number): OrderSummary => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.item.price * item.count), 0);
    const deliveryFee = FEES.DELIVERY;
    const tax = subtotal * FEES.TAX_RATE;
    const total = subtotal + deliveryFee + tax - discount;

    return { subtotal, deliveryFee, tax, discount, total };
};

// Components
const EmptyCartView: React.FC = () => (
    <View style={styles.emptyCart}>
        <Icon name="cart-outline" size={80} color={Colors.border} />
        <CustomText variant="h5" style={styles.emptyCartText}>
            Your cart is empty
        </CustomText>
        <CustomText variant="h7" style={styles.emptyCartSubtext}>
            Add some delicious items to get started
        </CustomText>
        <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => navigate('ProductCategories')}
        >
            <CustomText variant="h6" style={styles.continueShoppingText}>
                Continue Shopping
            </CustomText>
        </TouchableOpacity>
    </View>
);

interface CartItemRowProps {
    item: CartItem;
    onQuantityChange: (id: string, change: number) => void;
    onRemove: (id: string) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, onQuantityChange, onRemove }) => (
    <View style={styles.cartItem}>
        <Image source={{ uri: item.item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
            <CustomText variant="h6" fontFamily={Fonts.Medium}>
                {item.item.name}
            </CustomText>
            <CustomText variant="h8" style={styles.itemPrice}>
                ${item.item.price.toFixed(2)}
            </CustomText>
            {item.customizations && (
                <CustomText variant="h9" style={styles.customizations}>
                    {item.customizations.join(', ')}
                </CustomText>
            )}
        </View>
        <View style={styles.quantityControls}>
            <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onQuantityChange(item.item._id, -1)}
            >
                <Icon name="minus" size={16} color={Colors.primary} />
            </TouchableOpacity>
            <CustomText variant="h6" style={styles.quantityText}>
                {item.count}
            </CustomText>
            <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onQuantityChange(item.item._id, 1)}
            >
                <Icon name="plus" size={16} color={Colors.primary} />
            </TouchableOpacity>
        </View>
        <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(item.item._id)}
        >
            <Icon name="trash-can-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
    </View>
);

interface PromoCodeSectionProps {
    promoCode: string;
    promoApplied: boolean;
    onPromoCodeChange: (code: string) => void;
    onApplyPromo: () => void;
}

const PromoCodeSection: React.FC<PromoCodeSectionProps> = ({
    promoCode,
    promoApplied,
    onPromoCodeChange,
    onApplyPromo,
}) => (
    <View style={styles.promoSection}>
        <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
            Promo Code
        </CustomText>
        <View style={styles.promoInputContainer}>
            <TextInput
                style={styles.promoInput}
                placeholder="Enter promo code"
                value={promoCode}
                onChangeText={onPromoCodeChange}
                editable={!promoApplied}
            />
            <TouchableOpacity
                style={[styles.promoButton, promoApplied && styles.promoButtonApplied]}
                onPress={onApplyPromo}
                disabled={promoApplied}
            >
                <CustomText variant="h7" style={styles.promoButtonText}>
                    {promoApplied ? 'Applied' : 'Apply'}
                </CustomText>
            </TouchableOpacity>
        </View>
    </View>
);

interface OrderSummarySectionProps {
    orderSummary: OrderSummary;
}

const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({ orderSummary }) => (
    <View style={styles.summarySection}>
        <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
            Order Summary
        </CustomText>

        <View style={styles.summaryRow}>
            <CustomText variant="h7">Subtotal</CustomText>
            <CustomText variant="h7">${orderSummary.subtotal.toFixed(2)}</CustomText>
        </View>

        <View style={styles.summaryRow}>
            <CustomText variant="h7">Delivery Fee</CustomText>
            <CustomText variant="h7">${orderSummary.deliveryFee.toFixed(2)}</CustomText>
        </View>

        <View style={styles.summaryRow}>
            <CustomText variant="h7">Tax</CustomText>
            <CustomText variant="h7">${orderSummary.tax.toFixed(2)}</CustomText>
        </View>

        {orderSummary.discount > 0 && (
            <View style={styles.summaryRow}>
                <CustomText variant="h7" style={styles.discountText}>Discount</CustomText>
                <CustomText variant="h7" style={styles.discountText}>
                    -${orderSummary.discount.toFixed(2)}
                </CustomText>
            </View>
        )}

        <View style={[styles.summaryRow, styles.totalRow]}>
            <CustomText variant="h5" fontFamily={Fonts.Medium}>Total</CustomText>
            <CustomText variant="h5" fontFamily={Fonts.Medium}>
                ${orderSummary.total.toFixed(2)}
            </CustomText>
        </View>
    </View>
);

interface CheckoutButtonProps {
    total: number;
    cartItems: CartItem[];
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ total, cartItems }) => (
    <View style={styles.checkoutContainer}>
        <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigate('Checkout', { cartItems, total })}
        >
            <CustomText variant="h6" style={styles.checkoutText}>
                Proceed to Checkout • ${total.toFixed(2)}
            </CustomText>
        </TouchableOpacity>
    </View>
);

// Main Component
const CartScreen: React.FC<CartScreenProps> = ({
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
}) => {
    const {
        promoCode,
        setPromoCode,
        promoApplied,
        discount,
        applyPromoCode,
    } = usePromoCode();

    const orderSummary = useMemo(
        () => calculateOrderSummary(cartItems, discount),
        [cartItems, discount]
    );

    const handleQuantityChange = useCallback((id: string, change: number) => {
        const item = cartItems.find(item => item.item._id === id);
        if (!item) return;

        const newQuantity = item.count + change;
        if (newQuantity > 0) {
            updateQuantity(id, newQuantity);
        } else {
            removeFromCart(id);
        }
    }, [cartItems, updateQuantity, removeFromCart]);

    const handleRemoveItem = useCallback((id: string) => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this item from your cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(id) },
            ]
        );
    }, [removeFromCart]);

    const handleClearCart = useCallback(() => {
        Alert.alert(
            'Clear Cart',
            'Are you sure you want to clear your entire cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: clearCart },
            ]
        );
    }, [clearCart]);

    const handleApplyPromoCode = useCallback(() => {
        applyPromoCode(orderSummary.subtotal);
    }, [applyPromoCode, orderSummary.subtotal]);

    const renderCartItem = useCallback(({ item }: { item: CartItem }) => (
        <CartItemRow
            item={item}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
        />
    ), [handleQuantityChange, handleRemoveItem]);

    if (cartItems.length === 0) {
        return (
            <View style={styles.container}>
                <CustomHeader title="Your Cart" />
                <EmptyCartView />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomHeader
                title="Your Cart"
                rightComponent={
                    <TouchableOpacity onPress={handleClearCart}>
                        <Icon name="trash-can-outline" size={24} color={Colors.error} />
                    </TouchableOpacity>
                }
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <FlatList
                    data={cartItems}
                    renderItem={renderCartItem}
                    keyExtractor={(item) => item.item._id}
                    scrollEnabled={false}
                    style={styles.cartList}
                />

                <PromoCodeSection
                    promoCode={promoCode}
                    promoApplied={promoApplied}
                    onPromoCodeChange={setPromoCode}
                    onApplyPromo={handleApplyPromoCode}
                />

                <OrderSummarySection orderSummary={orderSummary} />
            </ScrollView>

            <CheckoutButton total={orderSummary.total} cartItems={cartItems} />
        </View>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
    },
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyCartText: {
        marginTop: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyCartSubtext: {
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 30,
    },
    continueShoppingButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    continueShoppingText: {
        color: 'white',
    },
    cartList: {
        paddingHorizontal: 16,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
    },
    itemPrice: {
        color: Colors.text,
        marginTop: 4,
    },
    customizations: {
        color: Colors.text,
        fontSize: RFValue(10),
        marginTop: 2,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        marginHorizontal: 16,
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        padding: 8,
    },
    promoSection: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    promoInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    promoInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginRight: 12,
        fontSize: RFValue(12),
    },
    promoButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    promoButtonApplied: {
        backgroundColor: Colors.success,
    },
    promoButtonText: {
        color: 'white',
    },
    summarySection: {
        padding: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: 12,
        marginTop: 8,
    },
    discountText: {
        color: Colors.success,
    },
    checkoutContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    checkoutButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutText: {
        color: 'white',
        fontFamily: Fonts.Medium,
    },
});