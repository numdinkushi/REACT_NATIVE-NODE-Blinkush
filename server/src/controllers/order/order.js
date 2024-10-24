import Branch from "../../models/branch.js";
import Order from "../../models/order.js";
import { Customer, DeliveryPartner } from "../../models/user.js";


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
        });

        // Save order to database
        const savedOrder = await newOrder.save();

        // Send response
        return reply.status(201).send(savedOrder);

    } catch (error) {
        console.error("Error creating order:", error);  // Log the error for debugging
        return reply.status(500).send({ message: "An error occurred", error });  // Send error response
    }
};

export const confirmOrder = async (req, reply) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.user;
        const { deliveryPersonLocation } = req.body;

        const deliveryPerson = await DeliveryPartner.findById(userId);

        if (!deliveryPersonLocation) {
            return reply.status(400).send({ message: "deliveryPersonLocation field is required" });
        }

        if (!deliveryPerson) {
            return reply.status(404).send({ message: "Delivery Person not found" });
        }

        const order = await Order.findById(orderId);
        if (!order) return reply.status(404).send({ message: "Order not found" });

        if (order.status !== 'available') {
            return reply.status(400).send({ message: "Order is not available" });
        }

        order.status = 'confirmed';

        order.deliveryPartner = userId;
        order.deliveryPersonLocation = {
            latitude: deliveryPersonLocation.latitude,
            longitude: deliveryPersonLocation.longitude,
            address: deliveryPersonLocation.address || ''
        };

        req.server.io.to(orderId).emit('orderConfirmed', order);
        await order.save();
        req.server.io.to(orderId).emit('liveTrackingUpdates', order);

        return reply.send(order);
    } catch (error) {
        console.log('Confirmed order error', error);
        return reply.status(500).send({ message: "Failed to confirm order" }); 
    }
}; 

export const updateOrderStatus = async (req, reply) => {
    try { 
        const { orderId } = req.params;
        const { status, deliveryPersonLocation } = req.body;

        const { userId } = req.user;

        const deliveryPerson = await DeliveryPartner.findById(userId);
        if (!deliveryPerson) {
            return reply.status(404).send({ message: "Delivery Person not found" });
        }

        const order = await Order.findById(orderId);
        if (!order) return reply.status(404).send({ message: "Order not found" });

        if (['cancelled', 'delivered'].includes(order.status)) {
            return reply.status(400).send({ message: "Order cannot be updated!" });
        }

        if (order.deliveryPartner.toString() !== userId) {
            return reply.status(401).send({ message: "Unauthorized" });
        }

        order.status = status;

        order.deliveryPersonLocation = deliveryPersonLocation;

        await order.save();

        return reply.send(order);

    } catch (error) {
        return reply.status(500).send({
            message: 'Failed to update order status', error
        });
    }
};

export const getOrders = async (req, reply) => {
    try {
        const { status, customerId, deliveryPartnerId, branchId } = req.query;
        let query = {};

        if (customerId) {
            query.customer = customerId;
        }

        if (deliveryPartnerId) {
            query.deliveryPartner = deliveryPartnerId;
            query.branch = branchId;
        }

        const orders = await Order.find(query).populate(
            "customer branch items.item deliveryPartner"
        );

        return reply.send(orders);
    } catch (error) {
        return reply.status(500).send({
            message: 'Failed to retrieve orders', error
        });
    }
};

export const getOrderById = async (req, reply) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId).populate(
            "customer branch items.item deliveryPartner"
        );

        if (!order) {
            return reply.status(404).send({ message: "Order not found" });
        }

        return reply.send(order);
    } catch (error) {
        return reply.status(500).send({
            message: 'Failed to retrieve order', error
        });
    }
};

