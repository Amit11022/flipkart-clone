const express  = require("express");
const router   = express.Router();
const {
    placeOrder,
    getMyOrders,
    getOrderById
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");


// POST /api/orders       — Place a new order
router.post("/",      protect, placeOrder);

// GET  /api/orders/my    — Get logged-in user's orders
router.get("/my",     protect, getMyOrders);

// GET  /api/orders/:id   — Get a single order by ID
router.get("/:id",    protect, getOrderById);


module.exports = router;
