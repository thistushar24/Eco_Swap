const express = require('express');
const OrderController = require('../controllers/orderController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { orderValidation, paramValidation, queryValidation } = require('../middleware/validation');

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// User order routes
router.post('/', orderValidation.create, OrderController.createOrder);
router.get('/', queryValidation.pagination, OrderController.getUserOrders);
router.get('/recent', OrderController.getRecentOrders);
router.get('/stats', OrderController.getUserOrderStats);
router.get('/purchase-history', queryValidation.pagination, OrderController.getPurchaseHistory);
router.get('/:id', paramValidation.id, OrderController.getOrder);
router.put('/:id/status', paramValidation.id, orderValidation.updateStatus, OrderController.updateOrderStatus);

// Admin order routes
router.get('/admin/all', requireAdmin, OrderController.getAllOrders);
router.get('/admin/stats', requireAdmin, OrderController.getAllOrderStats);

module.exports = router;