import axios from "axios";
import { BASE_URL } from "./config";
import { tokenStorage } from "@state/storage";
import { useAuthStore } from "@state/authStorage";
import { resetAndNavigate } from "@utils/navigation-utils";
import { appAxios } from "./apiInterceptors";

export const customerLogin = async (phone: string) => {
    const baseURL = await BASE_URL;
    try {
        const response = await axios.post(
            `${baseURL}/customer/login`,
            { phone },
        );
        const { accessToken, refreshToken, customer } = response.data;
        tokenStorage.set('accessToken', accessToken);
        tokenStorage.set('refreshToken', refreshToken);
        const { setUser } = useAuthStore.getState();
        setUser(customer);

        return response;
    } catch (error) {
        console.log('Login error: ' + error);
    }
};

export const refetchUser = async (setUser: any) => {
    // const baseURL = await BASE_URL;
    try {
        const response = await appAxios.get(`/user`,);

        setUser(response.data.user);

        // return response;
    } catch (error) {
        console.log('Login error: ' + error);
    }
};

export const refresh_tokens = async () => {
    const baseURL = await BASE_URL;
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