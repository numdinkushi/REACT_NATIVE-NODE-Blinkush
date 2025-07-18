import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '@components/ui/CustomText';
import CustomHeader from '@components/ui/CustomHeader';
import { Colors, Fonts } from '@utils/Constants';
import { navigate } from '@utils/navigation-utils';
import { formatIsoToCustom } from '@utils/dateUtils';

const { width } = Dimensions.get('window');

interface OrderStatus {
  id: string;
  label: string;
  time: string;
  completed: boolean;
  active: boolean;
  icon: string;
}

interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  rating: number;
  avatar: string;
}

interface OrderTrackingProps {
  route: {
    params: {
      orderId: string;
    };
  };
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson | null>(null);
  const [estimatedTime, setEstimatedTime] = useState('25-30 min');
  const [progressAnimation] = useState(new Animated.Value(0));

  const orderStatuses: OrderStatus[] = [
    {
      id: '1',
      label: 'Order Placed',
      time: '2:30 PM',
      completed: true,
      active: false,
      icon: 'check-circle',
    },
    {
      id: '2',
      label: 'Order Confirmed',
      time: '2:32 PM',
      completed: true,
      active: false,
      icon: 'check-circle',
    },
    {
      id: '3',
      label: 'Preparing',
      time: '2:35 PM',
      completed: true,
      active: false,
      icon: 'chef-hat',
    },
    {
      id: '4',
      label: 'Out for Delivery',
      time: '3:00 PM',
      completed: false,
      active: true,
      icon: 'bike',
    },
    {
      id: '5',
      label: 'Delivered',
      time: '',
      completed: false,
      active: false,
      icon: 'check-circle',
    },
  ];

