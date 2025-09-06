const Product = require('../models/Product');
const Order = require('../models/Order');
const recommendationEngine = require('../services/recommendationEngine');

class RecommendationController {
  // Get personalized recommendations for user
  static async getRecommendations(req, res) {
    try {
      const { limit = 10 } = req.query;
      const userId = req.user.userId;

      const recommendations = await Product.getRecommendations(userId, parseInt(limit));

      res.json({
        success: true,
        data: {
          recommendations,
          algorithm: 'category_based_on_purchase_history'
        }
      });

    } catch (error) {
      console.error('Get recommendations error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get recommendations by category
  static async getRecommendationsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { limit = 10, exclude_product_id } = req.query;

      let products = await Product.getByCategory(category, parseInt(limit) + 1);

      // Exclude specific product if provided
      if (exclude_product_id) {
        products = products.filter(product => product.id != exclude_product_id);
      }

      // Limit results
      products = products.slice(0, parseInt(limit));

      res.json({
        success: true,
        data: {
          recommendations: products,
          algorithm: 'category_based',
          category
        }
      });

    } catch (error) {
      console.error('Get recommendations by category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get trending products (most popular)
  static async getTrendingProducts(req, res) {
    try {
      const { limit = 10 } = req.query;

      // This is a simplified trending algorithm
      // In a real app, you might consider views, purchases, time factors, etc.
      const products = await Product.findAll({}, parseInt(limit), 0);

      res.json({
        success: true,
        data: {
          recommendations: products,
          algorithm: 'trending_recent'
        }
      });

    } catch (error) {
      console.error('Get trending products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get recommendations for new users (no purchase history)
  static async getNewUserRecommendations(req, res) {
    try {
      const { limit = 10 } = req.query;

      // For new users, show popular products from different categories
      const categories = await Product.getCategories();
      const recommendations = [];

      // Get a few products from each popular category
      const productsPerCategory = Math.max(1, Math.floor(parseInt(limit) / Math.min(categories.length, 5)));

      for (let i = 0; i < Math.min(categories.length, 5); i++) {
        const categoryProducts = await Product.getByCategory(
          categories[i].category,
          productsPerCategory
        );
        recommendations.push(...categoryProducts);
      }

      // Shuffle and limit results
      const shuffled = recommendations.sort(() => 0.5 - Math.random());
      const final = shuffled.slice(0, parseInt(limit));

      res.json({
        success: true,
        data: {
          recommendations: final,
          algorithm: 'new_user_popular_categories'
        }
      });

    } catch (error) {
      console.error('Get new user recommendations error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get similar products (placeholder for ML-based recommendations)
  static async getSimilarProducts(req, res) {
    try {
      const { product_id } = req.params;
      const { limit = 10 } = req.query;

      // Get the current product
      const currentProduct = await Product.findById(product_id);
      if (!currentProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Get similar products from the same category
      let similarProducts = await Product.getByCategory(currentProduct.category, parseInt(limit) + 1);

      // Remove the current product from recommendations
      similarProducts = similarProducts.filter(product => product.id != product_id);

      // Limit results
      similarProducts = similarProducts.slice(0, parseInt(limit));

      res.json({
        success: true,
        data: {
          recommendations: similarProducts,
          algorithm: 'similar_category',
          baseProduct: {
            id: currentProduct.id,
            title: currentProduct.title,
            category: currentProduct.category
          }
        }
      });

    } catch (error) {
      console.error('Get similar products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user's favorite categories based on purchase history
  static async getUserPreferences(req, res) {
    try {
      const userId = req.user.userId;
      const preferences = await Order.getUserPurchaseHistory(userId, 10, 0);

      res.json({
        success: true,
        data: {
          preferences: preferences.map(pref => ({
            category: pref.category,
            purchase_count: pref.purchase_count,
            last_purchase: pref.last_purchase,
            interest_level: this.calculateInterestLevel(pref.purchase_count)
          }))
        }
      });

    } catch (error) {
      console.error('Get user preferences error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get advanced recommendations using collaborative filtering
  static async getAdvancedRecommendations(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 12 } = req.query;

      // Validate user ID
      if (!userId || isNaN(parseInt(userId))) {
        return res.status(400).json({
          success: false,
          message: 'Valid user ID is required'
        });
      }

      const recommendations = await recommendationEngine.getRecommendationsWithCache(parseInt(userId));

      // Limit results if specified
      const limitedRecommendations = recommendations.slice(0, parseInt(limit));

      res.json({
        success: true,
        data: {
          userId: parseInt(userId),
          recommendations: limitedRecommendations,
          algorithm: 'collaborative_filtering_with_trending',
          total_count: limitedRecommendations.length,
          generated_at: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Get advanced recommendations error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Helper method to calculate interest level
  static calculateInterestLevel(purchaseCount) {
    if (purchaseCount >= 5) return 'high';
    if (purchaseCount >= 2) return 'medium';
    return 'low';
  }
}

module.exports = RecommendationController;