// OrderTracking.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomHeader from '@components/ui/CustomHeader';
import { Colors, Fonts } from '@utils/Constants';
import { navigate } from '@utils/navigation-utils';
import OrderInfo from './components/OrderInfo';
import EstimatedTime from './components/EstimatedTime';
import ProgressBar from './components/ProgressBar';
import OrderStatusList from './components/OrderStatusList';
import DeliveryPersonCard from './components/DeliveryPersonCard';
import OrderItems from './components/OrderItems';
import DeliveryAddress from './components/DeliveryAddress';
import ActionButtons from './components/ActionButtons';
import LoadingState from './components/LoadingState';
import { fetchOrderDetails } from './services/orderService';
import type { Order, DeliveryPerson, OrderStatus } from './types';

const { width } = Dimensions.get('window');

interface OrderTrackingProps {
  route: {
    params: {
      orderId: string;
    };
  };
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson | null>(null);
  const [estimatedTime] = useState('25-30 min');

  useEffect(() => {
    const loadOrderDetails = async () => {
      const { orderData, deliveryPersonData } = await fetchOrderDetails(orderId);
      setOrder(orderData);
      setDeliveryPerson(deliveryPersonData);
    };

    loadOrderDetails();
  }, [orderId]);

  if (!order) {
    return <LoadingState />;
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Order Tracking" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <OrderInfo orderId={orderId} orderTime={order.orderTime} />
        <EstimatedTime estimatedTime={estimatedTime} />
        <ProgressBar progress={0.75} />
        <OrderStatusList />
        {deliveryPerson && (
          <DeliveryPersonCard
            deliveryPerson={deliveryPerson}
            onCall={handleCallDelivery}
            onTrack={handleTrackOnMap}
          />
        )}
        <OrderItems items={order.items} total={order.total} />
        <DeliveryAddress address={order.deliveryAddress} />
      </ScrollView>
      <ActionButtons onViewOrders={() => navigate('OrderHistory')} onTrack={handleTrackOnMap} />
    </View>
  );

  function handleCallDelivery() {
    if (deliveryPerson) {
      console.log('Calling delivery person:', deliveryPerson.phone);
    }
  }

  function handleTrackOnMap() {
    navigate('DeliveryMap', { orderId });
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
});

export default OrderTracking;

// types.ts
export interface Order {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  deliveryAddress: string;
  orderTime: string;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  rating: number;
  avatar: string;
}

export interface OrderStatus {
  id: string;
  label: string;
  time: string;
  completed: boolean;
  active: boolean;
  icon: string;
}

// services/orderService.ts
import type { Order, DeliveryPerson } from '../types';

export const fetchOrderDetails = async (orderId: string) => {
  try {
    // Mock API call - replace with actual service
    const orderData: Order = {
      id: orderId,
      items: [
        { name: 'Margherita Pizza', quantity: 2, price: 12.99 },
        { name: 'Caesar Salad', quantity: 1, price: 8.99 },
      ],
      total: 34.97,
      deliveryAddress: '123 Main St, Apartment 4B, New York, NY 10001',
      orderTime: new Date().toISOString(),
    };

    const deliveryPersonData: DeliveryPerson = {
      id: '1',
      name: 'John Doe',
      phone: '+1-234-567-8900',
      rating: 4.8,
      avatar: 'https://example.com/avatar.jpg',
    };

    return { orderData, deliveryPersonData };
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// components/OrderInfo.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';
import { formatIsoToCustom } from '@utils/dateUtils';

interface OrderInfoProps {
  orderId: string;
  orderTime: string;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ orderId, orderTime }) => (
  <View style={styles.container}>
    <CustomText variant="h5" fontFamily={Fonts.Medium}>
      Order #{orderId}
    </CustomText>
    <CustomText variant="h7" style={styles.orderTime}>
      Placed at {formatIsoToCustom(orderTime)}
    </CustomText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderTime: {
    color: Colors.text,
    marginTop: 4,
  },
});

export default OrderInfo;

// components/EstimatedTime.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';

interface EstimatedTimeProps {
  estimatedTime: string;
}

const EstimatedTime: React.FC<EstimatedTimeProps> = ({ estimatedTime }) => (
  <View style={styles.container}>
    <View style={styles.icon}>
      <Icon name="clock-outline" size={24} color={Colors.primary} />
    </View>
    <View style={styles.content}>
      <CustomText variant="h6" fontFamily={Fonts.Medium}>
        Estimated Delivery Time
      </CustomText>
      <CustomText variant="h5" fontFamily={Fonts.Medium} style={styles.time}>
        {estimatedTime}
      </CustomText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.primary + '10',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  icon: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  time: {
    color: Colors.primary,
    marginTop: 4,
  },
});

