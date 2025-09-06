const express = require('express');
const ProductController = require('../controllers/productController');
const { authenticateToken, requireSeller, optionalAuth } = require('../middleware/auth');
const { productValidation, paramValidation, queryValidation } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', queryValidation.pagination, queryValidation.productFilters, ProductController.getProducts);
router.get('/categories', ProductController.getCategories);
router.get('/stats', ProductController.getProductStats);
router.get('/category/:category', paramValidation.category, ProductController.getProductsByCategory);
router.get('/:id', paramValidation.id, ProductController.getProduct);

// Protected routes for sellers
router.post('/', authenticateToken, requireSeller, productValidation.create, ProductController.createProduct);
router.put('/:id', authenticateToken, requireSeller, paramValidation.id, productValidation.update, ProductController.updateProduct);
router.delete('/:id', authenticateToken, requireSeller, paramValidation.id, ProductController.deleteProduct);

// Seller's own products
router.get('/seller/my-products', authenticateToken, requireSeller, queryValidation.pagination, ProductController.getSellerProducts);

module.exports = router;