import jwt from "jsonwebtoken";
import { Customer, DeliveryPartner } from "../../models/user.js";
import { UserRoles } from "../../constants/constants.js";

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    return { accessToken, refreshToken };
};

export const loginCustomer = async (req, reply) => {
    try {
        const { phone } = req.body;

        // Find existing customer by phone number
        let customer = await Customer.findOne({ phone });
        console.log("Customer found:", customer);  // Debugging log

        // If customer doesn't exist, create a new one
        if (!customer) {
            customer = new Customer({
                phone,
                role: "Customer",
                isActivated: true,
            });

            console.log("New customer to be saved:", customer);  // Debugging log

            // Save the new customer to the database
            await customer.save();
            console.log("Customer saved to DB:", customer);  // Log after save
        }

        const { accessToken, refreshToken } = generateTokens(customer);

        return reply.send({
            message: customer ? "Login Successful" : "Customer created and logged in",
            accessToken,
            refreshToken,
            customer,
        });

    } catch (error) {
        console.error("Error in loginCustomer:", error);  // Improved error logging
        return reply.status(500).send({ message: "An error occurred", error });
    }
};

export const loginDeliveryPartner = async (req, reply) => {
    try {
        const { email, password } = req.body;
        const deliveryPartner = await DeliveryPartner.findOne({ email });

        if (!deliveryPartner) {
            return reply.status(404).send({ message: "Delivery Partner not found", error: {} });
        }

        const isMatch = password === deliveryPartner.password;

        if (!isMatch) {
            return reply.status(400).send({ message: "Invalid credentials", error: {} });
        }

        const { accessToken, refreshToken } = generateTokens(deliveryPartner);

        return reply.send({
            message: "Login Successful",
            accessToken,
            refreshToken,
            deliveryPartner
        });

    } catch (error) {
        console.error('Login DeliveryPartner Error:', error);
        return reply.status(500).send({ message: "An error occurred", error: error.message || {} }); // Send proper error message in response
    }
};

export const refreshToken = async (req, reply) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return reply.status(401).send({ message: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log("Decoded token:", decoded); // Log decoded token details

        let user;
        if (decoded.role === UserRoles.CUSTOMER) {
            user = await Customer.findById(decoded.userId);
        } else if (decoded.role === 'DeliveryPartner') {
            user = await DeliveryPartner.findById(decoded.userId);
        } else {
            return reply.status(403).send({ message: 'Invalid role' });
        }

        if (!user) {
            return reply.status(403).send({ message: 'Invalid Refresh token' });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
        return reply.send({
            message: 'Token refreshed successfully',
            accessToken,
            refreshToken: newRefreshToken,
        });

    } catch (error) {
        console.error("Error in token verification:", error); // Log error details
        return reply.status(403).send({ message: 'Invalid or expired refresh token', error: error.message });
    }
};

export const fetchUser = async (req, reply) => {
    try {
        const { userId, role } = req.user;
        let user;

        if (role === UserRoles.CUSTOMER) {
            user = await Customer.findById(userId);
        } else if (role === UserRoles.DELIVERY_PARTNER) {
            user = await DeliveryPartner.findById(userId);
        } else {
            return reply.status(403).send({ message: 'Invalid role' });
        }

        if (!user) {
            return reply.status(404).send({ message: 'User not found' });
        }

        return reply.send({
            message: "User fetched successfully",
            user
        });

    } catch (error) {
        return reply.status(500).send({ message: "An error occurred", error });
    }
};