export default EstimatedTime;

// components/ProgressBar.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '@utils/Constants';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const progressAnimation = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default ProgressBar;

// components/OrderStatusList.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';
import type { OrderStatus } from '../types';

const ORDER_STATUSES: OrderStatus[] = [
  { id: '1', label: 'Order Placed', time: '2:30 PM', completed: true, active: false, icon: 'check-circle' },
  { id: '2', label: 'Order Confirmed', time: '2:32 PM', completed: true, active: false, icon: 'check-circle' },
  { id: '3', label: 'Preparing', time: '2:35 PM', completed: true, active: false, icon: 'chef-hat' },
  { id: '4', label: 'Out for Delivery', time: '3:00 PM', completed: false, active: true, icon: 'bike' },
  { id: '5', label: 'Delivered', time: '', completed: false, active: false, icon: 'check-circle' },
];

const OrderStatusList: React.FC = () => {
  const renderStatusItem = (status: OrderStatus, index: number) => {
    const isLast = index === ORDER_STATUSES.length - 1;

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
            style={[styles.statusLabel, status.active && styles.activeLabel]}
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

  return (
    <View style={styles.container}>
      <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
        Order Status
      </CustomText>
      {ORDER_STATUSES.map(renderStatusItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
   atica
  },
  statusTime: {
    color: Colors.text,
  },
});

export default OrderStatusList;

// components/DeliveryPersonCard.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';
import type { DeliveryPerson } from '../types';

interface DeliveryPersonCardProps {
  deliveryPerson: DeliveryPerson;
  onCall: () => void;
  onTrack: () => void;
}

const DeliveryPersonCard: React.FC<DeliveryPersonCardProps> = ({
  deliveryPerson,
  onCall,
  onTrack,
}) => (
  <View style={styles.container}>
    <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
      Delivery Person
    </CustomText>
    <View style={styles.card}>
      <View style={styles.info}>
        <View style={styles.avatar}>
          <Icon name="account" size={30} color={Colors.primary} />
        </View>
        <View style={styles.details}>
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
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onCall}>
          <Icon name="phone" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onTrack}>
          <Icon name="map-marker" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 1616,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
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
  actions: {
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
});

export default DeliveryPersonCard;

// components/OrderItems.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';

interface OrderItemsProps {
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
}

const OrderItems: React.FC<OrderItemsProps> = ({ items, total }) => (
  <View style={styles.container}>
    <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
      Order Items
    </CustomText>
    {items.map((item, index) => (
      <View key={index} style={styles.item}>
        <CustomText variant="h7">
          {item.quantity}x {item.name}
        </CustomText>
        <CustomText variant="h7">
          ${(item.price * item.quantity).toFixed(2)}
        </CustomText>
      </View>
    ))}
    <View style={styles.total}>
      <CustomText variant="h6" fontFamily={Fonts.Medium}>
        Total: ${total.toFixed(2)}
      </CustomText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  total: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    marginTop: 8,
    alignItems: 'flex-end',
  },
});

export default OrderItems;

// components/DeliveryAddress.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';

interface DeliveryAddressProps {
  address: string;
}

const DeliveryAddress: React.FC<DeliveryAddressProps> = ({ address }) => (
  <View style={styles.container}>
    <CustomText variant="h6" fontFamily={Fonts.Medium} style={styles.sectionTitle}>
      Delivery Address
    </CustomText>
    <View style={styles.card}>
      <Icon name="map-marker" size={20} color={Colors.primary} />
      <CustomText variant="h7" style={styles.addressText}>
        {address}
      </CustomText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  card: {
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
});

export default DeliveryAddress;

// components/ActionButtons.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from '@components/ui/CustomText';
import { Colors, Fonts } from '@utils/Constants';

interface ActionButtonsProps {
  onViewOrders: () => void;
  onTrack: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onViewOrders, onTrack }) => (
  <View style={styles.container}>
    <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onViewOrders}>
      <CustomText variant="h6" style={styles.secondaryButtonText}>
        View All Orders
      </CustomText>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onTrack}>
      <CustomText variant="h6" style={styles.primaryButtonText}>
        Track on Map
      </CustomText>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  button: {
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

export default ActionButtons;

// components/LoadingState.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '@components/ui/CustomText';
import { Colors } from '@utils/Constants';

const LoadingState: React.FC = () => (
  <View style={styles.container}>
    <Icon name="loading" size={40} color={Colors.primary} />
    <CustomText variant="h6" style={styles.text}>
      Loading order details...
    </CustomText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    color: Colors.text,
  },
});

export default LoadingState;