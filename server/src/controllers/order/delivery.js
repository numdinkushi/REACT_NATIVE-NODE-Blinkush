import Branch from "../../models/branch.js";
import Order from "../../models/order.js";
import { Customer, DeliveryPartner } from "../../models/user.js";

// Utility function to calculate distance in kilometers between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
const calculateDeliveryTime = (distance, averageSpeed = 40) => {
    const timeInHours = distance / averageSpeed; // Average speed in km/h
    const timeInMinutes = Math.ceil(timeInHours * 60); // Convert to minutes
    return timeInMinutes;
};

export const createOrder = async (req, reply) => {
    try {
        const { userId } = req.user;
        const { items, branch, totalPrice } = req.body;

        // Find customer and branch
        const customerData = await Customer.findById(userId);
        const branchData = await Branch.findById(branch);

        // Validate customer and branch
        if (!customerData) {
            return reply.status(404).send({ message: "Customer not found" });
        }
        if (!branchData) {
            return reply.status(404).send({ message: "Branch not found" });
        }

        // Calculate delivery time
        const distance = calculateDistance(
            branchData.location.latitude,
            branchData.location.longitude,
            customerData.liveLocation.latitude,
            customerData.liveLocation.longitude
        );
        const estimatedDeliveryTime = calculateDeliveryTime(distance);

        // Map items
        const mappedItems = items.map((item) => ({
            id: item.id,
            item: item.item,
            count: item.count
        }));

        // Create new order
        const newOrder = new Order({
            customer: userId,
            items: mappedItems,
            branch,
            totalPrice,
            deliveryLocation: {
                latitude: customerData.liveLocation.latitude,
                longitude: customerData.liveLocation.longitude,
                address: customerData.address || 'No address available'
            },
            pickupLocation: {
                latitude: branchData.location.latitude,
                longitude: branchData.location.longitude,
                address: branchData.address || 'No address available'
            },
            deliveryPersonLocation: {
                latitude: branchData.location.latitude,
                longitude: branchData.location.longitude,
            },
            estimatedDeliveryTime, // Add estimated delivery time to the order
        });

        // Save order to database
        const savedOrder = await newOrder.save();

        // Send response
        return reply.status(201).send({
            ...savedOrder.toObject(),
            estimatedDeliveryTime: `${estimatedDeliveryTime} minutes`
        });

    } catch (error) {
        console.error("Error creating order:", error);  // Log the error for debugging
        return reply.status(500).send({ message: "An error occurred", error });  // Send error response
    }
};
