const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

// Configure storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable
const upload = multer({ storage: storage });

router.post('/add-product/:firmId', upload.single('image'), productController.addProduct);
router.get('/:firmId/products',productController.getProductByFirm);
router.delete('/:productId', productController.deleteProductById);

module.exports = router;
