import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";



// ========================================
// LOGIN PAGE
// ========================================
//
// Features:
//
// ✅ Email input
// ✅ Password input
// ✅ Form validation
// ✅ Login API request
// ✅ Loading state
// ✅ Error handling
// ✅ JWT authentication
// ✅ Redirect after successful login
//
// Authentication storage is handled inside
// authService.js.
//
// ========================================

function Login() {

    // ========================================
    // NAVIGATION
    // ========================================

    const navigate = useNavigate();


    // ========================================
    // FORM STATE
    // ========================================

    const [formData, setFormData] = useState({

        email: "",

        password: ""

    });


    // ========================================
    // UI STATE
    // ========================================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // ========================================
    // HANDLE INPUT CHANGE
    // ========================================
    //
    // Updates the corresponding field
    // whenever the user types.
    //
    // Example:
    //
    // email    -> formData.email
    // password -> formData.password
    //
    // ========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((previousData) => ({

            ...previousData,

            [name]: value

        }));

    };


    // ========================================
    // HANDLE LOGIN
    // ========================================

    const handleSubmit = async (e) => {

        // Prevent normal browser form submission

        e.preventDefault();


        // Clear previous error

        setError("");


        // Start loading

        setLoading(true);


        try {

            // ========================================
            // CALL LOGIN API
            // ========================================

            const data =
                await loginUser(formData);


            console.log(
                "Login response:",
                data
            );


            // ========================================
            // CHECK LOGIN RESPONSE
            // ========================================
            //
            // authService.js already saves:
            //
            // token -> localStorage
            // user  -> localStorage
            //
            // Therefore we do NOT save them again here.
            //
            // ========================================

            if (!data?.token) {

                throw new Error(
                    "Login successful but token was not received"
                );

            }


            // ========================================
            // LOGIN SUCCESS
            // ========================================
            //
            // Redirect the user to the home page.
            //
            // ========================================

            navigate("/");


        } catch (error) {

            console.log(
                "Login error:",
                error
            );


            // ========================================
            // SHOW BACKEND ERROR
            // ========================================
            //
            // If backend sends:
            //
            // {
            //     message: "Invalid email or password"
            // }
            //
            // that message will be displayed.
            //
            // ========================================

            setError(

                error.response?.data?.message ||

                error.message ||

                "Login failed. Please try again."

            );


        } finally {

            // Stop loading

            setLoading(false);

        }

    };


    // ========================================
    // RENDER
    // ========================================

    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* ========================================
                    TITLE
                ======================================== */}

                <h1>
                    Login
                </h1>


                <p className="auth-subtitle">

                    Login to your Flipkart account

                </p>


                {/* ========================================
                    ERROR MESSAGE
                ======================================== */}

                {error && (

                    <div
                        className="auth-error"
                        role="alert"
                    >

                        {error}

                    </div>

                )}


                {/* ========================================
                    LOGIN FORM
                ======================================== */}

                <form
                    onSubmit={handleSubmit}
                >


                    {/* ========================================
                        EMAIL
                    ======================================== */}

                    <div className="form-group">

                        <label htmlFor="email">

                            Email

                        </label>


                        <input
                            id="email"

                            type="email"

                            name="email"

                            placeholder="Enter your email"

                            value={formData.email}

                            onChange={handleChange}

                            autoComplete="email"

                            required

                        />

                    </div>


                    {/* ========================================
                        PASSWORD
                    ======================================== */}

                    <div className="form-group">

                        <label htmlFor="password">

                            Password

                        </label>


                        <input
                            id="password"

                            type="password"

                            name="password"

                            placeholder="Enter your password"

                            value={formData.password}

                            onChange={handleChange}

                            autoComplete="current-password"

                            required

                        />

                    </div>


                    {/* ========================================
                        LOGIN BUTTON
                    ======================================== */}

                    <button

                        type="submit"

                        className="auth-button"

                        disabled={loading}

                    >

                        {loading

                            ? "Logging in..."

                            : "Login"

                        }

                    </button>


                </form>


                {/* ========================================
                    REGISTER LINK
                ======================================== */}

                <p className="auth-footer">

                    Don't have an account?

                    {" "}

                    <Link to="/register">

                        Register

                    </Link>

                </p>



            </div>

        </div>

    );
}


export default Login;