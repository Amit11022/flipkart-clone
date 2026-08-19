const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");


// Protected profile route
router.get("/profile", protect, (req, res) => {

    res.json({
        success: true,
        message: "You are authorized",
        user: req.user
    });

});


module.exports = router;