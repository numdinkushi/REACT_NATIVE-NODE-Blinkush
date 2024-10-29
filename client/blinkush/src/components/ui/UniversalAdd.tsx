import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Product } from '@utils/dummyData';
import { useCartStore } from '@state/cartStore';
import { Colors } from '@utils/Constants';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';

const UniversalAdd = ({ item }: { item: Product; }) => {
  const count = useCartStore((state) => state.getItemCount(item._id as string));
  const { addItem, removeItem } = useCartStore();

  return (
    <View style={[styles.container, { backgroundColor: count === 0 ? 'white' : Colors.secondary }]}>
      {
        count === 0 ? (
          <Pressable onPress={() => addItem(item)} style={styles.add}>
            <CustomText variant='h6' style={styles.addText}>Add</CustomText>
          </Pressable>
        ) : (
          <View style={styles.counterContainer}>
            <Pressable onPress={() => removeItem(item._id as string)}>
              <Icon name='minus' color='white' size={RFValue(13)} />
            </Pressable>
            <CustomText style={styles.text} variant='h6'> {count}</CustomText>
            <Pressable onPress={() => addItem(item)}>
              <Icon name='plus' color='white' size={RFValue(13)} />
            </Pressable>
          </View>
        )
      }
    </View>
  );
};

export default UniversalAdd;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    width: 65,
    marginLeft: 4
  },
  add: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    padding: 6,
  },
  addText: {
    fontWeight: 500,
    color: Colors.secondary
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 6,
  },
  text: {
    color: 'white'
  }
});