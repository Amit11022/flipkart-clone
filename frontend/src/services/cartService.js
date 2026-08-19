import api from "./api";


// ========================================
// GET CART
// ========================================

export const getCart = async () => {

    const response = await api.get(
        "/cart"
    );

    return response.data;
};


// ========================================
// ADD TO CART
// ========================================

export const addToCart = async (
    productId,
    quantity
) => {

    const response = await api.post(
        "/cart",
        {
            productId,
            quantity
        }
    );

    return response.data;
};


// ========================================
// UPDATE CART
// ========================================

export const updateCartItem = async (
    productId,
    quantity
) => {

    const response = await api.put(
        "/cart",
        {
            productId,
            quantity
        }
    );

    return response.data;
};


// ========================================
// REMOVE ITEM
// ========================================

export const removeFromCart = async (
    productId
) => {

    const response = await api.delete(
        `/cart/${productId}`
    );

    return response.data;
};


// ========================================
// CLEAR CART
// ========================================

export const clearCart = async () => {

    const response = await api.delete(
        "/cart"
    );

    return response.data;
};