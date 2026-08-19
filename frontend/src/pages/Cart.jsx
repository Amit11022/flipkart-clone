import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "../components/Toast";
import {
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from "../services/cartService";


function Cart() {

    const [cart,    setCart]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState("");


    // ========================================
    // GET CART
    // ========================================

    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await getCart();
            setCart(data.cart);
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Unable to load cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);


    // ========================================
    // UPDATE QUANTITY
    // ========================================

    const handleQuantity = async (productId, quantity) => {
        try {
            const data = await updateCartItem(productId, quantity);
            setCart(data.cart);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Unable to update quantity");
        }
    };


    // ========================================
    // REMOVE
    // ========================================

    const handleRemove = async (productId) => {
        try {
            const data = await removeFromCart(productId);
            setCart(data.cart);
            toast.success("Item removed from cart");
        } catch (error) {
            console.log(error);
            toast.error("Unable to remove item");
        }
    };


    // ========================================
    // CLEAR
    // ========================================

    const handleClearCart = async () => {
        try {
            const data = await clearCart();
            setCart(data.cart);
            toast.info("Cart cleared");
        } catch (error) {
            console.log(error);
            toast.error("Unable to clear cart");
        }
    };


    // ========================================
    // TOTAL
    // ========================================

    const calculateTotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((total, item) => {
            const price = item.product.discountPrice || item.product.price;
            return total + price * item.quantity;
        }, 0);
    };

    const calculateSavings = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((s, item) => {
            if (item.product.discountPrice) {
                return s + (item.product.price - item.product.discountPrice) * item.quantity;
            }
            return s;
        }, 0);
    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading">Loading cart...</div>
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
            </>
        );
    }


    const items    = cart?.items || [];
    const total    = calculateTotal();
    const savings  = calculateSavings();
    const totalQty = items.reduce((s, i) => s + i.quantity, 0);


    // ========================================
    // RENDER
    // ========================================

    return (
        <>
            <Navbar />

            <main className="cart-page">

                <h1>🛒 My Cart {items.length > 0 && `(${totalQty} items)`}</h1>

                {items.length === 0 ? (

                    <div className="empty-cart">
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything yet.</p>
                        <Link to="/products" className="continue-shopping">
                            🛍️ Start Shopping
                        </Link>
                    </div>

                ) : (

                    <div className="cart-container">


                        {/* CART ITEMS */}
                        <div className="cart-items">

                            {items.map((item) => {

                                const product = item.product;
                                const price   = product.discountPrice || product.price;
                                const image   = product.images?.length > 0
                                    ? `http://localhost:5000${product.images[0]}`
                                    : "https://placehold.co/150x150?text=No+Image";


                                return (
                                    <div className="cart-item" key={product._id}>

                                        {/* IMAGE */}
                                        <img
                                            src={image}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.src = "https://placehold.co/150x150?text=No+Image";
                                            }}
                                        />

                                        {/* DETAILS */}
                                        <div className="cart-item-details">

                                            <Link
                                                to={`/products/${product._id}`}
                                                className="cart-product-name"
                                            >
                                                {product.name}
                                            </Link>

                                            <p>{product.brand}</p>

                                            <strong>₹{price.toLocaleString()}</strong>

                                            {product.discountPrice && (
                                                <span className="cart-original-price">
                                                    ₹{product.price.toLocaleString()}
                                                </span>
                                            )}

                                            {/* QUANTITY */}
                                            <div className="cart-quantity">
                                                <button
                                                    disabled={item.quantity <= 1}
                                                    onClick={() => handleQuantity(product._id, item.quantity - 1)}
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    disabled={item.quantity >= product.stock}
                                                    onClick={() => handleQuantity(product._id, item.quantity + 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* REMOVE */}
                                            <button
                                                className="remove-cart-button"
                                                onClick={() => handleRemove(product._id)}
                                            >
                                                Remove
                                            </button>

                                        </div>

                                        {/* ITEM TOTAL */}
                                        <div className="cart-item-total">
                                            ₹{(price * item.quantity).toLocaleString()}
                                        </div>

                                    </div>
                                );

                            })}

                            {/* CLEAR CART */}
                            <button
                                className="clear-cart-button"
                                onClick={handleClearCart}
                                id="clear-cart-btn"
                            >
                                🗑️ Clear Cart
                            </button>

                        </div>


                        {/* CART SUMMARY */}
                        <div className="cart-summary">

                            <h2>Price Details</h2>

                            <div className="summary-row">
                                <span>Price ({totalQty} items)</span>
                                <span>₹{items.reduce((s, i) => {
                                    return s + i.product.price * i.quantity;
                                }, 0).toLocaleString()}</span>
                            </div>

                            {savings > 0 && (
                                <div className="summary-row">
                                    <span>Discount</span>
                                    <span style={{ color: "var(--fk-green)", fontWeight: "600" }}>
                                        − ₹{savings.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            <div className="summary-row">
                                <span>Delivery</span>
                                <span className="free">FREE</span>
                            </div>

                            <hr />

                            <div className="summary-total">
                                <span>Total Amount</span>
                                <strong>₹{total.toLocaleString()}</strong>
                            </div>

                            {savings > 0 && (
                                <p style={{
                                    fontSize:   "13px",
                                    color:      "var(--fk-green)",
                                    fontWeight: "600",
                                    textAlign:  "center",
                                    marginTop:  "8px"
                                }}>
                                    🎉 You save ₹{savings.toLocaleString()} on this order!
                                </p>
                            )}

                            <Link
                                to="/checkout"
                                className="checkout-button"
                                id="proceed-checkout-btn"
                            >
                                Proceed to Checkout →
                            </Link>

                        </div>

                    </div>

                )}

            </main>

            <Footer />
        </>
    );
}


export default Cart;