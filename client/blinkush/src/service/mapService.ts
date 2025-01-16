import { Location, User } from "types/types";
import { appAxios } from "./apiInterceptors";
import { googleAPIEndPoint } from "constants/files/filesConstants";
import { GOOGLE_MAP_API } from "./config";
import { updateUserLocation } from "./authService";

export const reverseGeoCode = async (latitude: number, longitude: number, setUser: (user: User) => void) => {
    console.log(24111);
    try {
        const response = await appAxios.get(`${googleAPIEndPoint}?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API}`);

        if (response.data.status == 'OK') {
            const address = response.data.results[0].formatted_address;
            console.log(344, response.data);
            updateUserLocation({ liveLocation: { latitude, longitude }, address }, setUser);
        } else {
            console.error('Geo code failed', response.data);
        }

        return response.data;
    } catch (error) {
        console.log('send LiveOrder Updates order by Id error ', error);

        return null;
    }
};