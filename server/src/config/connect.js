import mongoose from "mongoose";

export const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB", error.message);
        process.exit(1);
    }
};

// export const connectDB = async (uri) => {
//     try {
//         await mongoose.connect(uri);
//         console.log("MongoDB connected successfully");
//     } catch (error) {
//         console.error("Error connecting to MongoDB", error.message);
//         process.exit(1);
//     }
// }; 

// async function testConnection() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Test MongoDB connection successful!");
//   } catch (error) {
//     console.error("Test MongoDB connection failed:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// testConnection();
