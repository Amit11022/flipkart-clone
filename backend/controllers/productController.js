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

// ========================================
// EXPORT
// ========================================

module.exports = {

    createProduct,

    getProducts,

    getProductById,

    updateProduct,

    deleteProduct
};