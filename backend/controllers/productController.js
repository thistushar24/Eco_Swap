const Product = require('../models/Product');
const { validationResult } = require('express-validator');

class ProductController {
  // Create new product
  static async createProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const productData = {
        ...req.body,
        seller_id: req.user.userId
      };

      const productId = await Product.create(productData);
      const product = await Product.findById(productId);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product }
      });

    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get all products with filters
  static async getProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        min_price,
        max_price,
        search,
        seller_id
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const filters = {};

      if (category) filters.category = category;
      if (min_price) filters.min_price = parseFloat(min_price);
      if (max_price) filters.max_price = parseFloat(max_price);
      if (search) filters.search = search;
      if (seller_id) filters.seller_id = seller_id;

      const products = await Product.findAll(filters, parseInt(limit), offset);

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            hasMore: products.length === parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single product by ID
  static async getProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: { product }
      });

    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update product
  static async updateProduct(req, res) {
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
      const updateData = req.body;

      // Only allow seller to update their own products
      const updated = await Product.updateById(id, updateData, req.user.userId);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Product not found or you do not have permission to update it'
        });
      }

      const product = await Product.findById(id);

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: { product }
      });

    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete product (soft delete)
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      // Only allow seller to delete their own products
      const deleted = await Product.deleteById(id, req.user.userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Product not found or you do not have permission to delete it'
        });
      }

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });

    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get products by category
  static async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { limit = 10 } = req.query;

      const products = await Product.getByCategory(category, parseInt(limit));

      res.json({
        success: true,
        data: { products }
      });

    } catch (error) {
      console.error('Get products by category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get all categories
  static async getCategories(req, res) {
    try {
      const categories = await Product.getCategories();

      res.json({
        success: true,
        data: { categories }
      });

    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get product statistics
  static async getProductStats(req, res) {
    try {
      const stats = await Product.getProductStats();

      res.json({
        success: true,
        data: { stats }
      });

    } catch (error) {
      console.error('Get product stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get seller's products
  static async getSellerProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 20
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const filters = { seller_id: req.user.userId };

      const products = await Product.findAll(filters, parseInt(limit), offset);

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            hasMore: products.length === parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Get seller products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = ProductController;