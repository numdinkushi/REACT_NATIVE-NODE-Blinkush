import { assignDeliveryPartner } from "../controllers/order/delivery.js";
import { verifyToken } from "../middleware/auth.js";

export const deliveryRoutes = async (fastify, options) => {
    fastify.addHook('preHandler', async (request, reply) => {
        const isAuthenticated = await verifyToken(request, reply);

        if (!isAuthenticated) {
            return reply.code(401).send({ message: 'Unauthenticated' });
        }
    });

    fastify.put('/orders/:orderId/assign-delivery-partner', assignDeliveryPartner);
};