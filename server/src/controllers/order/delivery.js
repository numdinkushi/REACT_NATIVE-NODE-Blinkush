import Branch from "../../models/branch.js";
import Order from "../../models/order.js";
import { Customer, DeliveryPartner } from "../../models/user.js";
import { calculateDeliveryTime } from "../../utils/index.js";



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

export const assignDeliveryPartner = async (req, reply) => {
    try {
        const { orderId } = req.params;
        const { deliveryPartnerId } = req.body;
        const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);

        if (!deliveryPartner) {
            return reply.status(404).send({ message: "Delivery partner not found" });
        }

        const order = await Order.findByIdAndUpdate(orderId, { deliveryPartner: deliveryPartnerId }, { new: true });

        if (!order) {
            return reply.status(404).send({ message: "Order not found" });
        }

        return reply.status(200).send(order);
    } catch (error) {
        console.error("Error assigning delivery partner:", error);
        return reply.status(500).send({ message: "An error occurred", error });
    }
};
