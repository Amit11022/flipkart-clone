import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import { toast } from "../components/Toast";
import { API_BASE_URL } from "../services/api";


// ========================================
// PRODUCT DETAILS PAGE
// ========================================
//
// Features:
//
// ✅ Get product ID from URL
// ✅ Fetch product from backend
// ✅ Display product information
// ✅ Display product image
// ✅ Display discount
// ✅ Display stock
// ✅ Increase quantity
// ✅ Decrease quantity
// ✅ Add to cart
// ✅ Login protection
// ✅ Buy Now placeholder
// ✅ Product extra details
//
// ========================================


function ProductDetails() {


    // ========================================
    // GET PRODUCT ID FROM URL
    // ========================================

    const {
        id
    } = useParams();


    // ========================================
    // NAVIGATION
    // ========================================

    const navigate =
        useNavigate();


    // ========================================
    // STATE
    // ========================================

    const [
        product,
        setProduct
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        quantity,
        setQuantity
    ] = useState(1);


    // ========================================
    // GET PRODUCT
    // ========================================
    //
    // Uses productService instead of
    // directly calling axios/api.
    //
    // Flow:
    //
    // ProductDetails
    //      ↓
    // productService
    //      ↓
    // api.js
    //      ↓
    // Backend
    //
    // ========================================

    useEffect(() => {


        const fetchProduct = async () => {

            try {

                setLoading(true);

                setError("");


                // ========================================
                // GET PRODUCT FROM API
                // ========================================

                const data =
                    await getProductById(id);


                console.log(
                    "Product:",
                    data
                );


                // ========================================
                // SAVE PRODUCT
                // ========================================

                setProduct(
                    data.product
                );


            } catch (error) {

                console.log(
                    "Product error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Product not found"
                );


            } finally {

                setLoading(false);

            }

        };


        fetchProduct();


    }, [id]);


    // ========================================
    // INCREASE QUANTITY
    // ========================================

    const increaseQuantity = () => {

        if (
            product &&
            quantity < product.stock
        ) {

            setQuantity(
                quantity + 1
            );

        }

    };


    // ========================================
    // DECREASE QUANTITY
    // ========================================

    const decreaseQuantity = () => {

        if (
            quantity > 1
        ) {

            setQuantity(
                quantity - 1
            );

        }

    };


    // ========================================
    // ADD TO CART
    // ========================================

    const handleAddToCart = async () => {

        try {


            // ========================================
            // CHECK LOGIN
            // ========================================

            const token =
                localStorage.getItem("token");


            if (!token) {

                navigate("/login");

                return;

            }


            // ========================================
            // CHECK PRODUCT
            // ========================================

            if (!product) {

                return;

            }


            // ========================================
            // CHECK STOCK
            // ========================================

            if (product.stock <= 0) {
                toast.warning("This product is out of stock");
                return;
            }


            // ========================================
            // ADD PRODUCT TO CART
            // ========================================

            const data =
                await addToCart(

                    product._id,

                    quantity

                );


            console.log(
                "Cart response:",
                data
            );


            toast.success(`✓ ${quantity} item(s) added to cart!`);

        } catch (error) {
            console.log("Add to cart error:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                toast.error("Session expired. Please login again.");
                navigate("/login");
                return;
            }
            toast.error(error.response?.data?.message || "Unable to add to cart");
        }
    };


    // ========================================
    // BUY NOW
    // ========================================

    const handleBuyNow = async () => {


        if (!product) {

            return;

        }


        // ========================================
        // CHECK LOGIN
        // ========================================

        const token =
            localStorage.getItem("token");


        if (!token) {

            navigate("/login");

            return;

        }


        // ========================================
        // CHECK STOCK
        // ========================================

        if (product.stock <= 0) {
            toast.warning("This product is out of stock");
            return;
        }

        try {
            await addToCart(product._id, quantity);
            navigate("/checkout");
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to process. Please try again.");
        }
    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <>

                <Navbar />


                <div className="loading">

                    Loading product...

                </div>

            </>

        );

    }


    // ========================================
    // ERROR
    // ========================================

    if (
        error ||
        !product
    ) {

        return (

            <>

                <Navbar />


                <div className="product-error">


                    <h2>

                        Product not found

                    </h2>


                    <p>

                        {error}

                    </p>


                    <button

                        onClick={() =>
                            navigate("/products")
                        }

                    >

                        Back to Products

                    </button>


                </div>

            </>

        );

    }


    // ========================================
    // PRODUCT IMAGE
    // ========================================

    const imageUrl =

        product.images &&
        product.images.length > 0

            ? `${API_BASE_URL}${product.images[0]}`

            : "https://via.placeholder.com/500";


    // ========================================
    // DISCOUNT PERCENTAGE
    // ========================================

    let discountPercentage = 0;


    if (

        product.discountPrice &&

        product.price &&

        product.discountPrice < product.price

    ) {

        discountPercentage = Math.round(

            (

                (
                    product.price -
                    product.discountPrice
                )

                /

                product.price

            ) * 100

        );

    }


    // ========================================
    // CURRENT PRICE
    // ========================================

    const currentPrice =

        product.discountPrice ||

        product.price;


    // ========================================
    // TOTAL PRICE
    // ========================================

    const totalPrice =

        currentPrice *

        quantity;


    // ========================================
    // RENDER
    // ========================================

    return (

        <>

            {/* NAVBAR */}

            <Navbar />


            <main className="product-details">


                {/* ========================================
                    BACK BUTTON
                ======================================== */}

                <button

                    className="back-button"

                    onClick={() =>
                        navigate(-1)
                    }

                >

                    ← Back

                </button>


                {/* ========================================
                    PRODUCT MAIN SECTION
                ======================================== */}

                <div className="product-details-container">


                    {/* ========================================
                        PRODUCT IMAGE
                    ======================================== */}

                    <div className="product-image-section">


                        <img

                            src={imageUrl}

                            alt={product.name}

                        />


                    </div>


                    {/* ========================================
                        PRODUCT INFORMATION
                    ======================================== */}

                    <div className="product-details-info">


                        {/* PRODUCT NAME */}

                        <h1>

                            {product.name}

                        </h1>


                        {/* BRAND */}

                        <p className="details-brand">

                            Brand:

                            <strong>

                                {" "}

                                {product.brand}

                            </strong>

                        </p>


                        {/* ========================================
                            RATING
                        ======================================== */}

                        <div className="rating">

                            ⭐ {product.rating || 0}


                            <span>

                                {" "}

                                (
                                {product.numReviews || 0}
                                {" "}
                                Reviews
                                )

                            </span>

                        </div>


                        <hr />


                        {/* ========================================
                            PRICE
                        ======================================== */}

                        <div className="product-details-price">


                            <span className="discount-price">

                                ₹
                                {currentPrice.toLocaleString()}

                            </span>


                            {/* ORIGINAL PRICE */}

                            {product.discountPrice && (

                                <>

                                    <span className="original-price">

                                        ₹
                                        {product.price.toLocaleString()}

                                    </span>


                                    {/* DISCOUNT */}

                                    {discountPercentage > 0 && (

                                        <span className="price-discount">

                                            {discountPercentage}%
                                            {" "}
                                            off

                                        </span>

                                    )}

                                </>

                            )}

                        </div>


                        {/* ========================================
                            STOCK
                        ======================================== */}

                        <div

                            className={

                                product.stock > 0

                                    ? "in-stock"

                                    : "out-of-stock"

                            }

                        >

                            {product.stock > 0

                                ? `✓ In Stock (${product.stock} available)`

                                : "✕ Out of Stock"

                            }

                        </div>


                        {/* ========================================
                            DESCRIPTION
                        ======================================== */}

                        <div className="description-section">


                            <h3>

                                Description

                            </h3>


                            <p>

                                {product.description}

                            </p>


                        </div>


                        {/* ========================================
                            QUANTITY
                        ======================================== */}

                        {product.stock > 0 && (

                            <div className="quantity-section">


                                <span>

                                    Quantity:

                                </span>


                                <div className="quantity-control">


                                    {/* DECREASE */}

                                    <button

                                        onClick={
                                            decreaseQuantity
                                        }

                                        disabled={
                                            quantity <= 1
                                        }

                                    >

                                        −

                                    </button>


                                    {/* CURRENT QUANTITY */}

                                    <span>

                                        {quantity}

                                    </span>


                                    {/* INCREASE */}

                                    <button

                                        onClick={
                                            increaseQuantity
                                        }

                                        disabled={
                                            quantity >=
                                            product.stock
                                        }

                                    >

                                        +

                                    </button>


                                </div>


                            </div>

                        )}


                        {/* ========================================
                            TOTAL PRICE
                        ======================================== */}

                        {product.stock > 0 && (

                            <div className="total-price">


                                <span>

                                    Total:

                                </span>


                                <strong>

                                    ₹
                                    {totalPrice.toLocaleString()}

                                </strong>


                            </div>

                        )}


                        {/* ========================================
                            ACTION BUTTONS
                        ======================================== */}

                        <div className="product-actions">


                            {/* ADD TO CART */}

                            <button

                                className="btn-add-cart"

                                onClick={
                                    handleAddToCart
                                }

                                disabled={
                                    product.stock <= 0
                                }

                            >

                                🛒 Add to Cart

                            </button>


                            {/* BUY NOW */}

                            <button

                                className="btn-buy-now"

                                onClick={
                                    handleBuyNow
                                }

                                disabled={
                                    product.stock <= 0
                                }

                            >

                                ⚡ Buy Now

                            </button>


                        </div>


                    </div>

                </div>


                {/* ========================================
                    EXTRA PRODUCT DETAILS
                ======================================== */}

                <div className="product-extra-details">


                    <h2>

                        Product Details

                    </h2>


                    {/* CATEGORY */}

                    <div className="detail-row">


                        <span>

                            Category

                        </span>


                        <strong>

                            {product.category}

                        </strong>


                    </div>


                    {/* BRAND */}

                    <div className="detail-row">


                        <span>

                            Brand

                        </span>


                        <strong>

                            {product.brand}

                        </strong>


                    </div>


                    {/* STOCK */}

                    <div className="detail-row">


                        <span>

                            Available Stock

                        </span>


                        <strong>

                            {product.stock}

                        </strong>


                    </div>


                </div>


            </main>

            <Footer />

        </>

    );

}


export default ProductDetails;