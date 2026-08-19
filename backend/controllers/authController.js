const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/User");


// =========================
// REGISTER USER
// =========================

const registerUser = async (req, res) => {

    try {

        // Check validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Get user data from request body
        const { name, email, password, phone } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user in database
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone
        });

        // Send success response
        res.status(201).json({
            success: true,
            message: "User registered successfully",

            // Send user information except password
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        // Handle server/database error
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =========================
// LOGIN USER
// =========================

const loginUser = async (req, res) => {

    try {

        // Check validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Get email and password from request
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // If user does not exist
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        // If password is incorrect
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token after successful login
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                // Token will expire after 7 days
                expiresIn: "7d"
            }
        );

        // Send login success response
        res.status(200).json({
            success: true,
            message: "Login successful",

            // Send JWT token to client
            token,

            // Send user information
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        // Handle server error
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Export register and login functions
module.exports = {registerUser,loginUser};