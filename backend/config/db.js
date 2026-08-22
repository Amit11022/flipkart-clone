const mongoose = require("mongoose");

// Function to connect MongoDB
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is missing!");
        }

        // Connect to MongoDB using the URL from .env
        await mongoose.connect(process.env.MONGO_URI);

        // If connection is successful
        console.log("MongoDB connected successfully");

    } catch (error) {
        // If connection fails
        console.error("MongoDB connection failed:", error.message);

        // Do not crash the process on Vercel so we can log errors properly
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
};

// Export the function
module.exports = connectDB;