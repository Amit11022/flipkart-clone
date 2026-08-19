import api from "./api";


// ========================================
// PLACE ORDER
// ========================================

export const placeOrder = async (orderData) => {

    const response = await api.post(
        "/orders",
        orderData
    );

    return response.data;
};


// ========================================
// GET MY ORDERS
// ========================================

export const getMyOrders = async () => {

    const response = await api.get(
        "/orders/my"
    );

    return response.data;
};


// ========================================
// GET ORDER BY ID
// ========================================

export const getOrderById = async (orderId) => {

    const response = await api.get(
        `/orders/${orderId}`
    );

    return response.data;
};
