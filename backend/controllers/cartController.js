const Cart = require("../models/Cart");
const Product = require("../models/Product");


// ========================================
// GET CART
// ========================================

const getCart = async (req, res) => {

    try {

        // Find cart of logged-in user
        // populate() gets complete product details
        let cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        // Create an empty cart if user does not have one
        if (!cart) {

            cart = await Cart.create({

                user: req.user._id,

                items: []
            });
        }

        // Send cart to client
        res.status(200).json({

            success: true,

            cart
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
// ADD TO CART
// ========================================

const addToCart = async (req, res) => {

    try {

        // Get product ID and quantity from request
        const {
            productId,
            quantity = 1
        } = req.body;

        // Check if product ID is provided
        if (!productId) {

            return res.status(400).json({

                success: false,

                message: "Product ID is required"
            });
        }

        // Find product in database
        const product =
            await Product.findById(productId);

        // Product does not exist
        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"
            });
        }

        // Convert quantity to number
        const requestedQuantity =
            Number(quantity);

        // Check if quantity is a valid positive integer
        if (
            !Number.isInteger(requestedQuantity) ||
            requestedQuantity < 1
        ) {

            return res.status(400).json({

                success: false,

                message: "Quantity must be at least 1"

            });
        }

        // Check if enough stock is available
        if (
            product.stock <
            requestedQuantity
        ) {

            return res.status(400).json({

                success: false,

                message: "Not enough stock available"
            });
        }

        // Find cart of logged-in user
        let cart = await Cart.findOne({

            user: req.user._id
        });

        // Create a new cart if user does not have one
        if (!cart) {

            cart = new Cart({

                user: req.user._id,

                items: []
            });
        }

        // Check if product already exists in cart
        const existingItem =
            cart.items.find(

                item =>
                    item.product.toString() ===
                    productId
            );

        // If product already exists
        if (existingItem) {

            // Add new quantity to existing quantity
            const newQuantity =
                existingItem.quantity +
                requestedQuantity;

            // Check if new quantity exceeds stock
            if (
                newQuantity >
                product.stock
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Requested quantity exceeds available stock"
                });
            }

            // Update existing item's quantity
            existingItem.quantity =
                newQuantity;

        } else {

            // Add new product to cart
            cart.items.push({

                product: productId,

                quantity: requestedQuantity
            });
        }

        // Save cart to database
        await cart.save();

        // Get complete product details
        await cart.populate(
            "items.product"
        );

        // Send updated cart
        res.status(200).json({

            success: true,

            message: "Product added to cart",

            cart
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
// UPDATE CART ITEM
// ========================================

const updateCartItem = async (req, res) => {

    try {

        // Get product ID and new quantity
        const {
            productId,
            quantity
        } = req.body;

        // Convert quantity to number
        const newQuantity =
            Number(quantity);

        // Check if quantity is valid
        if (
            !Number.isInteger(newQuantity) ||
            newQuantity < 1
        ) {

            return res.status(400).json({

                success: false,

                message: "Quantity must be at least 1"
            });
        }

        // Find product in database
        const product =
            await Product.findById(productId);

        // Product not found
        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"
            });
        }

        // Check available stock
        if (
            newQuantity >
            product.stock
        ) {

            return res.status(400).json({

                success: false,

                message: "Requested quantity exceeds available stock"
            });

        }

        // Find user's cart
        const cart =
            await Cart.findOne({

                user: req.user._id
            });

        // Cart does not exist
        if (!cart) {

            return res.status(404).json({

                success: false,

                message: "Cart not found"
            });
        }

        // Find product inside cart
        const item =
            cart.items.find(

                item =>
                    item.product.toString() ===
                    productId
            );

        // Product is not in cart
        if (!item) {

            return res.status(404).json({

                success: false,

                message: "Product is not in cart"
            });
        }

        // Update product quantity
        item.quantity =
            newQuantity;

        // Save updated cart
        await cart.save();

        // Get complete product details
        await cart.populate("items.product");

        // Send updated cart
        res.status(200).json({

            success: true,

            message:"Cart updated successfully",cart
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
// REMOVE FROM CART
// ========================================

const removeFromCart = async (req, res) => {

    try {

        // Get product ID from URL
        const {
            productId
        } = req.params;

        // Find user's cart
        const cart =
            await Cart.findOne({

                user: req.user._id
            });

        // Cart does not exist
        if (!cart) {

            return res.status(404).json({

                success: false,

                message: "Cart not found"
            });
        }

        // Store original number of cart items
        const originalLength =
            cart.items.length;

        // Remove the selected product
        cart.items =
            cart.items.filter(

                item =>
                    item.product.toString() !==  productId
               );

        // Check if product was actually removed
        if (
            cart.items.length === originalLength
        ) {

            return res.status(404).json({

                success: false,

                message:"Product is not in cart"
            });
        }

        // Save updated cart
        await cart.save();

        // Get complete product details
        await cart.populate("items.product");

        // Send updated cart
        res.status(200).json({

            success: true,

            message:"Product removed from cart",cart
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
// CLEAR CART
// ========================================

const clearCart = async (req, res) => {

    try {

        // Find user's cart
        const cart =
            await Cart.findOne({

                user: req.user._id
            });

        // Cart does not exist
        if (!cart) {

            return res.status(404).json({

                success: false,

                message: "Cart not found"
            });
        }

        // Remove all items from cart
        cart.items = [];

        // Save empty cart
        await cart.save();

        // Send success response
        res.status(200).json({

            success: true,

            message: "Cart cleared",

            cart
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

// Export all cart functions
module.exports = {

    getCart,

    addToCart,

    updateCartItem,

    removeFromCart,

    clearCart
};