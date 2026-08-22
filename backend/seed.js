const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Load env variables
dotenv.config();

const User = require("./models/User");
const Product = require("./models/Product");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flipkartClone";

const seedData = async () => {
    try {
        console.log("Connecting to database at:", MONGO_URI.split("@")[1] || MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log("Connected successfully to seed.");

        // Clear existing data (optional, but good for clean seed)
        console.log("Clearing existing products and seed users...");
        await Product.deleteMany({});
        await User.deleteMany({ email: "seller@flipkart.com" });

        // Create a default seller user
        const hashedPassword = await bcrypt.hash("sellerpassword123", 10);
        const sellerUser = await User.create({
            name: "Flipkart Official Seller",
            email: "seller@flipkart.com",
            password: hashedPassword,
            phone: "9876543210",
            role: "admin"
        });
        console.log("Default seller account created successfully.");

        // Define mock products with placehold.co images that match frontend layout
        const products = [
            {
                name: "iPhone 15 Pro Max (256 GB, Titanium)",
                description: "Experience the ultimate iPhone with a strong and light aerospace-grade titanium design. Powered by the A17 Pro chip for next-level mobile gaming and performance.",
                price: 159900,
                discountPrice: 148900,
                category: "Mobiles",
                brand: "Apple",
                stock: 25,
                rating: 4.8,
                numReviews: 1204,
                images: ["/static/products/iphone15.jpg"],
                seller: sellerUser._id
            },
            {
                name: "Samsung Galaxy S24 Ultra (512 GB, Gray)",
                description: "Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 17.27 cm flat display. Powered by Galaxy AI for search, translate, and note-taking.",
                price: 139999,
                discountPrice: 129999,
                category: "Mobiles",
                brand: "Samsung",
                stock: 18,
                rating: 4.7,
                numReviews: 890,
                images: ["/static/products/s24ultra.jpg"],
                seller: sellerUser._id
            },
            {
                name: "Sony WH-1000XM5 Wireless Headphones",
                description: "Industry-leading noise-canceling wireless over-ear headphones with Alexa voice control. Exceptional sound quality and clear hands-free calling with smart listening technology.",
                price: 29990,
                discountPrice: 26990,
                category: "Electronics",
                brand: "Sony",
                stock: 45,
                rating: 4.6,
                numReviews: 2450,
                images: ["/static/products/sonyheadphones.jpg"],
                seller: sellerUser._id
            },
            {
                name: "Apple MacBook Pro (14-inch, M3 Chip)",
                description: "The 14-inch MacBook Pro blasts forward with the M3 chip, an incredibly advanced processor that brings massive speed and capability. Battery life lasts up to 22 hours.",
                price: 169900,
                discountPrice: 157900,
                category: "Electronics",
                brand: "Apple",
                stock: 15,
                rating: 4.9,
                numReviews: 432,
                images: ["/static/products/macbookpro.jpg"],
                seller: sellerUser._id
            },
            {
                name: "Nike Air Max Solo Sneakers",
                description: "Comfort meets heritage style in the Nike Air Max Solo. Featuring a padded collar, premium mesh upper, and the legendary Air cushioning, it's perfect for all-day wear.",
                price: 8295,
                discountPrice: 6995,
                category: "Fashion",
                brand: "Nike",
                stock: 60,
                rating: 4.4,
                numReviews: 312,
                images: ["/static/products/nikesneakers.jpg"],
                seller: sellerUser._id
            },
            {
                name: "Philips Air Fryer XL (6.2L, 2000W)",
                description: "Healthy frying with Rapid Air technology. Fry, bake, grill, roast, and reheat with up to 90% less fat. Includes touch screen with 7 presets.",
                price: 12999,
                discountPrice: 9999,
                category: "Appliances",
                brand: "Philips",
                stock: 30,
                rating: 4.5,
                numReviews: 1205,
                images: ["/static/products/philipsairfryer.jpg"],
                seller: sellerUser._id
            },
            {
                name: "Levi's Men's 511 Slim Fit Jeans",
                description: "A modern slim with room to move. The 511 Slim Fit Jeans are a classic since now. They sit below the waist with a slim leg from hip to ankle.",
                price: 3499,
                discountPrice: 2499,
                category: "Fashion",
                brand: "Levi's",
                stock: 120,
                rating: 4.2,
                numReviews: 765,
                images: ["/static/products/levisjeans.jpg"],
                seller: sellerUser._id
            },
            {
                name: "Dyson V15 Detect Cordless Vacuum",
                description: "The most powerful, intelligent cordless vacuum. Laser reveals microscopic dust. Counts and measures the size of dust particles and automatically adapts suction power.",
                price: 65900,
                discountPrice: 59900,
                category: "Home",
                brand: "Dyson",
                stock: 12,
                rating: 4.8,
                numReviews: 180,
                images: ["/static/products/dysonvacuum.jpg"],
                seller: sellerUser._id
            }
        ];

        console.log("Inserting products...");
        await Product.insertMany(products);
        console.log("Products seeded successfully!");

        mongoose.connection.close();
        console.log("Database connection closed. Seeding complete!");
        process.exit(0);

    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedData();
