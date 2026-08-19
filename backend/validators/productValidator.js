const { body } = require("express-validator");

const productValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Product description is required"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),

    body("discountPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Discount price must be a positive number"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    body("brand")
        .trim()
        .notEmpty()
        .withMessage("Brand is required"),

    body("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a positive number")
];

module.exports = {
    productValidator
};