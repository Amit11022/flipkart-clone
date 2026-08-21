import api from "./api";


// ========================================
// REGISTER USER
// ========================================
//
// Sends registration data to backend.
//
// Example:
//
// {
//     name: "Amit",
//     email: "amit@gmail.com",
//     password: "123456"
// }
//
// ========================================

export const registerUser = async (userData) => {

    const response = await api.post(

        "/auth/register",

        userData

    );

    return response.data;
};


// ========================================
// LOGIN USER
// ========================================
//
// Sends login credentials to backend.
//
// Backend should return something like:
//
// {
//     success: true,
//     token: "...",
//     user: {...}
// }
//
// ========================================

export const loginUser = async (userData) => {

    const response = await api.post(

        "/auth/login",

        userData

    );


    const data = response.data;


    // ========================================
    // SAVE LOGIN INFORMATION
    // ========================================
    //
    // Save JWT token so api.js can automatically
    // attach it to protected requests.
    //
    // ========================================

    if (data.token) {

        localStorage.setItem(
            "token",
            data.token
        );

    }


    // ========================================
    // SAVE USER
    // ========================================
    //
    // Useful for Navbar:
    //
    // Welcome Amit
    //
    // and checking logged-in user information.
    //
    // ========================================

    if (data.user) {

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

    }


    return data;
};


// ========================================
// LOGOUT USER
// ========================================
//
// Removes authentication information
// from browser localStorage.
//
// ========================================

export const logoutUser = () => {
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
};