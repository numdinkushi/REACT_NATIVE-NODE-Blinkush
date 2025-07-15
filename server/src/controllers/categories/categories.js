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