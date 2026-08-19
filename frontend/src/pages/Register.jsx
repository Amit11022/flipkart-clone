import { useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    registerUser
} from "../services/authService";



function Register() {

    const navigate = useNavigate();


    // ========================================
    // FORM STATE
    // ========================================

    const [formData, setFormData] = useState({

        name: "",

        email: "",

        password: ""

    });


    // ========================================
    // UI STATE
    // ========================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ========================================
    // HANDLE INPUT CHANGE
    // ========================================

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });

    };


    // ========================================
    // REGISTER USER
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // Clear previous messages

        setError("");

        setSuccess("");


        // Start loading

        setLoading(true);


        try {

            // Send registration request

            const data =
                await registerUser(
                    formData
                );


            console.log(
                "Register response:",
                data
            );


            // ========================================
            // SUCCESS
            // ========================================

            setSuccess(
                data.message ||
                "Registration successful!"
            );


            // ========================================
            // IMPORTANT
            // ========================================
            //
            // We are NOT storing token/user here.
            //
            // authService.js should handle
            // authentication storage.
            //
            // If your backend automatically logs
            // the user in after registration and
            // returns a token, we can update
            // authService.js to store it.
            //
            // ========================================


            // Redirect to login

            setTimeout(() => {

                navigate("/login");

            }, 1000);


        } catch (error) {

            console.log(
                "Register error:",
                error
            );


            // Backend error message

            setError(

                error.response?.data?.message ||

                "Registration failed"

            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* ========================================
                    TITLE
                ======================================== */}

                <h1>
                    Create Account
                </h1>


                <p className="auth-subtitle">
                    Join Flipkart Clone
                </p>


                {/* ========================================
                    ERROR
                ======================================== */}

                {error && (

                    <div className="auth-error">

                        {error}

                    </div>

                )}


                {/* ========================================
                    SUCCESS
                ======================================== */}

                {success && (

                    <div className="auth-success">

                        {success}

                    </div>

                )}


                {/* ========================================
                    REGISTER FORM
                ======================================== */}

                <form
                    onSubmit={handleSubmit}
                >


                    {/* ========================================
                        NAME
                    ======================================== */}

                    <div className="form-group">

                        <label>
                            Name
                        </label>


                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* ========================================
                        EMAIL
                    ======================================== */}

                    <div className="form-group">

                        <label>
                            Email
                        </label>


                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* ========================================
                        PASSWORD
                    ======================================== */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>


                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={6}
                            required
                        />

                    </div>


                    {/* ========================================
                        REGISTER BUTTON
                    ======================================== */}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >

                        {loading

                            ? "Creating account..."

                            : "Register"

                        }

                    </button>


                </form>


                {/* ========================================
                    LOGIN LINK
                ======================================== */}

                <p className="auth-footer">

                    Already have an account?

                    {" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>


            </div>
        </div>
    );

}


export default Register;