  useEffect(() => {
    fetchOrderDetails();
    startProgressAnimation();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      // Mock API call - replace with actual service
      const mockOrder = {
        id: orderId,
        items: [
          { name: 'Margherita Pizza', quantity: 2, price: 12.99 },
          { name: 'Caesar Salad', quantity: 1, price: 8.99 },
        ],
        total: 34.97,
        deliveryAddress: '123 Main St, Apartment 4B, New York, NY 10001',
        orderTime: new Date().toISOString(),
      };

      const mockDeliveryPerson: DeliveryPerson = {
        id: '1',
        name: 'John Doe',
        phone: '+1-234-567-8900',
        rating: 4.8,
        avatar: 'https://example.com/avatar.jpg',
      };

      setOrder(mockOrder);
      setDeliveryPerson(mockDeliveryPerson);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const startProgressAnimation = () => {
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  };

  const handleCallDelivery = () => {
    if (deliveryPerson) {
      // Handle phone call
      console.log('Calling delivery person:', deliveryPerson.phone);
    }
  };

  const handleTrackOnMap = () => {
    navigate('DeliveryMap', { orderId });
  };

  const renderStatusItem = (status: OrderStatus, index: number) => {
    const isLast = index === orderStatuses.length - 1;
    
    return (
      <View key={status.id} style={styles.statusItem}>
        <View style={styles.statusIconContainer}>
          <View style={[
            styles.statusIcon,
            status.completed && styles.completedIcon,
            status.active && styles.activeIcon,
          ]}>
            <Icon
              name={status.icon}
              size={16}
              color={status.completed || status.active ? 'white' : Colors.border}
            />
          </View>
          {!isLast && (
            <View style={[
              styles.statusLine,
              status.completed && styles.completedLine,
            ]} />
          )}
        </View>
        <View style={styles.statusContent}>
          <CustomText
            variant="h6"
            fontFamily={status.active ? Fonts.Medium : Fonts.Regular}
            style={[
              styles.statusLabel,
              status.active && styles.activeLabel,
            ]}
          >
            {status.label}
          </CustomText>
          {status.time && (
            <CustomText variant="h8" style={styles.statusTime}>
              {status.time}
            </CustomText>
          )}
        </View>
      </View>
    );
  };

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="loading" size={40} color={Colors.primary} />
        <CustomText variant="h6" style={styles.loadingText}>
          Loading order details...
        </CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Order Tracking" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Info */}
        <View style={styles.orderInfo}>
          <CustomText variant="h5" fontFamily={Fonts.Medium}>
            Order #{orderId}
          </CustomText>
          <CustomText variant="h7" style={styles.orderTime}>
            Placed at {formatIsoToCustom(order.orderTime)}
          </CustomText>
        </View>

        {/* Estimated Time */}
        <View style={styles.estimatedTimeContainer}>
          <View style={styles.estimatedTimeIcon}>
            <Icon name="clock-outline" size={24} color={Colors.primary} />
          </View>
          <View style={styles.estimatedTimeContent}>
            <CustomText variant="h6" fontFamily={Fonts.Medium}>
              Estimated Delivery Time
            </CustomText>
            <CustomText variant="h5" fontFamily={Fonts.Medium} style={styles.estimatedTime}>
              {estimatedTime}
            </CustomText>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '75%'],
                }),
              },
            ]}
          />
        </View>

        {/* Order Status */}
        <View style={styles.statusContainer}>
          <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
            Order Status
          </CustomText>
          {orderStatuses.map(renderStatusItem)}
        </View>

        {/* Delivery Person */}
        {deliveryPerson && (
          <View style={styles.deliveryPersonContainer}>
            <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
              Delivery Person
            </CustomText>
            <View style={styles.deliveryPersonCard}>
              <View style={styles.deliveryPersonInfo}>
                <View style={styles.deliveryPersonAvatar}>
                  <Icon name="account" size={30} color={Colors.primary} />
                </View>
                <View style={styles.deliveryPersonDetails}>
                  <CustomText variant="h6" fontFamily={Fonts.Medium}>
                    {deliveryPerson.name}
                  </CustomText>
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={14} color={Colors.warning} />
                    <CustomText variant="h8" style={styles.ratingText}>
                      {deliveryPerson.rating}
                    </CustomText>
                  </View>
                </View>
              </View>
              <View style={styles.deliveryPersonActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleCallDelivery}
                >
                  <Icon name="phone" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleTrackOnMap}
                >
                  <Icon name="map-marker" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Order Items */}
        <View style={styles.orderItemsContainer}>
          <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
            Order Items
          </CustomText>
          {order.items.map((item: any, index: number) => (
            <View key={index} style={styles.orderItem}>
              <CustomText variant="h7">
                {item.quantity}x {item.name}
              </CustomText>
              <CustomText variant="h7">
                ${(item.price * item.quantity).toFixed(2)}
              </CustomText>
            </View>
          ))}
          <View style={styles.orderTotal}>
            <CustomText variant="h6" fontFamily={Fonts.Medium}>
              Total: ${order.total.toFixed(2)}
            </CustomText>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.addressContainer}>
          <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
            Delivery Address
          </CustomText>
          <View style={styles.addressCard}>
            <Icon name="map-marker" size={20} color={Colors.primary} />
            <CustomText variant="h7" style={styles.addressText}>
              {order.deliveryAddress}
            </CustomText>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.bottomButton, styles.secondaryButton]}
          onPress={() => navigate('OrderHistory')}
        >
          <CustomText variant="h6" style={styles.secondaryButtonText}>
            View All Orders
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomButton, styles.primaryButton]}
          onPress={handleTrackOnMap}
        >
          <CustomText variant="h6" style={styles.primaryButtonText}>
            Track on Map
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderTracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: Colors.text,
  },
  orderInfo: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderTime: {
    color: Colors.text,
    marginTop: 4,
  },
  estimatedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.primary + '10',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  estimatedTimeIcon: {
    marginRight: 12,
  },
  estimatedTimeContent: {
    flex: 1,
  },
  estimatedTime: {
    color: Colors.primary,
    marginTop: 4,
  },
  progressContainer: {
    height: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  statusContainer: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIcon: {
    backgroundColor: Colors.success,
  },
  activeIcon: {
    backgroundColor: Colors.primary,
  },
  statusLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  completedLine: {
    backgroundColor: Colors.success,
  },
  statusContent: {
    flex: 1,
    justifyContent: 'center',
  },
  statusLabel: {
    marginBottom: 2,
  },
  activeLabel: {
    color: Colors.primary,
  },
  statusTime: {
    color: Colors.text,
  },
  deliveryPersonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  deliveryPersonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  deliveryPersonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deliveryPersonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deliveryPersonDetails: {
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: Colors.text,
  },
  deliveryPersonActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  orderItemsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    marginTop: 8,
    alignItems: 'flex-end',
  },
  addressContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  addressText: {
    marginLeft: 12,
    flex: 1,
    color: Colors.text,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  primaryButtonText: {
    color: 'white',
    fontFamily: Fonts.Medium,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontFamily: Fonts.Medium,
  },
});