import axios from "axios";
import { getBaseURL } from "./config";
import { tokenStorage } from "@state/storage";
import { refresh_tokens } from "./authService";
import { Alert } from "react-native";

// Create Axios instance using the initialized BASE_URL
export const appAxios = axios.create({
  baseURL: getBaseURL(), // Get the initialized BASE_URL
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem('token')}`,
//   },
});

// Add request interceptor
appAxios.interceptors.request.use(async (config) => {
  const accessToken = tokenStorage.getString("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Add response interceptor
appAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      try {
        const newAccessToken = await refresh_tokens();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.log("Refresh token error:", refreshError);
      }
    }

    if (error.response && error.response.status !== 401) {
      const errorMessage = error.response.data.message || "Something went wrong";
      Alert.alert(errorMessage);
    }

    return Promise.resolve(error);
  }
);

