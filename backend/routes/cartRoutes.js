const express = require("express");

const router = express.Router();


const protect =
    require("../middleware/authMiddleware");


const {

    getCart,

    addToCart,

    updateCartItem,

    removeFromCart,

    clearCart

} = require("../controllers/cartController");


// ========================================
// GET CART
// ========================================

router.get(
    "/",
    protect,
    getCart
);


// ========================================
// ADD TO CART
// ========================================

router.post(
    "/",
    protect,
    addToCart
);


// ========================================
// UPDATE CART ITEM
// ========================================

router.put(
    "/",
    protect,
    updateCartItem
);


// ========================================
// REMOVE ITEM
// ========================================

router.delete(
    "/:productId",
    protect,
    removeFromCart
);


// ========================================
// CLEAR CART
// ========================================

router.delete(
    "/",
    protect,
    clearCart
);


module.exports = router;