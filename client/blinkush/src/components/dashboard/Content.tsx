import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AdCarousel from './AdCarousel';
import { adData } from '@utils/dummyData';

const Content = () => {
  return (
    <View style={styles.container}>
      <AdCarousel adData={adData} />
    </View>
  );
};

export default Content;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  }
});