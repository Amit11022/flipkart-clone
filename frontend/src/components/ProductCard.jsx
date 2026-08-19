import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addToCart } from "../services/cartService";
import { toast } from "./Toast";


// ========================================
// PRODUCT CARD
// ========================================

function ProductCard({ product }) {

    const navigate = useNavigate();

    const [adding, setAdding] = useState(false);


    // ========================================
    // IMAGE
    // ========================================

    const imageUrl =
        product.images && product.images.length > 0
            ? `http://localhost:5000${product.images[0]}`
            : "https://placehold.co/250x250?text=No+Image";


    // ========================================
    // PRICE
    // ========================================

    const sellingPrice = product.discountPrice || product.price;

    const isOutOfStock = product.stock <= 0;

    const discountPercentage = product.discountPrice && product.price
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;


    // ========================================
    // ADD TO CART
    // ========================================

    const handleAddToCart = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        // Check login
        const token = localStorage.getItem("token");
        if (!token) {
            toast.info("Please login to add products to cart");
            navigate("/login", { state: { from: `/products/${product._id}` } });
            return;
        }

        if (isOutOfStock) {
            toast.warning("This product is out of stock");
            return;
        }

        try {
            setAdding(true);
            await addToCart(product._id, 1);
            toast.success("✓ Added to cart!");
        } catch (error) {
            console.log(error);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                toast.error("Session expired. Please login again.");
                navigate("/login");
                return;
            }

            toast.error(error.response?.data?.message || "Unable to add to cart");
        } finally {
            setAdding(false);
        }
    };


    // ========================================
    // RENDER
    // ========================================

    return (

        <div className="product-card">


            {/* DISCOUNT BADGE */}
            {discountPercentage > 0 && (
                <span className="discount-badge">
                    {discountPercentage}% OFF
                </span>
            )}


            {/* IMAGE */}
            <Link to={`/products/${product._id}`}>
                <div className="product-image">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = "https://placehold.co/250x250?text=No+Image";
                        }}
                    />
                </div>
            </Link>


            {/* DETAILS */}
            <div className="product-info">

                {/* NAME */}
                <Link to={`/products/${product._id}`}>
                    <h3>{product.name}</h3>
                </Link>

                {/* BRAND */}
                <p className="product-brand">{product.brand}</p>

                {/* PRICE */}
                <div className="price">
                    <span className="discount-price">
                        ₹{sellingPrice.toLocaleString()}
                    </span>
                    {product.discountPrice && (
                        <>
                            <span className="original-price">
                                ₹{product.price.toLocaleString()}
                            </span>
                            <span className="price-discount">
                                {discountPercentage}% off
                            </span>
                        </>
                    )}
                </div>

                {/* RATING */}
                {(product.rating > 0 || product.numReviews > 0) && (
                    <p className="rating">
                        ⭐ {product.rating || 0}
                        <span className="review-count">
                            ({product.numReviews || 0} reviews)
                        </span>
                    </p>
                )}

                {/* STOCK */}
                <p className={isOutOfStock ? "stock out-of-stock" : "stock"}>
                    {isOutOfStock ? "✕ Out of Stock" : `✓ In Stock (${product.stock})`}
                </p>

                {/* ADD TO CART */}
                <button
                    className="add-to-cart-button"
                    disabled={isOutOfStock || adding}
                    onClick={handleAddToCart}
                    id={`add-cart-${product._id}`}
                >
                    {adding
                        ? "Adding..."
                        : isOutOfStock
                            ? "Out of Stock"
                            : "🛒 Add to Cart"
                    }
                </button>

            </div>

        </div>

    );
}


export default ProductCard;