const express = require('express');
const RecommendationController = require('../controllers/recommendationController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { paramValidation } = require('../middleware/validation');

const router = express.Router();

// Public recommendation routes
router.get('/trending', RecommendationController.getTrendingProducts);
router.get('/new-user', RecommendationController.getNewUserRecommendations);
router.get('/category/:category', paramValidation.category, RecommendationController.getRecommendationsByCategory);
router.get('/similar/:product_id', paramValidation.id, RecommendationController.getSimilarProducts);

// Personalized recommendations (require authentication)
router.get('/personalized', authenticateToken, RecommendationController.getRecommendations);
router.get('/preferences', authenticateToken, RecommendationController.getUserPreferences);

// Advanced collaborative filtering recommendations
router.get('/:userId', paramValidation.id, RecommendationController.getAdvancedRecommendations);

module.exports = router;