const express = require("express");

const router = express.Router();


// ========================================
// MIDDLEWARE
// ========================================

const protect = require("../middleware/authMiddleware");

const adminOnly = require("../middleware/adminMiddleware");

const upload = require("../middleware/uploadMiddleware");


// ========================================
// CONTROLLER
// ========================================

const {

    createProduct,

    getProducts,

    getProductById,

    updateProduct,

    deleteProduct

} = require("../controllers/productController");


// ========================================
// VALIDATION
// ========================================

const {

    productValidator

} = require("../validators/productValidator");



// ========================================
// PUBLIC ROUTES
// ========================================

// Get all products

router.get(
    "/",
    getProducts
);


// Get single product

router.get(
    "/:id",
    getProductById
);



// ========================================
// ADMIN ROUTES
// ========================================

// Create product

router.post(

    "/",

    protect,

    adminOnly,

    upload.array(
        "images",
        5
    ),

    productValidator,

    createProduct
);


// Update product

router.put(

    "/:id",

    protect,

    adminOnly,

    updateProduct
);


// Delete product

router.delete(

    "/:id",

    protect,

    adminOnly,

    deleteProduct
);



module.exports = router;