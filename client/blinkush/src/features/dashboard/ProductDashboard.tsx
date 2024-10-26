import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useAuthStore } from '@state/authStorage';

const ProductDashboard = () => {
  const { user } = useAuthStore();
  
  return (
    <View>
      <Text>ProductDashboard</Text>
    </View>
  );
};

export default ProductDashboard;

const styles = StyleSheet.create({});