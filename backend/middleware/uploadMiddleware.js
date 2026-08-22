const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ========================================
// CREATE UPLOAD DIRECTORY
// ========================================

const uploadDirectory = process.env.VERCEL
    ? "/tmp/uploads/products"
    : path.join(__dirname, "../uploads/products");


if (!fs.existsSync(uploadDirectory)) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );
}



// ========================================
// STORAGE
// ========================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadDirectory);
    },


    filename: (req, file, cb) => {

        const uniqueName =

            Date.now() +

            "-" +

            Math.round(
                Math.random() * 1E9
            ) +

            path.extname(file.originalname);


        cb(null, uniqueName);
    }
});



// ========================================
// FILE FILTER
// ========================================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [

        "image/jpeg",

        "image/jpg",

        "image/png",

        "image/webp"
    ];


    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            ),
            false
        );
    }
};



// ========================================
// MULTER
// ========================================

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024
    }
});



module.exports = upload;