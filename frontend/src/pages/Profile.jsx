import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


function Profile() {

    const navigate = useNavigate();

    const [user,    setUser]    = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const storedUser = localStorage.getItem("user");
        const token      = localStorage.getItem("token");

        if (!storedUser || !token) {
            navigate("/login");
            return;
        }

        try {
            setUser(JSON.parse(storedUser));
        } catch (error) {
            console.log(error);
            navigate("/login");
        } finally {
            setLoading(false);
        }

    }, [navigate]);


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };


    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading">Loading profile...</div>
            </>
        );
    }

    if (!user) return null;


    // ========================================
    // RENDER
    // ========================================

    return (
        <>
            <Navbar />

            <main className="profile-page">

                <div className="profile-container">


                    {/* ========================================
                        SIDEBAR
                    ======================================== */}

                    <div>

                        <div className="profile-header">

                            <div className="profile-avatar" aria-label="User avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="profile-info">
                                <h1>{user.name}</h1>
                                <p className="profile-email">{user.email}</p>
                            </div>

                            <button
                                onClick={handleLogout}
                                style={{
                                    width:        "100%",
                                    background:   "none",
                                    color:        "var(--fk-red)",
                                    border:       "1.5px solid var(--fk-red)",
                                    borderRadius: "var(--radius-sm)",
                                    padding:      "9px 0",
                                    fontSize:     "14px",
                                    fontWeight:   "600",
                                    cursor:       "pointer",
                                    marginTop:    "8px",
                                    transition:   "all 0.2s"
                                }}
                                id="profile-logout"
                            >
                                Logout
                            </button>

                        </div>

                    </div>


                    {/* ========================================
                        MAIN CONTENT
                    ======================================== */}

                    <div className="profile-content">


                        {/* ACCOUNT INFO */}
                        <div className="profile-details">

                            <h2>Account Information</h2>

                            <div className="detail-row">
                                <label>Name</label>
                                <span>{user.name}</span>
                            </div>

                            <div className="detail-row">
                                <label>Email</label>
                                <span>{user.email}</span>
                            </div>

                            <div className="detail-row">
                                <label>Phone</label>
                                <span>{user.phone || "Not provided"}</span>
                            </div>

                            <div className="detail-row">
                                <label>Role</label>
                                <span className="role-badge">
                                    {(user.role || "user").toUpperCase()}
                                </span>
                            </div>

                            <div className="detail-row">
                                <label>Member Since</label>
                                <span>{new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</span>
                            </div>

                        </div>


                        {/* QUICK ACTIONS */}
                        <div className="quick-actions">

                            <h2>Quick Actions</h2>

                            <div className="action-buttons">

                                <button
                                    className="action-btn"
                                    onClick={() => navigate("/products")}
                                    id="profile-shop"
                                >
                                    🛍️ Continue Shopping
                                </button>

                                <button
                                    className="action-btn"
                                    onClick={() => navigate("/cart")}
                                    id="profile-cart"
                                >
                                    🛒 View Cart
                                </button>

                                <button
                                    className="action-btn orders"
                                    onClick={() => navigate("/orders")}
                                    id="profile-orders"
                                >
                                    📦 Order History
                                </button>

                                <button
                                    className="action-btn"
                                    onClick={() => navigate("/checkout")}
                                    id="profile-checkout"
                                >
                                    💳 Checkout
                                </button>

                            </div>

                        </div>


                        {/* HELPFUL LINKS */}
                        <div className="helpful-links">

                            <h2>Need Help?</h2>

                            <ul>
                                <li>
                                    <Link to="/orders">How to track your order</Link>
                                </li>
                                <li>
                                    <Link to="/products">Browse all products</Link>
                                </li>
                                <li>
                                    <a href="mailto:support@flipkart.com">Contact Support</a>
                                </li>
                                <li>
                                    <Link to="/">Return & Refund Policy</Link>
                                </li>
                                <li>
                                    <Link to="/">Privacy Policy</Link>
                                </li>
                            </ul>

                        </div>

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}


export default Profile;
