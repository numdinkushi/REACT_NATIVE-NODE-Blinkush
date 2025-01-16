import axios from "axios";
import { tokenStorage } from "@state/storage";
import { useAuthStore } from "@state/authStorage";
import { resetAndNavigate } from "@utils/navigation-utils";
import { appAxios } from "./apiInterceptors";
import { getBaseURL } from "./config";
import { User } from "types/types";
const baseURL = getBaseURL();

export const deliveryLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${baseURL}/delivery/login`, { email, password },);
        const { accessToken, refreshToken, deliveryPartner } = response.data;
        tokenStorage.set('accessToken', accessToken);
        tokenStorage.set('refreshToken', refreshToken);
        const { setUser } = useAuthStore.getState();
        setUser(deliveryPartner);

        return response;
    } catch (error) {
        console.log('deliveryLogin error: ' + error);
    }
};

export const customerLogin = async (phone: string) => {
    try {
        const response = await appAxios.post(`/customer/login`, { phone });
        const { accessToken, refreshToken, customer } = response.data;
        tokenStorage.set('accessToken', accessToken);
        tokenStorage.set('refreshToken', refreshToken);
        const { setUser } = useAuthStore.getState();
        setUser(customer);

        return response;
    } catch (error) {
        console.log('customerLogin error: ' + error);
    }
};

export const refetchUser = async (setUser: (user: User) => void) => {
    try {
        const response = await appAxios.get(`/user`,);

        setUser(response.data.user);

        // return response;
    } catch (error) {
        console.log('refetchUser error: ' + error);
    }
};

export const updateUserLocation = async (data: any, setUser: (user: User) => void) => {
    try {
        const response = await appAxios.patch(`/user`, data);

        refetchUser(setUser);
    } catch (error) {
        console.log('updateUserLocation error: ' + error);
    }
};

export const refresh_tokens = async () => {
    const baseURL = getBaseURL();
    try {
        const refreshToken = tokenStorage.getString('refreshToken');
        const response = await axios.post(`${baseURL}/refresh-token`, { refreshToken },);
        const new_access_token = response.data.accessToken;
        const new_refresh_token = response.data.accessToken;

        tokenStorage.set('accessToken', new_access_token);
        tokenStorage.set('refreshToken', new_refresh_token);

        return new_access_token;
    } catch (error) {
        console.log('REFRESH-TOKEN-ERROR: ' + error);
        tokenStorage.clearAll();
        resetAndNavigate('CustomerLogin');
    }
}; 