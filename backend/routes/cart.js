const express = require('express');
const CartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');
const { cartValidation, paramValidation } = require('../middleware/validation');

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Cart management routes
router.get('/', CartController.getCart);
router.get('/count', CartController.getCartCount);
router.post('/add', cartValidation.addToCart, CartController.addToCart);
router.put('/:product_id', cartValidation.updateQuantity, CartController.updateCartItem);
router.delete('/:product_id', paramValidation.id, CartController.removeFromCart);
router.delete('/', CartController.clearCart);

module.exports = router;