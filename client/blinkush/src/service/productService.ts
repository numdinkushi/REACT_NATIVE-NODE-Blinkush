import axios from "axios";
import { appAxios } from "./apiInterceptors";
import { getBaseURL } from "./config";

const baseURL = getBaseURL();

export const getAllCategories = async () => {
    try {
        const response = await axios.get(`${baseURL}/categories`);

        return response.data;
    } catch (error) {
        console.log('fetch Category error: ' + error);
        console.log(error);

        return [];
    }
};

export const getProductsByCategoryId = async (id: string) => {
    try {
        const response = await appAxios.get(`${baseURL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.log('fetch Category error: ' + error);

        return [];
    }
};
