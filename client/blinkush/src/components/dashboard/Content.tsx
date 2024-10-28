import { StyleSheet, View } from 'react-native';
import React from 'react';
import AdCarousel from './AdCarousel';
import { adData, categories } from '@utils/dummyData';
import CustomText from '@components/ui/CustomText';
import CategoryContainer from './CategoryContainer';

const Content = () => {
  return (
    <View style={styles.container}>
      <AdCarousel adData={adData} />
      <CustomText variant='h3' style={{fontWeight: 500}}> Grocery & Kitchen </CustomText>
      <CategoryContainer data={categories}/>
      <CustomText variant='h3' style={{fontWeight: 500}}> Bestsellers </CustomText>
      <CategoryContainer data={categories}/>
      <CustomText variant='h3' style={{fontWeight: 500}}> Snacks & Drinks </CustomText>
      <CategoryContainer data={categories}/>
      <CustomText variant='h3' style={{fontWeight: 500}}> Home & Lifestyle</CustomText>
      <CategoryContainer data={categories}/>
    </View>
  );
};

export default Content;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  }
});