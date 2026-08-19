import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Banner() {

    const navigate = useNavigate();

    const [currentSlide, setCurrentSlide] = useState(0);


    const banners = [
        {
            id:         1,
            image:      "/banner1.jpg",
            fallback:   "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
            title:      "Summer Sale",
            subtitle:   "Get up to 50% off on all products",
            buttonText: "Shop Now",
            bg:         "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)"
        },
        {
            id:         2,
            image:      "/banner2.jpg",
            fallback:   "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80",
            title:      "Mega Electronics Deals",
            subtitle:   "Massive savings on smartphones, laptops & more",
            buttonText: "Explore Deals",
            bg:         "linear-gradient(135deg, #1a237e 0%, #4a148c 100%)"
        },
        {
            id:         3,
            image:      "/banner3.jpg",
            fallback:   "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
            title:      "Fashion Week",
            subtitle:   "Trending styles at unbeatable prices",
            buttonText: "Shop Fashion",
            bg:         "linear-gradient(135deg, #880e4f 0%, #c2185b 100%)"
        },
        {
            id:         4,
            image:      "/banner4.jpg",
            fallback:   "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80",
            title:      "New Arrivals",
            subtitle:   "Explore the freshest collection this season",
            buttonText: "View New",
            bg:         "linear-gradient(135deg, #00695c 0%, #00897b 100%)"
        }
    ];


    // ========================================
    // AUTO-SLIDE
    // ========================================

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);


    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    const goToSlide = (i)  => setCurrentSlide(i);


    // ========================================
    // RENDER
    // ========================================

    return (
        <div className="banner-container">

            <div className="banner-slider">

                {banners.map((banner, index) => (

                    <div
                        key={banner.id}
                        className={`banner-slide ${index === currentSlide ? "active" : ""}`}
                        style={{ background: banner.bg }}
                    >
                        <img
                            src={banner.image}
                            alt={banner.title}
                            className="banner-image"
                            onError={(e) => {
                                e.target.src = banner.fallback;
                            }}
                        />

                        <div className="banner-content">
                            <h2 className="banner-title">{banner.title}</h2>
                            <p className="banner-subtitle">{banner.subtitle}</p>
                            <button
                                className="banner-button"
                                onClick={() => navigate("/products")}
                                id={`banner-btn-${banner.id}`}
                            >
                                {banner.buttonText} →
                            </button>
                        </div>

                    </div>

                ))}

            </div>


            {/* NAVIGATION ARROWS */}
            <button
                className="banner-arrow banner-prev"
                onClick={prevSlide}
                aria-label="Previous slide"
            >
                ‹
            </button>

            <button
                className="banner-arrow banner-next"
                onClick={nextSlide}
                aria-label="Next slide"
            >
                ›
            </button>


            {/* DOTS */}
            <div className="banner-dots">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentSlide ? "active" : ""}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

        </div>
    );
}


export default Banner;
