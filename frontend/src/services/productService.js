import api from "./api";


// ========================================
// GET ALL PRODUCTS
// ========================================

export const getProducts = async (params = {}) => {

    const response = await api.get(
        "/products",
        {
            params
        }
    );

    return response.data;
};


// ========================================
// GET SINGLE PRODUCT
// ========================================

export const getProductById = async (id) => {

    const response = await api.get(
        `/products/${id}`
    );

    return response.data;
};