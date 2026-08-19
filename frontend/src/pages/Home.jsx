import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import ProductCard from "../components/ProductCard";

import Banner from "../components/Banner";


function Home() {

    const navigate = useNavigate();


    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================
    // GET PRODUCTS
    // ========================================

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);

                const response =
                    await api.get("/products", {
                        params: {
                            page: 1,
                            limit: 12
                        }
                    });


                console.log(
                    "Products:",
                    response.data
                );


                setProducts(
                    response.data.products || []
                );


            } catch (error) {

                console.log(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load products"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchProducts();

    }, []);


    // ========================================
    // CATEGORY CLICK
    // ========================================

    const handleCategory = (category) => {

        navigate(
            `/products?category=${encodeURIComponent(category)}`
        );

    };


    // ========================================
    // SHOP NOW
    // ========================================

    const handleShopNow = () => {

        navigate("/products");

    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <>

                <Navbar />

                <div className="loading">

                    Loading products...

                </div>

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

                <div className="error">

                    {error}

                </div>

            </>

        );

    }


    // ========================================
    // UI
    // ========================================

    return (

        <>

            <Navbar />


            <main className="home-container">


                {/* ========================================
                    CATEGORY BAR
                ======================================== */}

                <div className="category-bar">


                    <button
                        onClick={() =>
                            handleCategory("Mobiles")
                        }
                    >
                        📱 Mobiles
                    </button>


                    <button
                        onClick={() =>
                            handleCategory("Fashion")
                        }
                    >
                        👕 Fashion
                    </button>


                    <button
                        onClick={() =>
                            handleCategory("Electronics")
                        }
                    >
                        💻 Electronics
                    </button>


                    <button
                        onClick={() =>
                            handleCategory("Home")
                        }
                    >
                        🏠 Home
                    </button>


                    <button
                        onClick={() =>
                            handleCategory("Appliances")
                        }
                    >
                        🔌 Appliances
                    </button>


                    <button
                        onClick={() =>
                            handleCategory("Beauty")
                        }
                    >
                        💄 Beauty
                    </button>


                    <button
                        onClick={() =>
                            handleCategory("Grocery")
                        }
                    >
                        🛒 Grocery
                    </button>

                </div>


                {/* ========================================
                    BANNER SLIDER
                ======================================== */}

                <Banner />


                {/* ========================================
                    PRODUCTS
                ======================================== */}

                <section className="products-section">

                    <div className="section-header">

                        <h2>
                            Popular Products
                        </h2>


                        <button
                            className="view-all-button"
                            onClick={handleShopNow}
                        >
                            View All →
                        </button>

                    </div>


                    {products.length === 0 ? (

                        <div className="no-products">

                            <h2>
                                No products available
                            </h2>

                        </div>

                    ) : (

                        <div className="product-grid">

                            {products.map(

                                (product) => (

                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                    />

                                )

                            )}

                        </div>

                    )}

                </section>


            </main>

            <Footer />

        </>

    );

}


export default Home;