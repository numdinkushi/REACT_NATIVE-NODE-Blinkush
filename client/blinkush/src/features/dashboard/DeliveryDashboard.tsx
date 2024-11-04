import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '@utils/Constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@state/authStorage';
import DeliveryHeader from '@components/delivery/DeliveryHeader';
import TabBar from '@components/delivery/TabBar';
import { FlatList } from 'react-native';
import { fetchOrders } from 'service/orderService';
import { RefreshControl } from 'react-native-gesture-handler';
import CustomText from '@components/ui/CustomText';
import { Order } from 'types/types';
import OrderItem from '@components/delivery/OrderItem';

const DeliveryDashboard = () => {
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState<'available' | 'delivered'>('available');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const renderOrderItem = ({ item, index }: { item: Order, index: number; }) => {
    return (
    <OrderItem index={index} item={item} />
  );
};


const fetchData = async () => {
  if (!user?._id || !user?.branch) return;

  setData([]);
  setRefreshing(true);
  setLoading(true);
  const data = await fetchOrders(selectedTab, user?._id, user?.branch);
  setData(data);
  setRefreshing(false);
  setLoading(false);
};

useEffect(() => {
  fetchData();
}, [selectedTab]);

return (
  <View style={styles.container}>
    <SafeAreaView>
      <DeliveryHeader name={user?.name as string} email={user?.email as string} />
    </SafeAreaView>
    <View style={styles.subContainer}>
      <TabBar selectedTab={selectedTab} onTabChange={setSelectedTab} />
      <FlatList
        data={data}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchData}
          />
        }
        ListEmptyComponent={() => {
          if (loading) {
            return (
              <View style={styles.center}>
                <ActivityIndicator color={Colors.secondary} size='small' />
              </View>
            );
          }

          return (
            <View style={styles.center}>
              <CustomText style={{ color: Colors.text }}>No orders found</CustomText>
            </View>
          );
        }}

        renderItem={renderOrderItem}
        keyExtractor={(item) => item.orderId}
        contentContainerStyle={styles.flexListContainer}
      />
    </View>
  </View>
);
};

export default DeliveryDashboard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  subContainer: {
    backgroundColor: Colors.backgroundSecondary,
    flex: 1,
    padding: 6
  },
  flexListContainer: {
    padding: 2
  },
  center: {
    flex: 1,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

