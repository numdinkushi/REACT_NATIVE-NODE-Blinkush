import axios from "axios";
import { BASE_URL } from "./config";
import { tokenStorage } from "@state/storage";
import { refresh_tokens } from "./authService";
import { Alert } from "react-native";

export const appAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});

appAxios.interceptors.request.use(async config => {
    const accessToken = tokenStorage.getString('access_token');

    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
});

appAxios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            try {
                const newAccessToken = await refresh_tokens();
                if (newAccessToken) {
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;

                    return axios(error.config);
                }
            } catch (error) {
                console.log('Refresh token error:');
            };
        }

        if (error.response && error.response.statusCode !== 401) {
            const errorMessage = error.response.data.message || 'Something went wrong';
            Alert.alert(errorMessage);
        }

        return Promise.resolve(error);
    });