const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const shippingAddressSchema = new mongoose.Schema({
    name:    { type: String, required: true },
    phone:   { type: String, required: true },
    address: { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    pincode: { type: String, required: true }
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        orderNumber: {
            type: String,
            unique: true
        },

        items: [orderItemSchema],

        shippingAddress: shippingAddressSchema,

        paymentMethod: {
            type: String,
            enum: ["COD", "UPI", "CARD", "WALLET"],
            required: true
        },

        paymentDetails: {
            upiId:      { type: String },
            cardLast4:  { type: String },
            walletType: { type: String }
        },

        itemsTotal: {
            type: Number,
            required: true
        },

        deliveryCharge: {
            type: Number,
            default: 0
        },

        totalAmount: {
            type: Number,
            required: true
        },

        isPaid: {
            type: Boolean,
            default: false
        },

        paidAt: {
            type: Date
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Processing",
                "Shipped",
                "In Transit",
                "Out for Delivery",
                "Delivered",
                "Cancelled"
            ],
            default: "Confirmed"
        },

        estimatedDelivery: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Auto-generate order number before saving
orderSchema.pre("save", async function (next) {
    try {
        if (!this.orderNumber) {
            const count = await this.constructor.countDocuments();
            const year = new Date().getFullYear();
            this.orderNumber = `FK-${year}-${String(count + 1).padStart(6, "0")}`;
        }

        // Set estimated delivery: COD = 5-7 days, others = 3-5 days
        if (!this.estimatedDelivery) {
            const days = this.paymentMethod === "COD" ? 7 : 5;
            const delivery = new Date();
            delivery.setDate(delivery.getDate() + days);
            this.estimatedDelivery = delivery;
        }

        // COD orders are not paid upfront
        if (this.paymentMethod !== "COD") {
            this.isPaid = true;
            this.paidAt = new Date();
        }

        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("Order", orderSchema);
