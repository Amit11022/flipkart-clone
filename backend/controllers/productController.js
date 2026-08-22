const { validationResult } = require("express-validator");
const Product = require("../models/Product");

// ========================================
// CREATE PRODUCT
// WITH IMAGE UPLOAD
// ========================================

const createProduct = async (req, res) => {

    try {

        // Show request data in console for debugging
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        // ========================================
        // VALIDATION
        // ========================================

        // Check validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,

                // Send validation errors
                errors: errors.array()
            });
        }

        // ========================================
        // PRODUCT DATA
        // ========================================

        // Get product information from request body
        const {
            name,
            description,
            price,
            discountPrice,
            category,
            brand,
            stock
        } = req.body;

        // ========================================
        // GET UPLOADED IMAGES
        // ========================================

        // Get image paths from uploaded files
        const images = req.files
            ? req.files.map(file => {

                return `/uploads/products/${file.filename}`;

            })
            : [];

        // Show image paths in console
        console.log("IMAGE PATHS:", images);

        // ========================================
        // CREATE PRODUCT
        // ========================================

        // Save product information in MongoDB
        const product = await Product.create({

            name,
            description,
            price,
            discountPrice,
            category,
            brand,
            images,
            stock,

            // Store logged-in user's ID as seller
            seller: req.user._id
        });

        // ========================================
        // RESPONSE
        // ========================================

        // Send created product to client
        res.status(201).json({

            success: true,

            message: "Product created successfully",

            product
        });

    } catch (error) {

        // Handle server error
        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server error"
        });
    }
};

// ========================================
// GET ALL PRODUCTS
// SEARCH + FILTER + SORT + PAGINATION
// ========================================

const getProducts = async (req, res) => {

    try {

        // Get search, filter, sort and pagination values
        // from URL query parameters
        const {
            search,
            category,
            brand,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        // ========================================
        // BUILD FILTER
        // ========================================

        // Empty filter object
        const filter = {};

        // ========================================
        // SEARCH BY PRODUCT NAME
        // ========================================

        // Search product by name
        if (search) {

            filter.name = {

                // Regex allows partial search
                $regex: search,

                // "i" means case-insensitive
                $options: "i"
            };
        }

        // ========================================
        // FILTER BY CATEGORY
        // ========================================

        if (category) {

            filter.category = {

                // Search category using regex
                $regex: category,

                // Ignore uppercase/lowercase
                $options: "i"
            };
        }

        // ========================================
        // FILTER BY BRAND
        // ========================================

        if (brand) {

            filter.brand = {

                $regex: brand,

                // Case-insensitive search
                $options: "i"
            };
        }

        // ========================================
        // PRICE FILTER
        // ========================================

        // Apply filter if minimum or maximum price exists
        if (minPrice || maxPrice) {

            filter.price = {};

            // Minimum price
            if (minPrice) {

                filter.price.$gte = Number(minPrice);
            }

            // Maximum price
            if (maxPrice) {

                filter.price.$lte = Number(maxPrice);
            }
        }

        // ========================================
        // PAGINATION
        // ========================================

        // Make sure current page is at least 1
        const currentPage = Math.max(
            Number(page),
            1
        );

        // Make sure limit is at least 1
        const productsPerPage = Math.max(
            Number(limit),
            1
        );

        // Calculate how many products to skip
        const skip =
            (currentPage - 1) *
            productsPerPage;

        // ========================================
        // SORT
        // ========================================

        // Default sorting = newest products first
        let sortOption = {
            createdAt: -1
        };

        // Sort price: Low to High
        if (sort === "low") {

            sortOption = {
                price: 1
            };
        }

        // Sort price: High to Low
        else if (sort === "high") {

            sortOption = {
                price: -1
            };
        }

        // Sort newest products first
        else if (sort === "newest") {

            sortOption = {
                createdAt: -1
            };
        }

      // Sort oldest products first
        else if (sort === "oldest") {

            sortOption = {
                createdAt: 1
            };
        }

        // Sort by highest rating
        else if (sort === "rating") {

            sortOption = {
                rating: -1
            };
        }

        // ========================================
        // GET PRODUCTS
        // ========================================

        // Get products from database
        const products = await Product.find(filter)

            // Get seller's name and email
            .populate(
                "seller",
                "name email"
            )

            // Apply sorting
            .sort(sortOption)

            // Skip products for pagination
            .skip(skip)

            // Limit number of products
            .limit(productsPerPage);

        // ========================================
        // TOTAL PRODUCTS
        // ========================================

        // Count total products matching the filter
        const totalProducts =
            await Product.countDocuments(filter);

        // ========================================
        // TOTAL PAGES
        // ========================================

        // Calculate total number of pages
        const totalPages =
            Math.ceil(
                totalProducts /
                productsPerPage
            );

        // ========================================
        // RESPONSE
        // ========================================

        res.status(200).json({

            success: true,

            // Number of products on current page
            count: products.length,

            // Total matching products
            totalProducts,

            // Current page number
            currentPage,

            // Total available pages
            totalPages,

            // Check if next page exists
            hasNextPage: currentPage < totalPages,

            // Check if previous page exists
            hasPreviousPage: currentPage > 1,products
        });

    } catch (error) {

        // Handle server error
        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server error"
        });
    }
};

