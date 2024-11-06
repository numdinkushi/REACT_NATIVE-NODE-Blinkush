import { Product } from "@utils/dummyData";
import { appAxios } from "./apiInterceptors";
import { Location, Status } from "types/types";

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
    let params = {};

    if (status === 'available') {
        params = { status, branchId };
    } else if (status === 'delivered') {
        params = { branchId, deliveryPartnerId: userId, status };
    }

    try {
        const response = await appAxios.get(uri, { params });

        // console.log(991, response);
        return response.data;
    } catch (error) {
        console.log('Fetch delivery order error ', error);

        return null;
    }
};

export const sendLiveOrderUpdates = async (id: string, location: Location, status: Status) => {
    if (!id) return;

    const params = {
        deliveryPersonLocation: location,
        status
    };

    try {
        const response = await appAxios.patch(`/order/${id}/status`, params);

        return response.data;
    } catch (error) {
        console.log('send LiveOrder Updates order by Id error ', error);

        return null;
    }
};

export const confirmOrder = async (id: string, location: Location) => {
    if (!id) return;

    const params = {
        deliveryPersonLocation: location,
    };

    try {
        const response = await appAxios.post(`/order/${id}/confirm`, params);

        return response.data;
    } catch (error) {
        console.log('Confirm order error ', error);

        return null;
    }
};