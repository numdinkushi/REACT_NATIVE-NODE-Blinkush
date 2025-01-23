import { authRoutes } from "./auth.js";
import { deliveryRoutes } from "./delivery.js";
import { orderRoutes } from "./order.js";
import { categoryRoutes, productRoutes } from "./products.js";

const prefix = '/api';

export const registerRoutes = async (fastify) => {
    fastify.register(authRoutes, { prefix });
    fastify.register(productRoutes, { prefix });
    fastify.register(categoryRoutes, { prefix });
    fastify.register(orderRoutes, { prefix }); 
    fastify.register(deliveryRoutes, { prefix }); 
};  