import { StyleSheet, Text, View, Animated as RNAnimated, SafeAreaView } from 'react-native';
import React, { useEffect, useRef } from 'react';
import NoticeAnimation from './NoticeAnimation';
import { NoticeHeight } from '@utils/scaling';
import Visuals from './Visuals';
import { CollapsibleContainer, CollapsibleHeaderContainer, CollapsibleScrollView, withCollapsibleContext } from '@r0b0t3d/react-native-collapsible';
import AnimatedHeader from './AnimatedHeader';
import StickySearchBar from './StickySearchBar';
import Content from '@components/dashboard/Content';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '@utils/Constants';

const NOTICE_HEIGHT = -(NoticeHeight + 15);

const ProductDashboard = () => {
  const noticePosition = useRef(new RNAnimated.Value(NOTICE_HEIGHT)).current;

  const slideUp = () => {
    RNAnimated.timing(noticePosition, {
      toValue: NOTICE_HEIGHT,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  };

  const slideDown = () => {
    RNAnimated.timing(noticePosition, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: false,
    }).start();;
  };

  useEffect(() => {
    slideDown();
    const timeout = setTimeout(() => {
      slideUp();
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  const showNotice = () => {
    slideDown();
    const timeoutId = setTimeout(() => {
      slideUp();
    }, 3500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <NoticeAnimation noticePosition={noticePosition}>
      <>
        <Visuals />
        <SafeAreaView />
        <CollapsibleContainer style={styles.panelContainer}>
          <CollapsibleHeaderContainer containerStyle={styles.transparent}>
            <AnimatedHeader
              showNotice={showNotice}
            />
            <StickySearchBar />
          </CollapsibleHeaderContainer>
          <CollapsibleScrollView
            nestedScrollEnabled
            style={styles.panelContainer}
            showsVerticalScrollIndicator={false}>
            <Content />
            <View style={{ backgroundColor: '#f8f8f8', padding: 20 }}>
              <CustomText
                fontSize={RFValue(42)}
                style={{ opacity: 0.2, fontWeight: 'bold' }}>
                India's last minute app 🥭
              </CustomText>
              <CustomText
                style={{ marginTop: 10, paddingBottom: 100, opacity: 0.2, fontWeight: 'bold' }}>
                Developed by ❤️ Kushi Numdin
              </CustomText>
            </View>
          </CollapsibleScrollView>
        </CollapsibleContainer>
      </>
    </NoticeAnimation>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1
  },
  transparent: {
    backgroundColor: 'transparent',
  }
});

export default withCollapsibleContext(ProductDashboard);