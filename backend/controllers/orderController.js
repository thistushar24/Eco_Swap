const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { validationResult } = require('express-validator');

class OrderController {
  // Create new order from cart
  static async createOrder(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { shipping_address, payment_method } = req.body;
      const userId = req.user.userId;

      // Get cart items
      const cartItems = await Cart.getCartItems(userId);
      if (cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty'
        });
      }

      // Calculate total price
      const total_price = cartItems.reduce((total, item) => total + item.total_price, 0);

      // Prepare products array
      const products = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      // Create order
      const orderId = await Order.create({
        user_id: userId,
        products,
        total_price,
        shipping_address,
        payment_method
      });

      // Clear cart after successful order
      await Cart.clearCart(userId);

      // Get created order details
      const order = await Order.findById(orderId, userId);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: { order }
      });

    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user's orders
  static async getUserOrders(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const userId = req.user.userId;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const orders = await Order.findByUserId(userId, parseInt(limit), offset);

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            hasMore: orders.length === parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Get user orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single order
  static async getOrder(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const order = await Order.findById(id, userId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        data: { order }
      });

    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update order status
  static async updateOrderStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.userId;

      // Buyers can only cancel their own orders
      if (req.user.role !== 'admin' && status !== 'cancelled') {
        return res.status(403).json({
          success: false,
          message: 'Permission denied'
        });
      }

      const updated = await Order.updateStatus(id, status, userId);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or you do not have permission to update it'
        });
      }

      const order = await Order.findById(id, userId);

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: { order }
      });

    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get order statistics for user
  static async getUserOrderStats(req, res) {
    try {
      const userId = req.user.userId;
      const stats = await Order.getOrderStats(userId);

      res.json({
        success: true,
        data: { stats }
      });

    } catch (error) {
      console.error('Get user order stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get recent orders for user
  static async getRecentOrders(req, res) {
    try {
      const { limit = 5 } = req.query;
      const userId = req.user.userId;

      const orders = await Order.getRecentOrders(parseInt(limit), userId);

      res.json({
        success: true,
        data: { orders }
      });

    } catch (error) {
      console.error('Get recent orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user's purchase history (for recommendations)
  static async getPurchaseHistory(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const userId = req.user.userId;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const history = await Order.getUserPurchaseHistory(userId, parseInt(limit), offset);

      res.json({
        success: true,
        data: {
          purchaseHistory: history,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            hasMore: history.length === parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Get purchase history error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Admin: Get all orders
  static async getAllOrders(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { limit = 10 } = req.query;
      const orders = await Order.getRecentOrders(parseInt(limit));

      res.json({
        success: true,
        data: { orders }
      });

    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Admin: Get order statistics
  static async getAllOrderStats(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const stats = await Order.getOrderStats();

      res.json({
        success: true,
        data: { stats }
      });

    } catch (error) {
      console.error('Get all order stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = OrderController;