import { Product } from "@utils/dummyData";

export interface Location {
    latitude: number;
    longitude: number;
}

export interface Branch {
    __v: number;
    _id: string;
    address: string;
    deliveryPartners: string[];
    location: Location;
    name: string;
}

export interface User {
    __v: number;
    _id: string;
    address: string;
    isActivated: boolean;
    liveLocation: Location;
    name: string;
    phone: number;
    role: "Customer" | "DeliveryPartner";
}

export interface Item {
    _id: string;
    count: number;
    id: string;
    item: Product;
}

export interface DeliveryLocation extends Location {
    address: string;
}

export interface Order {
    __v: number;
    _id: string;
    branch: Branch;
    createdAt: string;
    customer: User;
    deliveryPartner: User;
    deliveryLocation: DeliveryLocation;
    deliveryPersonLocation: Location;
    items: Item[];
    orderId: string;
    pickupLocation: DeliveryLocation;
    status: string;
    totalPrice: number;
    updatedAt: string;
}
