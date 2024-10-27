import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { resetAndNavigate } from '@utils/navigation-utils';
import { deliveryLogin } from 'service/authService';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import { screenHeight } from '@utils/scaling';
import { lottie } from 'constants/files/filesConstants';
import LottieView from "lottie-react-native";
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import CustomInput from '@components/ui/CustomInput';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '@components/ui/CustomButton';

const DeliveryLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await deliveryLogin(email, password);
      resetAndNavigate('DeliveryDashboard');
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };
  return (
    <CustomSafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='on-drag'
      >
        <View style={styles.container}>
          <View style={styles.lottieContainer}>
            <LottieView autoPlay loop style={styles.lottie} source={lottie} />
          </View>
          <CustomText variant='h3' fontFamily={Fonts.Bold} style={{ fontSize: 25, fontWeight: '700' }}>
            Delivery Partner Portal
          </CustomText>
          <CustomText variant='h6' fontFamily={Fonts.SemiBold} style={styles.text}  >
            Faster than flash ⚡
          </CustomText>
          <CustomInput
            onChangeText={setEmail}
            value={email}
            left={<Icon
              name='mail'
              color='#f8890e'
              style={{ marginLeft: 10 }}
              size={RFValue(18)}
            />}
            placeholder='Email'
            inputMode='email'
            right={false}
          />
          <CustomInput
            onChangeText={setPassword}
            value={password}
            left={<Icon
              name='key-sharp'
              color='#f8890e'
              style={{ marginLeft: 10 }}
              size={RFValue(18)}
            />}
            placeholder='Password'
            secureTextEntry
            right={false}
          />

          <CustomButton
            title='Login'
            onPress={handleLogin}
            disabled={email.length === 0 || password.length < 8}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

export default DeliveryLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  lottie: {
    height: '100%',
    width: '100%',
  },
  lottieContainer: {
    height: screenHeight * 0.12,
    width: '100%'
  },
  text: {
    marginTop: 20,
    marginBottom: 25,
    opacity: 0.8,
  }
});