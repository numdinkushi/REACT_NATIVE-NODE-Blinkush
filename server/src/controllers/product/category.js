import Category from "../../models/category.js";
import mongoose from "mongoose";

// Single Responsibility: Validate query parameters
const validateQueryParams = (req) => {
    const { startId, endId } = req.query;
    if (startId && !mongoose.Types.ObjectId.isValid(startId)) {
        throw new Error('Invalid startId');
    }
    if (endId && !mongoose.Types.ObjectId.isValid(endId)) {
        throw new Error('Invalid endId');
    }
    return { startId, endId };
};

// Single Responsibility: Build query object
const buildQuery = ({ startId, endId }) => {
    let query = {};
    if (startId && endId) {
        const startObjectId = new mongoose.Types.ObjectId(startId);
        const endObjectId = new mongoose.Types.ObjectId(endId);
        query._id = { $gte: startObjectId, $lte: endObjectId };
    }
    return query;
};

// Single Responsibility: Fetch categories from the database
const fetchCategories = async (query) => {
    return await Category.find(query);
};

// Single Responsibility: Fetch a single category by ID
const fetchCategoryById = async (id) => {
    return await Category.findById(id);
};

// Single Responsibility: Handle the request and reply for getting all categories
export const getAllCategories = async (req, reply) => {
    try {
        const categories = await fetchCategories({});
        reply.send(categories);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Error retrieving categories" });
    }
};

// Single Responsibility: Handle the request and reply for getting a category by ID
export const getCategoryById = async (req, reply) => {
    try {
        const { id } = req.params;
        const category = await fetchCategoryById(id);

        if (!category) {
            return reply.status(404).send({ message: "Category not found" });
        }

        reply.send(category);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Error retrieving category" });
    }
};

// Single Responsibility: Handle the request and reply for getting categories within a range
export const getCategories = async (req, reply) => {
    try {
        const { startId, endId } = validateQueryParams(req);
        const query = buildQuery({ startId, endId });
        const categories = await fetchCategories(query);
        reply.send(categories);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Error retrieving categories" });
    }
};
