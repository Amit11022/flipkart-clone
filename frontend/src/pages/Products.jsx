import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar     from "../components/Navbar";
import Footer     from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";


// ========================================
// CONSTANTS
// ========================================

const CATEGORIES = [
    "Mobiles", "Laptops", "TV", "Electronics",
    "Fashion", "Home", "Appliances", "Beauty", "Grocery"
];

const BRANDS = [
    "Samsung", "Apple", "OnePlus", "Xiaomi", "Sony",
    "LG", "HP", "Dell", "Nike", "Adidas"
];

const PRICE_RANGES = [
    { label: "Under ₹500",       min: 0,     max: 500   },
    { label: "₹500 – ₹2,000",   min: 500,   max: 2000  },
    { label: "₹2,000 – ₹10,000", min: 2000,  max: 10000 },
    { label: "₹10,000 – ₹30,000",min: 10000, max: 30000 },
    { label: "Above ₹30,000",    min: 30000, max: 9999999}
];

const SORT_OPTIONS = [
    { value: "",        label: "Relevance" },
    { value: "low",     label: "Price: Low to High" },
    { value: "high",    label: "Price: High to Low" },
    { value: "newest",  label: "Newest First" },
    { value: "rating",  label: "Highest Rating" }
];


// ========================================
// PRODUCTS PAGE
// ========================================

