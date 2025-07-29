import { StyleSheet, View, Animated as RNAnimated, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect, useRef } from 'react';
import NoticeAnimation from './NoticeAnimation';
import { NoticeHeight, screenHeight } from '@utils/scaling';
import Visuals from './Visuals';
import { CollapsibleContainer, CollapsibleHeaderContainer, CollapsibleScrollView, useCollapsibleContext, withCollapsibleContext } from '@r0b0t3d/react-native-collapsible';
import AnimatedHeader from './AnimatedHeader';
import StickySearchBar from './StickySearchBar';
import Content from '@components/dashboard/Content';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '@utils/Constants';
import { useTheme } from '@utils/ThemeContext';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import withCart from '@features/cart/WithCart';
import withLiveStatus from '@features/map/withLiveStatus';

const NOTICE_HEIGHT = -(NoticeHeight + 15);

const ProductDashboard = () => {
  const { scrollY, expand } = useCollapsibleContext();
  const { theme } = useTheme();
  const previousScroll = useRef<number>(0);

  const backToTopStyle = useAnimatedStyle(() => {
    const isScrollingUp = scrollY.value < previousScroll.current && scrollY.value > 180;
    const opacity = withTiming(isScrollingUp ? 1 : 0, { duration: 300 });
    const translateY = withTiming(isScrollingUp ? 0 : 10, { duration: 300 });

    previousScroll.current = scrollY.value;

    return {
      opacity,
      transform: [{ translateY }],
    };

  });

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
        <Animated.View style={[styles.backToTopButton, backToTopStyle]}>
          <TouchableOpacity
            onPress={() => {
              scrollY.value = 0;
              expand();
            }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name='arrow-up-circle-outline' color='white' size={RFValue(12)} />
            <CustomText variant='h7' style={{ color: 'white' }} fontFamily={Fonts.SemiBold}>
              Back to top
            </CustomText>
          </TouchableOpacity>
        </Animated.View>

        <CollapsibleContainer style={[styles.panelContainer, { backgroundColor: theme.background }]}>
          <CollapsibleHeaderContainer containerStyle={styles.transparent}>
            <AnimatedHeader
              showNotice={showNotice}
            />
            <StickySearchBar />
          </CollapsibleHeaderContainer>
          <CollapsibleScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            style={[styles.container, { backgroundColor: theme.background }]}
          >
            <Content />
            <View style={{ backgroundColor: theme.background, padding: 100 }} />
          </CollapsibleScrollView>
        </CollapsibleContainer>
      </>
    </NoticeAnimation>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  panelContainer: {
    flex: 1,
  },
  backToTopButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: Platform.OS === 'ios' ? screenHeight * 0.18 : screenHeight * 0.24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 999,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});

export default withLiveStatus(withCart(withCollapsibleContext(ProductDashboard)));