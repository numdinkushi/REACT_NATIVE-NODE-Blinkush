import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import  Icon  from 'react-native-vector-icons/Ionicons';
import { Colors } from '@utils/Constants';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';

const WalletItem = ({ icon, label }: { icon: string, label: string; }) => {
    return (
        <View style={styles.walletItemContainer}>
           <Icon name={icon} color={Colors.text} size={RFValue(23)} />
           <CustomText variant='h6' >
                {label}
           </CustomText>
        </View>
    );
};

export default WalletItem;

const styles = StyleSheet.create({
    walletItemContainer: {
        alignItems: 'center',
    }
});