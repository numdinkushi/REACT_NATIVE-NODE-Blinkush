import  Category  from "../../src/models/category.js";

export const getAllCategories = async (req, reply) => {
    try {
        const categories = await Category.find();
        
        return reply.send(categories);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Error retrieving categories" });
    }
};