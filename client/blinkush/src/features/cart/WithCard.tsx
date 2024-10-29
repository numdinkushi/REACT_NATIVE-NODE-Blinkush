import { useCartStore } from "@state/cartStore";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import CartAnimationWrapper from "./CartAnimationWrapper";
import { defaultCartImage } from "constants/files/filesConstants";
import CartSummary from "./CartSummary";

const withCart = <P extends object>(WrappedComponent: React.ComponentType): FC<P> => {
    const WithCartComponent: FC<P> = (props) => {
        const cart = useCartStore((state) => state.cart);
        const cartCount = cart.reduce((acc, item) => acc + item.count, 0);

        return (
            <View style={styles.container}>
                <WrappedComponent {...props} />
                <CartAnimationWrapper cartCount={cartCount}>
                    <CartSummary
                        cartCount={cartCount}
                        cartImage ={cart![0]?.item?.image || defaultCartImage}
                    />
                </CartAnimationWrapper>
            </View>
        );
    };

    return WithCartComponent;
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default withCart;