// ========================================
// GET SINGLE PRODUCT
// ========================================

const getProductById = async (req, res) => {

    try {

        // Find product using ID from URL
        const product = await Product.findById(
            req.params.id
        ).populate(
            "seller",
            "name email"
        );

      // Product does not exist
        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"
            });
        }

        // Send product information
        res.status(200).json({

            success: true,

            product
        });

    } catch (error) {

        // Handle server error
        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server error"
        });
    }
};

// ========================================
// UPDATE PRODUCT
// ========================================

const updateProduct = async (req, res) => {

    try {

        // Find product using ID from URL
        const product = await Product.findById(
            req.params.id
        );

        // Product does not exist
        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"
            });
        }

        // Get updated data from request
        const {
            name,
            description,
            price,
            discountPrice,
            category,
            brand,
            images,
            stock
        } = req.body;

        // ========================================
        // UPDATE ONLY PROVIDED FIELDS
        // ========================================

        // If new value exists, update it.
        // Otherwise keep old value.

        product.name = name ?? product.name;

        product.description = description ?? product.description;

        product.price = price ?? product.price;

        product.discountPrice = discountPrice ?? product.discountPrice;

        product.category = category ?? product.category;

        product.brand = brand ?? product.brand;

        product.images = images ?? product.images;

        product.stock = stock ?? product.stock;

        // Save updated product
        const updatedProduct =
            await product.save();

        // Send updated product
        res.status(200).json({

            success: true,

            message: "Product updated successfully",

            product: updatedProduct
        });

    } catch (error) {

        // Handle server error
        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server error"
        });
    }
};

// ========================================
// DELETE PRODUCT
// ========================================

const deleteProduct = async (req, res) => {

    try {

        // Find product using ID from URL
        const product = await Product.findById(
            req.params.id
        );

        // Product does not exist
        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"
            });
        }

        // Delete product from database
        await product.deleteOne();

        // Send success response
        res.status(200).json({

            success: true,

            message: "Product deleted successfully"
        });

    } catch (error) {

        // Handle server error
        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server error"
        });
    }
};

const seedProducts = async (req, res) => {
    try {
        const User = require("../models/User");
        const bcrypt = require("bcryptjs");

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({ email: "seller@flipkart.com" });

        // Create default seller
        const hashedPassword = await bcrypt.hash("sellerpassword123", 10);
        const sellerUser = await User.create({
            name: "Flipkart Official Seller",
            email: "seller@flipkart.com",
            password: hashedPassword,
            phone: "9876543210",
            role: "admin"
        });

        // Define mock products
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
                images: ["https://placehold.co/400x400/ECEFF1/37474F?text=iPhone+15+Pro"],
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
                images: ["https://placehold.co/400x400/ECEFF1/37474F?text=Galaxy+S24+Ultra"],
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
                images: ["https://placehold.co/400x400/ECEFF1/37474F?text=Sony+WH-1000XM5"],
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
                images: ["https://placehold.co/400x400/ECEFF1/37474F?text=MacBook+Pro+M3"],
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
                images: ["https://placehold.co/400x400/ECEFF1/37474F?text=Nike+Air+Max"],
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
                images: ["https://placehold.co/400x400/ECEFF1/37474F?text=Philips+Air+Fryer"],
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
                images: ["https://placehold.co/400x400/ECEFF1/37474F?text=Levis+Slim+Jeans"],
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
                images: ["https://placehold.co/400x400/ECEFF1/37474F?text=Dyson+V15"],
                seller: sellerUser._id
            }
        ];

        await Product.insertMany(products);

        res.status(200).json({
            success: true,
            message: "Products seeded successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Seeding failed",
            error: error.message
        });
    }
};

// ========================================
// EXPORT
// ========================================

module.exports = {

    createProduct,

    getProducts,

    getProductById,

    updateProduct,

    deleteProduct,

    seedProducts
};