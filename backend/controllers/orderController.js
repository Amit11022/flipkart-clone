const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");


// ========================================
// PLACE ORDER
// ========================================

const placeOrder = async (req, res) => {

    try {

        const {
            shippingAddress,
            paymentMethod,
            paymentDetails
        } = req.body;


        // Validate required fields
        if (
            !shippingAddress ||
            !shippingAddress.name ||
            !shippingAddress.phone ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all delivery details"
            });
        }


        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Please select a payment method"
            });
        }


        // Get user's cart
        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");


        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }


        // Build order items from cart
        const orderItems = [];
        let itemsTotal = 0;


        for (const item of cart.items) {

            const product = item.product;

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "One or more products in your cart are no longer available"
                });
            }


            // Check stock
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for "${product.name}"`
                });
            }


            const price = product.discountPrice || product.price;

            const image =
                product.images && product.images.length > 0
                    ? product.images[0]
                    : "";


            orderItems.push({
                product: product._id,
                name:     product.name,
                brand:    product.brand,
                image:    image,
                price:    price,
                quantity: item.quantity
            });


            itemsTotal += price * item.quantity;

        }


        const deliveryCharge = 0; // Free delivery
        const totalAmount    = itemsTotal + deliveryCharge;


        // Create order
        const order = await Order.create({
            user:            req.user._id,
            items:           orderItems,
            shippingAddress: shippingAddress,
            paymentMethod:   paymentMethod,
            paymentDetails:  paymentDetails || {},
            itemsTotal:      itemsTotal,
            deliveryCharge:  deliveryCharge,
            totalAmount:     totalAmount
        });


        // Deduct stock for each product
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } }
            );
        }


        // Clear the cart
        cart.items = [];
        await cart.save();


        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });


    } catch (error) {
        console.log("placeOrder error:", error);
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};


// ========================================
// GET MY ORDERS
// ========================================

const getMyOrders = async (req, res) => {

    try {

        const orders = await Order.find({
            user: req.user._id
        })
        .populate("items.product", "name images")
        .sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            orders
        });


    } catch (error) {

        console.log("getMyOrders error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================================
// GET ORDER BY ID
// ========================================

const getOrderById = async (req, res) => {

    try {

        const order = await Order.findOne({
            _id:  req.params.id,
            user: req.user._id
        }).populate("items.product", "name images brand");


        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }


        res.status(200).json({
            success: true,
            order
        });


    } catch (error) {

        console.log("getOrderById error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    placeOrder,
    getMyOrders,
    getOrderById
};
