// Utility function to calculate distance in kilometers between two points
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// Function to calculate estimated delivery time
export const calculateDeliveryTime = (distance, averageSpeed = 40) => {
    const timeInHours = distance / averageSpeed; // Average speed in km/h
    const timeInMinutes = Math.ceil(timeInHours * 60); // Convert to minutes
    return timeInMinutes;
};