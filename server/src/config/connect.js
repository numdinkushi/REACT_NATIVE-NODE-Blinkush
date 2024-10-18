import mongoose from "mongoose";

export const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri, );

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB", error.message);
        // await mongoose.disconnect();
        // process.exit(1);
    }
};