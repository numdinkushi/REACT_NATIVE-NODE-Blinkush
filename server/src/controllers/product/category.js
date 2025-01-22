import Category from "../../models/category.js";
import mongoose from "mongoose";

export const getAllCategories = async (req, reply) => {
    try {
        const categories = await Category.find();
        return reply.send(categories);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Error retrieving categories" });
    }
};

export const getCategoryById = async (req, reply) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return reply.status(404).send({ message: "Category not found" });
        }

        return reply.send(category);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Error retrieving category" });
    }
};

export const getCategories = async (req, reply) => {
    try {
        const { startId, endId } = req.query;

        let query = {};

        // Check if startId and endId are provided
        if (startId && endId) {
            // Convert startId and endId to ObjectId
            const startObjectId = new mongoose.Types.ObjectId(startId);
            const endObjectId = new mongoose.Types.ObjectId(endId);

            // Set the query to find categories within the specified range
            query._id = { $gte: startObjectId, $lte: endObjectId };
        }

        const categories = await Category.find(query);

        return reply.send(categories);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Error retrieving categories" });
    }
};
