import { Product } from "@utils/dummyData";
import { appAxios } from "./apiInterceptors";

interface CreateOrderData {
    id: string | number;
    item: Product;
    count: number;
}

export const createOrder = async (items: CreateOrderData[], totalPrice: number) => {
    try {
        const response = await appAxios.post(`/order`, {
            items: items,
            branch: '671259ac8356d784d3cc75b5',
            totalPrice: totalPrice,
        });

        return response.data;
    } catch (error) {
        console.log('Create order error: ' + error);

        return null;
    }
};

export const getOrderById = async (id: string) => {
    if (!id) return;
    try {
        const response = await appAxios.post(`/order/${id}`);

        return response.data;
    } catch (error) {
        console.log('Fetch order by Id error ', error);

        return null;
    }
};

export const fetchCustomerOrders = async (userId: string) => {
    if (!userId) return;
    try {
        const response = await appAxios.get(`/order`, { params: { customerId: userId } });

        return response.data;
    } catch (error) {
        console.log('Fetch customer order by Id error ', error);

        return null;
    }
};

export const fetchOrders = async (status: string, userId: string, branchId: string) => {
    if (!userId) return;

    let uri = '/order';
    let params = status === 'available' ? { status, branchId } : { branchId, deliveryPartnerId: userId, status: 'delivered' };

    try {
        const response = await appAxios.get(uri, { params });

        return response.data;
    } catch (error) {
        console.log('Fetch delivery order error ', error);

        return null;
    }
};
