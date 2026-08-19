const mongoose = require("mongoose");

// Function to connect MongoDB
const connectDB = async () => {
    try {
        // Connect to MongoDB using the URL from .env
        await mongoose.connect(process.env.MONGO_URI);

        // If connection is successful
        console.log("MongoDB connected successfully");

    } catch (error) {
        // If connection fails
        console.log("MongoDB connection failed");
        console.log(error.message);

        // Stop the application
        process.exit(1);
    }
};

// Export the function
module.exports = connectDB;