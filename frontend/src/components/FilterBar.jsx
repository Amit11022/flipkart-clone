import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function FilterBar({
    onFilterChange,
    brands = [],
    categories = []
}) {
    const [searchParams] = useSearchParams();
    const [expandedFilter, setExpandedFilter] = useState(null);

    const handleBrandFilter = (brand) => {
        const params = new URLSearchParams(searchParams);
        if (params.get("brand") === brand) {
            params.delete("brand");
        } else {
            params.set("brand", brand);
        }
        onFilterChange(params.toString());
    };

    const handleCategoryFilter = (category) => {
        const params = new URLSearchParams(searchParams);
        if (params.get("category") === category) {
            params.delete("category");
        } else {
            params.set("category", category);
        }
        onFilterChange(params.toString());
    };

    const handlePriceFilter = (min, max) => {
        const params = new URLSearchParams(searchParams);
        if (min) params.set("minPrice", min);
        if (max) params.set("maxPrice", max);
        onFilterChange(params.toString());
    };

    const handleSortChange = (sort) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", sort);
        onFilterChange(params.toString());
    };

    const clearFilters = () => {
        onFilterChange("");
    };

    return (
        <div className="filter-bar">
            {/* ======================================== 
                SORT OPTIONS
            ======================================== */}
            <div className="filter-section">
                <h4>Sort By</h4>
                <div className="filter-options">
                    <button 
                        className={`filter-option ${searchParams.get("sort") === "latest" ? "active" : ""}`}
                        onClick={() => handleSortChange("latest")}
                    >
                        Latest
                    </button>
                    <button 
                        className={`filter-option ${searchParams.get("sort") === "price_asc" ? "active" : ""}`}
                        onClick={() => handleSortChange("price_asc")}
                    >
                        Price: Low to High
                    </button>
                    <button 
                        className={`filter-option ${searchParams.get("sort") === "price_desc" ? "active" : ""}`}
                        onClick={() => handleSortChange("price_desc")}
                    >
                        Price: High to Low
                    </button>
                </div>
            </div>

            {/* ======================================== 
                PRICE FILTER
            ======================================== */}
            <div className="filter-section">
                <h4>Price Range</h4>
                <div className="price-filter">
                    <div className="price-input">
                        <label>Min:</label>
                        <input 
                            type="number" 
                            placeholder="0"
                            onChange={(e) => handlePriceFilter(e.target.value, searchParams.get("maxPrice"))}
                        />
                    </div>
                    <div className="price-input">
                        <label>Max:</label>
                        <input 
                            type="number" 
                            placeholder="100000"
                            onChange={(e) => handlePriceFilter(searchParams.get("minPrice"), e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* ======================================== 
                CLEAR FILTERS
            ======================================== */}
            {searchParams.toString() && (
                <button 
                    className="clear-filters-btn"
                    onClick={clearFilters}
                >
                    ✕ Clear Filters
                </button>
            )}
        </div>
    );
}

export default FilterBar;
