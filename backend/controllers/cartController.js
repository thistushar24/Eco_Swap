const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

class CartController {
  // Add item to cart
  static async addToCart(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { product_id, quantity = 1 } = req.body;
      const userId = req.user.userId;

      // Check if product exists and is active
      const product = await Product.findById(product_id);
      if (!product || product.status !== 'active') {
        return res.status(404).json({
          success: false,
          message: 'Product not found or not available'
        });
      }

      // Don't allow sellers to add their own products to cart
      if (product.seller_id === userId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot add your own product to cart'
        });
      }

      const added = await Cart.addItem(userId, product_id, quantity);

      if (!added) {
        return res.status(500).json({
          success: false,
          message: 'Failed to add item to cart'
        });
      }

      // Get updated cart
      const cartItems = await Cart.getCartItems(userId);
      const cartTotal = await Cart.getCartTotal(userId);

      res.json({
        success: true,
        message: 'Item added to cart successfully',
        data: {
          cartItems,
          cartTotal
        }
      });

    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user's cart items
  static async getCart(req, res) {
    try {
      const userId = req.user.userId;
      const cartItems = await Cart.getCartItems(userId);
      const cartTotal = await Cart.getCartTotal(userId);

      res.json({
        success: true,
        data: {
          cartItems,
          cartTotal
        }
      });

    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update item quantity in cart
  static async updateCartItem(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { product_id } = req.params;
      const { quantity } = req.body;
      const userId = req.user.userId;

      if (quantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity cannot be negative'
        });
      }

      const updated = await Cart.updateQuantity(userId, product_id, quantity);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Cart item not found'
        });
      }

      // Get updated cart
      const cartItems = await Cart.getCartItems(userId);
      const cartTotal = await Cart.getCartTotal(userId);

      res.json({
        success: true,
        message: quantity === 0 ? 'Item removed from cart' : 'Cart item updated successfully',
        data: {
          cartItems,
          cartTotal
        }
      });

    } catch (error) {
      console.error('Update cart item error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Remove item from cart
  static async removeFromCart(req, res) {
    try {
      const { product_id } = req.params;
      const userId = req.user.userId;

      const removed = await Cart.removeItem(userId, product_id);

      if (!removed) {
        return res.status(404).json({
          success: false,
          message: 'Cart item not found'
        });
      }

      // Get updated cart
      const cartItems = await Cart.getCartItems(userId);
      const cartTotal = await Cart.getCartTotal(userId);

      res.json({
        success: true,
        message: 'Item removed from cart successfully',
        data: {
          cartItems,
          cartTotal
        }
      });

    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Clear entire cart
  static async clearCart(req, res) {
    try {
      const userId = req.user.userId;
      const cleared = await Cart.clearCart(userId);

      res.json({
        success: true,
        message: 'Cart cleared successfully',
        data: {
          cartItems: [],
          cartTotal: {
            total_items: 0,
            total_quantity: 0,
            total_price: 0
          }
        }
      });

    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get cart item count
  static async getCartCount(req, res) {
    try {
      const userId = req.user.userId;
      const count = await Cart.getItemCount(userId);

      res.json({
        success: true,
        data: { count }
      });

    } catch (error) {
      console.error('Get cart count error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = CartController;