export const getCategoryStats = async () => {
    const stats = await Category.aggregate([
        {
            $group: {
                _id: null,
                totalCategories: { $sum: 1 },
                activeCategories: { 
                    $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } 
                },
                inactiveCategories: { 
                    $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } 
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalCategories: 1,
                activeCategories: 1,
                inactiveCategories: 1
            }
        }
    ]);
    
    return stats[0] || { totalCategories: 0, activeCategories: 0, inactiveCategories: 0 };
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

//SOFT DELETE
export const deleteCategoryHandler = async (req, reply) => {
    try {
        const { id } = req.params;
        const category = await deleteCategory(id);
        
        if (!category) {
            return reply.status(404).send({ 
                success: false, 
                message: "Category not found" 
            });
        }
        
        reply.send({
            success: true,
            message: "Category deleted successfully",
            data: category
        });
    } catch (error) {
        console.error(error);
        reply.status(500).send({ 
            success: false, 
            message: "Error deleting category" 
        });
    }
};

// NEW: Get category statistics
export const getCategoryStatsHandler = async (req, reply) => {
    try {
        const stats = await getCategoryStats();
        reply.send({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error(error);
        reply.status(500).send({ 
            success: false, 
            message: "Error retrieving category statistics" 
        });
    }
};