function Products() {

    const [searchParams, setSearchParams] = useSearchParams();

    const [products,   setProducts]   = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Sidebar collapse on mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Filter state
    const [search,   setSearch]   = useState(searchParams.get("search")   || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [brand,    setBrand]    = useState(searchParams.get("brand")    || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [sort,     setSort]     = useState(searchParams.get("sort")     || "");
    const [page,     setPage]     = useState(Number(searchParams.get("page")) || 1);
    const [ratings,  setRatings]  = useState(searchParams.get("rating")  || "");

    // Selected price range for radio UX
    const [selectedRange, setSelectedRange] = useState("");


    // ========================================
    // SYNC URL → STATE
    // ========================================

    useEffect(() => {
        setSearch(searchParams.get("search")   || "");
        setCategory(searchParams.get("category") || "");
        setBrand(searchParams.get("brand")    || "");
        setMinPrice(searchParams.get("minPrice") || "");
        setMaxPrice(searchParams.get("maxPrice") || "");
        setSort(searchParams.get("sort")     || "");
        setPage(Number(searchParams.get("page")) || 1);
        setRatings(searchParams.get("rating")  || "");
    }, [searchParams]);


    // ========================================
    // GET PRODUCTS
    // ========================================

    useEffect(() => {

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const params = { page, limit: 16 };
                if (search.trim())   params.search   = search.trim();
                if (category)        params.category = category;
                if (brand.trim())    params.brand    = brand.trim();
                if (minPrice)        params.minPrice = minPrice;
                if (maxPrice)        params.maxPrice = maxPrice;
                if (sort)            params.sort     = sort;
                if (ratings)         params.rating   = ratings;

                const data = await getProducts(params);
                setProducts(data.products   || []);
                setTotalPages(data.totalPages || 1);
                setTotalItems(data.total      || data.products?.length || 0);

            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Unable to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

    }, [search, category, brand, minPrice, maxPrice, sort, page, ratings]);


    // ========================================
    // UPDATE URL (single source of truth)
    // ========================================

    const updateURL = (newValues = {}) => {
        const params = new URLSearchParams();
        const v = {
            search:   newValues.search   ?? search,
            category: newValues.category ?? category,
            brand:    newValues.brand    ?? brand,
            minPrice: newValues.minPrice ?? minPrice,
            maxPrice: newValues.maxPrice ?? maxPrice,
            sort:     newValues.sort     ?? sort,
            page:     newValues.page     ?? "1",
            rating:   newValues.rating   ?? ratings
        };
        if (v.search.trim())   params.set("search",   v.search.trim());
        if (v.category)        params.set("category", v.category);
        if (v.brand.trim())    params.set("brand",    v.brand.trim());
        if (v.minPrice)        params.set("minPrice", v.minPrice);
        if (v.maxPrice)        params.set("maxPrice", v.maxPrice);
        if (v.sort)            params.set("sort",     v.sort);
        if (v.page !== "1")    params.set("page",     v.page);
        if (v.rating)          params.set("rating",   v.rating);
        setSearchParams(params);
    };


    // ========================================
    // HANDLERS
    // ========================================

    const handleSearch = (e) => {
        e.preventDefault();
        updateURL({ search, page: "1" });
    };

    const handleCategory = (cat) => {
        const next = cat === category ? "" : cat;
        setCategory(next);
        updateURL({ category: next, page: "1" });
    };

    const handlePriceRange = (range) => {
        if (selectedRange === range.label) {
            setSelectedRange("");
            setMinPrice("");
            setMaxPrice("");
            updateURL({ minPrice: "", maxPrice: "", page: "1" });
        } else {
            setSelectedRange(range.label);
            setMinPrice(String(range.min));
            setMaxPrice(String(range.max));
            updateURL({ minPrice: String(range.min), maxPrice: String(range.max), page: "1" });
        }
    };

    const handleRating = (r) => {
        const next = ratings === String(r) ? "" : String(r);
        setRatings(next);
        updateURL({ rating: next, page: "1" });
    };

    const handleSort = (e) => {
        const val = e.target.value;
        setSort(val);
        updateURL({ sort: val, page: "1" });
    };

    const handleReset = () => {
        setSearch(""); setCategory(""); setBrand("");
        setMinPrice(""); setMaxPrice(""); setSort("");
        setRatings(""); setSelectedRange(""); setPage(1);
        setSearchParams(new URLSearchParams());
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
        updateURL({ page: String(newPage) });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const activeFilters = [
        category && { key: "category", label: category, clear: () => handleCategory(category) },
        brand    && { key: "brand",    label: `Brand: ${brand}`,  clear: () => { setBrand(""); updateURL({ brand: "", page: "1" }); } },
        selectedRange && { key: "price", label: selectedRange, clear: () => handlePriceRange(PRICE_RANGES.find(r => r.label === selectedRange)) },
        ratings  && { key: "rating",   label: `${ratings}★ & up`, clear: () => handleRating(ratings) }
    ].filter(Boolean);


    // ========================================
    // RENDER
    // ========================================

    return (
        <>
            <Navbar />

            <main className="products-page">

                {/* ========================================
                    FILTER SIDEBAR
                ======================================== */}

                <aside className={`filter-sidebar ${sidebarOpen ? "open" : ""}`}>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3>Filters</h3>
                        {activeFilters.length > 0 && (
                            <button
                                className="clear-filters-button"
                                style={{ width: "auto", padding: "4px 12px", fontSize: "12px" }}
                                onClick={handleReset}
                            >
                                Clear All
                            </button>
                        )}
                    </div>


                    {/* CATEGORY */}
                    <div className="filter-section">
                        <h4>Category</h4>
                        {CATEGORIES.map(cat => (
                            <label key={cat}>
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat}
                                    checked={category === cat}
                                    onChange={() => handleCategory(cat)}
                                />
                                {cat}
                            </label>
                        ))}
                    </div>


                    {/* PRICE RANGE */}
                    <div className="filter-section">
                        <h4>Price Range</h4>
                        {PRICE_RANGES.map(range => (
                            <label key={range.label}>
                                <input
                                    type="radio"
                                    name="priceRange"
                                    checked={selectedRange === range.label}
                                    onChange={() => handlePriceRange(range)}
                                />
                                {range.label}
                            </label>
                        ))}
                    </div>


                    {/* RATINGS */}
                    <div className="filter-section">
                        <h4>Customer Rating</h4>
                        {[4, 3, 2].map(r => (
                            <label key={r}>
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={ratings === String(r)}
                                    onChange={() => handleRating(r)}
                                />
                                {"⭐".repeat(r)} {r}★ & above
                            </label>
                        ))}
                    </div>


                    {/* BRAND */}
                    <div className="filter-section">
                        <h4>Brand</h4>
                        {BRANDS.map(b => (
                            <label key={b}>
                                <input
                                    type="checkbox"
                                    checked={brand === b}
                                    onChange={() => {
                                        const next = brand === b ? "" : b;
                                        setBrand(next);
                                        updateURL({ brand: next, page: "1" });
                                    }}
                                />
                                {b}
                            </label>
                        ))}
                    </div>

                </aside>


                {/* ========================================
                    MAIN PRODUCTS AREA
                ======================================== */}

                <div className="products-main">


                    {/* TOP BAR */}
                    <div className="products-header">

                        {/* Search */}
                        <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px", flex: 1, maxWidth: "420px" }}>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search within results..."
                                className="sort-select"
                                style={{ flex: 1 }}
                                id="products-search"
                            />
                            <button
                                type="submit"
                                className="view-all-button"
                                style={{ padding: "8px 16px", whiteSpace: "nowrap" }}
                            >
                                Search
                            </button>
                        </form>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                            {!loading && (
                                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                                    {products.length} products
                                </span>
                            )}

                            {/* Mobile filter toggle */}
                            <button
                                className="view-all-button"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                style={{
                                    display:    "none",
                                    padding:    "8px 14px",
                                    fontSize:   "13px"
                                }}
                                id="mobile-filter-btn"
                            >
                                🔧 Filters
                            </button>

                            {/* Sort */}
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "13px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>Sort:</span>
                                <select
                                    className="sort-select"
                                    value={sort}
                                    onChange={handleSort}
                                    id="sort-select"
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>


                    {/* ACTIVE FILTER CHIPS */}
                    {activeFilters.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
                            {activeFilters.map(f => (
                                <span
                                    key={f.key}
                                    style={{
                                        display:       "inline-flex",
                                        alignItems:    "center",
                                        gap:           "6px",
                                        background:    "var(--fk-blue-light)",
                                        color:         "var(--fk-blue)",
                                        border:        "1.5px solid var(--fk-blue)",
                                        borderRadius:  "var(--radius-full)",
                                        padding:       "4px 12px",
                                        fontSize:      "13px",
                                        fontWeight:    "600"
                                    }}
                                >
                                    {f.label}
                                    <button
                                        onClick={f.clear}
                                        style={{
                                            background: "none",
                                            border:     "none",
                                            color:      "var(--fk-blue)",
                                            fontSize:   "16px",
                                            cursor:     "pointer",
                                            lineHeight: "1",
                                            padding:    "0"
                                        }}
                                        aria-label={`Remove ${f.label} filter`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}


                    {/* LOADING */}
                    {loading && <div className="loading">Loading products...</div>}


                    {/* ERROR */}
                    {!loading && error && <div className="error">{error}</div>}


                    {/* EMPTY */}
                    {!loading && !error && products.length === 0 && (
                        <div className="no-products">
                            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                            <h2>No products found</h2>
                            <p>Try adjusting your search or removing some filters.</p>
                            <button
                                className="view-all-button"
                                onClick={handleReset}
                                style={{ marginTop: "16px" }}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}


                    {/* PRODUCT GRID */}
                    {!loading && !error && products.length > 0 && (
                        <div className="products-grid">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}


                    {/* PAGINATION */}
                    {!loading && !error && totalPages > 1 && (
                        <div className="pagination">

                            <button
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                                id="prev-page-btn"
                            >
                                ← Prev
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let p;
                                if (totalPages <= 5) {
                                    p = i + 1;
                                } else if (page <= 3) {
                                    p = i + 1;
                                } else if (page >= totalPages - 2) {
                                    p = totalPages - 4 + i;
                                } else {
                                    p = page - 2 + i;
                                }
                                return (
                                    <button
                                        key={p}
                                        className={page === p ? "active" : ""}
                                        onClick={() => handlePageChange(p)}
                                        id={`page-btn-${p}`}
                                    >
                                        {p}
                                    </button>
                                );
                            })}

                            <button
                                disabled={page === totalPages}
                                onClick={() => handlePageChange(page + 1)}
                                id="next-page-btn"
                            >
                                Next →
                            </button>

                        </div>
                    )}

                </div>

            </main>

            <Footer />
        </>
    );
}


export default Products;