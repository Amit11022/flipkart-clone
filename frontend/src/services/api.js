import axios from "axios";


// ========================================
// AXIOS API INSTANCE
// ========================================

const api = axios.create({

    // Backend API base URL
    baseURL: "http://localhost:5000/api",

    // Request timeout
    timeout: 10000

});


// ========================================
// REQUEST INTERCEPTOR
// ========================================
//
// Automatically adds JWT token to requests
// when the user is logged in.
//
// Example:
// Authorization: Bearer YOUR_TOKEN
//
// ========================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


// ========================================
// RESPONSE INTERCEPTOR
// ========================================
//
// Handles authentication errors globally.
//
// If backend returns 401, the token is removed.
// The user can then log in again.
//
// ========================================

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        if (
            error.response &&
            error.response.status === 401
        ) {
            try {
                const storedUser = localStorage.getItem("user");
                const userObj = storedUser ? JSON.parse(storedUser) : null;
                if (userObj && userObj._id) {
                    localStorage.removeItem(`mock_orders_${userObj._id}`);
                }
            } catch (e) {
                console.error(e);
            }
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("mock_orders");
        }

        return Promise.reject(error);

    }

);


// ========================================
// GET ALL PRODUCTS
// ========================================
//
// Supports:
// - search
// - category
// - brand
// - minPrice
// - maxPrice
// - sort
// - page
// - limit
//
// Example:
//
// getProducts({
//     search: "Samsung",
//     category: "Mobiles",
//     sort: "low",
//     page: 1,
//     limit: 10
// });
//
// ========================================

export const getProducts = async (
    params = {}
) => {

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

export const getProductById = async (
    id
) => {

    const response = await api.get(

        `/products/${id}`

    );

    return response.data;

};


// ========================================
// DEFAULT EXPORT
// ========================================
//
// Used by other services:
//
// import api from "./api";
//
// ========================================

export default api;