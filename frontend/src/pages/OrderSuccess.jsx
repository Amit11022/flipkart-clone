import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


// ========================================
// ORDER SUCCESS PAGE
// ========================================

function OrderSuccess() {

    const location = useLocation();
    const navigate = useNavigate();

    const order = location.state?.order;


    // Payment method labels
    const paymentLabels = {
        COD:    "Cash on Delivery",
        UPI:    "UPI Payment",
        CARD:   "Credit / Debit Card",
        WALLET: "Wallet"
    };


    // Format delivery date
    const deliveryDate = order?.estimatedDelivery
        ? new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
            weekday: "long",
            day:     "numeric",
            month:   "long",
            year:    "numeric"
          })
        : "5-7 business days";


    // ========================================
    // RENDER
    // ========================================

    return (
        <>
            <Navbar />

            <main className="order-success-page">

                <div className="success-card">

                    {/* SUCCESS ICON */}
                    <div className="success-icon" aria-hidden="true">✓</div>

                    {/* HEADING */}
                    <h1>Order Placed!</h1>

                    <p>
                        Your order has been confirmed and will be delivered soon.
                        {order?.paymentMethod === "COD"
                            ? " Please keep the exact amount ready."
                            : " Payment was successful."}
                    </p>


                    {/* ORDER ID BADGE */}
                    {order && (
                        <div className="order-id-badge">
                            Order ID
                            <strong id="order-number">{order.orderNumber}</strong>
                        </div>
                    )}


                    {/* ORDER DETAILS */}
                    {order && (
                        <div className="success-details">
                            <h3>Order Summary</h3>

                            <div className="success-detail-row">
                                <span>Total Amount</span>
                                <span>₹{order.totalAmount?.toLocaleString()}</span>
                            </div>

                            <div className="success-detail-row">
                                <span>Payment</span>
                                <span>{paymentLabels[order.paymentMethod] || order.paymentMethod}</span>
                            </div>

                            <div className="success-detail-row">
                                <span>Status</span>
                                <span style={{ color: "var(--fk-green)" }}>✓ {order.status}</span>
                            </div>

                            <div className="success-detail-row">
                                <span>Estimated Delivery</span>
                                <span>{deliveryDate}</span>
                            </div>

                            {order.shippingAddress && (
                                <div className="success-detail-row">
                                    <span>Deliver to</span>
                                    <span>
                                        {order.shippingAddress.name},{" "}
                                        {order.shippingAddress.city}
                                    </span>
                                </div>
                            )}

                        </div>
                    )}


                    {/* ACTIONS */}
                    <div className="success-actions">

                        <button
                            className="btn-view-orders"
                            onClick={() => navigate("/orders")}
                            id="view-orders-btn"
                        >
                            📦 View My Orders
                        </button>

                        <button
                            className="btn-continue-shopping"
                            onClick={() => navigate("/products")}
                            id="continue-shopping-btn"
                        >
                            🛍️ Continue Shopping
                        </button>

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}


export default OrderSuccess;
