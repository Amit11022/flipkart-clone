import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../services/authService";


function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [user,   setUser]   = useState(null);
    const [search, setSearch] = useState("");


    // ========================================
    // SYNC USER FROM LOCALSTORAGE
    // ========================================

    useEffect(() => {

        const storedUser = localStorage.getItem("user");
        const token      = localStorage.getItem("token");

        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setUser(null);
            }
        } else {
            setUser(null);
        }

    }, [location]);


    // ========================================
    // SEARCH
    // ========================================

    const handleSearch = (e) => {
        e.preventDefault();
        const value = search.trim();
        if (!value) {
            navigate("/products");
            return;
        }
        navigate(`/products?search=${encodeURIComponent(value)}`);
    };


    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = () => {
        logoutUser();
        setUser(null);
        navigate("/login");
    };


    // ========================================
    // RENDER
    // ========================================

    return (
        <header className="navbar">

            {/* LEFT */}
            <div className="navbar-left">

                <Link to="/" className="navbar-logo" aria-label="Flipkart home">
                    lipkart
                </Link>

                <Link to="/products" className="navbar-link">
                    Products
                </Link>

            </div>


            {/* SEARCH */}
            <form className="navbar-search" onSubmit={handleSearch} role="search">
                <input
                    type="text"
                    placeholder="Search for products, brands and more..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search products"
                />
                <button type="submit" aria-label="Submit search">🔍</button>
            </form>


            {/* RIGHT SIDE */}
            <div className="navbar-right">

                {user ? (
                    <>
                        <Link to="/profile" className="navbar-user" title={user.name}>
                            👤 {user.name.split(" ")[0]}
                        </Link>

                        <Link to="/orders" className="navbar-orders">
                            📦 Orders
                        </Link>

                        <Link to="/cart" className="navbar-cart">
                            🛒 Cart
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="logout-button"
                            aria-label="Logout"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login"    className="login-button">Login</Link>
                        <Link to="/register" className="register-button">Register</Link>
                    </>
                )}

            </div>

        </header>
    );
}


export default Navbar;