import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMyOrders } from "../services/orderService";


// ========================================
// ORDER HISTORY PAGE
// ========================================

function OrderHistory() {

    const [orders,  setOrders]  = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState("");


    // ========================================
    // FETCH ORDERS
    // ========================================

    useEffect(() => {

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getMyOrders();
                const dbOrders = data.orders || [];

                // Get mock orders from localStorage
                let mockOrders = [];
                try {
                    const storedUser = localStorage.getItem("user");
                    const userObj = storedUser ? JSON.parse(storedUser) : null;
                    const userId = userObj?._id || "guest";
                    const mockOrdersKey = `mock_orders_${userId}`;

                    mockOrders = JSON.parse(localStorage.getItem(mockOrdersKey) || "[]");
                } catch (e) {
                    console.error(e);
                }

                setOrders([...mockOrders, ...dbOrders]);
            } catch (err) {
                console.warn("Order history fetch failed, using fallback mock data:", err);
                // Load mock orders from localStorage or default static mock data
                let mockOrders = [];
                try {
                    const storedUser = localStorage.getItem("user");
                    const userObj = storedUser ? JSON.parse(storedUser) : null;
                    const userId = userObj?._id || "guest";
                    const mockOrdersKey = `mock_orders_${userId}`;

                    mockOrders = JSON.parse(localStorage.getItem(mockOrdersKey) || "[]");
                } catch (e) {
                    console.error(e);
                }

                if (mockOrders.length > 0) {
                    setOrders(mockOrders);
                } else {
                    const year = new Date().getFullYear();
                    const fallbackOrders = [
                        {
                            _id: "mock-order-1",
                            orderNumber: `FK-${year}-728192`,
                            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                            status: "Confirmed",
                            items: [
                                {
                                    name: "Samsung Galaxy S23 Ultra 5G",
                                    quantity: 1,
                                    price: 124999
                                }
                            ],
                            totalAmount: 124999,
                            paymentMethod: "CARD"
                        }
                    ];
                    setOrders(fallbackOrders);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

    }, []);


    // ========================================
    // STATUS STYLE
    // ========================================

    const getStatusClass = (status) => {
        const map = {
            "Delivered":        "status-delivered",
            "In Transit":       "status-transit",
            "Pending":          "status-pending",
            "Confirmed":        "status-confirmed",
            "Processing":       "status-processing",
            "Shipped":          "status-shipped",
            "Out for Delivery": "status-delivery",
            "Cancelled":        "status-cancelled"
        };
        return map[status] || "";
    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading">Loading orders...</div>
                <Footer />
            </>
        );
    }


    // ========================================
    // ERROR
    // ========================================

    if (error) {
        return (
            <>
                <Navbar />
                <div className="error">{error}</div>
                <Footer />
            </>
        );
    }


    // ========================================
    // RENDER
    // ========================================

    return (
        <>
            <Navbar />

            <main className="order-history-page">
                <div className="order-history-container">

                    <h1>📦 My Orders</h1>

                    {orders.length === 0 ? (

                        <div className="no-orders">
                            <h2>No orders yet</h2>
                            <p>You haven't placed any orders yet. Start shopping!</p>
                            <Link to="/products">🛍️ Shop Now</Link>
                        </div>

                    ) : (

                        <div className="orders-list">

                            {orders.map((order) => (

                                <div key={order._id} className="order-card">

                                    {/* HEADER */}
                                    <div className="order-header">

                                        <div className="order-info">
                                            <h3>{order.orderNumber}</h3>
                                            <p className="order-date">
                                                Placed on{" "}
                                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                    day:   "numeric",
                                                    month: "long",
                                                    year:  "numeric"
                                                })}
                                            </p>
                                        </div>

                                        <div className={`order-status ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </div>

                                    </div>


                                    {/* ITEMS */}
                                    <div className="order-items">

                                        {order.items.map((item, index) => (

                                            <div key={index} className="order-item">

                                                <div className="item-details">
                                                    <p className="item-name">{item.name}</p>
                                                    <p className="item-quantity">
                                                        Qty: {item.quantity} ×{" "}
                                                        ₹{item.price.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="item-price">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </div>

                                            </div>

                                        ))}

                                    </div>


                                    {/* FOOTER */}
                                    <div className="order-footer">

                                        <div className="order-total">
                                            <strong>
                                                Total: ₹{order.totalAmount.toLocaleString()}
                                            </strong>
                                            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>
                                                Payment: {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
                                            </p>
                                        </div>

                                        <div className="order-actions">
                                            {order.status !== "Delivered" && order.status !== "Cancelled" && (
                                                <button className="action-btn">
                                                    📍 Track Order
                                                </button>
                                            )}
                                            <button className="action-btn">
                                                🔄 Reorder
                                            </button>
                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>
            </main>

            <Footer />
        </>
    );
}


export default OrderHistory;
