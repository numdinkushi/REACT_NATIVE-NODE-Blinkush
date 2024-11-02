import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomText from '@components/ui/CustomText';
// import { Order } from 'types/types';
import { CartItem } from '@state/cartStore';
import { formatIsoToCustom } from '@utils/dateUtils';

interface Order {
  orderId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: string;
}

const OrderItem = ({ index, item, }: { index: number, item: Order; }) => {
  return (
    <View style={[styles.container, { borderTopWidth: index === 0 ? 0.7 : 0 }]}>
      <View style={styles.flexRowBetween}>
        <CustomText variant='h4' >
          #{item?.orderId} 
        </CustomText>
        <CustomText variant='h5' style={{ textTransform: 'capitalize', marginLeft: 4 }}>
          {item?.status}
        </CustomText>
      </View>
      <View style={styles.flexRowBetween}>
        <View style={{ width: '50%' }} >
          {item?.items?.map((i, index) => {
            return (
              <CustomText variant='h6' key={index} numberOfLines={1}>
                {i.count} x {i.item?.name}
              </CustomText>
            );
          })}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <CustomText variant='h5' style={{ fontWeight: 600, marginTop: 10 }}>
            Total: ${item?.totalPrice.toFixed(2)}
          </CustomText>
          <CustomText variant='h7'>
            {formatIsoToCustom(item.createdAt)}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.7,
    paddingVertical: 15,
    opacity: 0.9
  },
  flexRowBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  }
});