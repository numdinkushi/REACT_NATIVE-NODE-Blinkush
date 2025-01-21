import  Category  from "../../models/category.js";

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