import mongoose from "mongoose";
import Counter from "./counter.js";

// Example IDs for testing purposes
const customerId = new mongoose.Types.ObjectId();  // Replace with a real customer ID from your database
const branchId = new mongoose.Types.ObjectId();    // Replace with a real branch ID
const productId = new mongoose.Types.ObjectId();   // Replace with a real product ID

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPartner',
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    items: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            count: {
                type: Number,
                required: true,
            }
        }
    ],
    deliveryLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String },
    },
    pickupLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String },
    },
    deliveryPersonLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String },
    },
    status: {
        type: String,
        enum: ['available', 'confirmed', 'arriving', 'delivered', 'cancelled'],
        default: 'available'
    },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findOneAndUpdate(
        { name: sequenceName },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    console.log('Next sequence value:', sequenceDocument.sequence_value);
    return sequenceDocument.sequence_value;
}

orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const sequenceValue = await getNextSequenceValue("orderId");
        this.orderId = `ORDR${sequenceValue.toString().padStart(5, '0')}`;
    }
    next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
// Function to create multiple orders
const createMultipleOrders = async (count) => {
    const orders = Array.from({ length: count }, async (_, index) => {
        const newOrder = new Order({
            customer: customerId,  // Use a real customer ID
            branch: branchId,      // Use a real branch ID
            items: [
                {
                    id: productId,  // Use a real product ID
                    item: productId,
                    count: 2
                }
            ],
            totalPrice: 100 + index,  // Example price variation
            deliveryLocation: {
                latitude: 12.9716,
                longitude: 77.5946,
                address: `Sample address ${index + 1}`,
            },
            pickupLocation: {
                latitude: 12.9716,
                longitude: 77.5946,
                address: `Pickup address ${index + 1}`,
            },
            deliveryPersonLocation: {
                latitude: 12.9716,
                longitude: 77.5946,
                address: `Delivery person address ${index + 1}`,
            }
        });

        try {
            console.log(`Saving order ${index + 1}:`, newOrder);
            return await newOrder.save();
        } catch (error) {
            console.error(`Error saving order ${index + 1}:`, error);
            return null;
        }
    });

    // Wait for all orders to be created
    const savedOrders = await Promise.all(orders);
    console.log(`${savedOrders.filter(order => order !== null).length} orders saved successfully.`);
};

// createMultipleOrders(20);  // Create 20 orders
