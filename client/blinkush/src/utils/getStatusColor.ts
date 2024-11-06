import { Status } from "types/types";

export const getStatusColor = (status: Status) => {
    switch (status.toLowerCase()) {
        case 'available':
            return '#28a745';
        case 'confirmed':
            return '#007bff';
        case 'delivered':
            return '#17a2b8';
        case 'cancelled':
            return '#dc3545';
        default: 
        return '#6c757d'
    }
};