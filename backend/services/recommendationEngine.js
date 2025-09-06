const db = require('../config/database');

/**
 * Recommendation Engine for EcoFinds
 * Uses item-based collaborative filtering and rules-based approach
 */
class RecommendationEngine {
    constructor() {
        this.categoryWeights = {
            'electronics': 1.2,
            'clothing': 1.1,
            'books': 1.0,
            'home': 1.1,
            'sports': 1.0,
            'toys': 0.9,
            'automotive': 1.0,
            'beauty': 1.1
        };
    }

    /**
     * Get user purchase history
     * @param {number} userId 
     * @returns {Array} Purchase history with categories
     */
    async getUserPurchaseHistory(userId) {
        const query = `
            SELECT DISTINCT p.id, p.category, p.price, oi.quantity, o.created_at
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = ? AND o.status IN ('completed', 'shipped')
            ORDER BY o.created_at DESC
            LIMIT 50
        `;
        
        try {
            const [rows] = await db.execute(query, [userId]);
            return rows;
        } catch (error) {
            console.error('Error fetching user purchase history:', error);
            return [];
        }
    }

    /**
     * Get category preferences based on purchase history
     * @param {Array} purchaseHistory 
     * @returns {Object} Category scores
     */
    getCategoryPreferences(purchaseHistory) {
        const categoryScores = {};
        
        purchaseHistory.forEach(item => {
            const category = item.category || 'other';
            const score = (item.quantity || 1) * (this.categoryWeights[category] || 1.0);
            
            categoryScores[category] = (categoryScores[category] || 0) + score;
        });

        // Normalize scores
        const maxScore = Math.max(...Object.values(categoryScores));
        if (maxScore > 0) {
            Object.keys(categoryScores).forEach(category => {
                categoryScores[category] = categoryScores[category] / maxScore;
            });
        }

        return categoryScores;
    }

    /**
     * Get similar users based on purchase patterns
     * @param {number} userId 
     * @param {Array} userCategories 
     * @returns {Array} Similar user IDs
     */
    async getSimilarUsers(userId, userCategories) {
        if (userCategories.length === 0) return [];

        const categoryList = userCategories.map(() => '?').join(',');
        const query = `
            SELECT DISTINCT o.user_id, COUNT(*) as similarity_score
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            WHERE o.user_id != ? 
            AND p.category IN (${categoryList})
            AND o.status IN ('completed', 'shipped')
            GROUP BY o.user_id
            HAVING similarity_score >= 2
            ORDER BY similarity_score DESC
            LIMIT 10
        `;

        try {
            const [rows] = await db.execute(query, [userId, ...userCategories]);
            return rows.map(row => row.user_id);
        } catch (error) {
            console.error('Error finding similar users:', error);
            return [];
        }
    }

    /**
     * Get products purchased by similar users
     * @param {Array} similarUsers 
     * @param {number} userId 
     * @returns {Array} Product recommendations
     */
    async getProductsFromSimilarUsers(similarUsers, userId) {
        if (similarUsers.length === 0) return [];

        const userList = similarUsers.map(() => '?').join(',');
        const query = `
            SELECT p.id, p.title, p.description, p.price, p.category, 
                   p.images, p.seller_id, COUNT(*) as purchase_count,
                   AVG(p.price) as avg_price
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            WHERE o.user_id IN (${userList})
            AND o.status IN ('completed', 'shipped')
            AND p.seller_id != ?
            AND p.id NOT IN (
                SELECT DISTINCT oi2.product_id 
                FROM order_items oi2 
                JOIN orders o2 ON oi2.order_id = o2.id 
                WHERE o2.user_id = ?
            )
            GROUP BY p.id
            ORDER BY purchase_count DESC, avg_price ASC
            LIMIT 20
        `;

        try {
            const [rows] = await db.execute(query, [...similarUsers, userId, userId]);
            return rows;
        } catch (error) {
            console.error('Error fetching products from similar users:', error);
            return [];
        }
    }

    /**
     * Get trending products in user's preferred categories
     * @param {Array} preferredCategories 
     * @param {number} userId 
     * @returns {Array} Trending products
     */
    async getTrendingProducts(preferredCategories, userId) {
        if (preferredCategories.length === 0) {
            preferredCategories = ['electronics', 'clothing', 'books', 'home'];
        }

        const categoryList = preferredCategories.map(() => '?').join(',');
        const query = `
            SELECT p.id, p.title, p.description, p.price, p.category, 
                   p.images, p.seller_id, COUNT(oi.id) as popularity_score
            FROM products p
            LEFT JOIN order_items oi ON p.id = oi.product_id
            LEFT JOIN orders o ON oi.order_id = o.id
            WHERE p.category IN (${categoryList})
            AND p.seller_id != ?
            AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            AND p.id NOT IN (
                SELECT DISTINCT oi2.product_id 
                FROM order_items oi2 
                JOIN orders o2 ON oi2.order_id = o2.id 
                WHERE o2.user_id = ?
            )
            GROUP BY p.id
            ORDER BY popularity_score DESC, p.created_at DESC
            LIMIT 15
        `;

        try {
            const [rows] = await db.execute(query, [...preferredCategories, userId, userId]);
            return rows;
        } catch (error) {
            console.error('Error fetching trending products:', error);
            return [];
        }
    }

    /**
     * Score and rank recommendations
     * @param {Array} collaborativeRecs 
     * @param {Array} trendingRecs 
     * @param {Object} categoryPreferences 
     * @returns {Array} Scored recommendations
     */
    scoreRecommendations(collaborativeRecs, trendingRecs, categoryPreferences) {
        const allRecs = new Map();

        // Score collaborative filtering recommendations
        collaborativeRecs.forEach(product => {
            const categoryScore = categoryPreferences[product.category] || 0.5;
            const popularityScore = Math.min(product.purchase_count / 10, 1.0);
            const priceScore = product.price < 100 ? 1.0 : 0.8; // Favor affordable items
            
            const finalScore = (categoryScore * 0.4) + (popularityScore * 0.4) + (priceScore * 0.2);
            
            allRecs.set(product.id, {
                ...product,
                recommendation_score: finalScore,
                recommendation_type: 'collaborative'
            });
        });

        // Score trending recommendations
        trendingRecs.forEach(product => {
            if (!allRecs.has(product.id)) {
                const categoryScore = categoryPreferences[product.category] || 0.3;
                const popularityScore = Math.min((product.popularity_score || 0) / 5, 1.0);
                const recencyScore = 0.8; // Trending items get recency bonus
                
                const finalScore = (categoryScore * 0.3) + (popularityScore * 0.3) + (recencyScore * 0.4);
                
                allRecs.set(product.id, {
                    ...product,
                    recommendation_score: finalScore,
                    recommendation_type: 'trending'
                });
            }
        });

        // Convert to array and sort by score
        return Array.from(allRecs.values())
            .sort((a, b) => b.recommendation_score - a.recommendation_score)
            .slice(0, 12); // Return top 12 recommendations
    }

    /**
     * Generate recommendations for a user
     * @param {number} userId 
     * @returns {Array} Personalized recommendations
     */
    async generateRecommendations(userId) {
        try {
            // Get user's purchase history
            const purchaseHistory = await this.getUserPurchaseHistory(userId);
            
            // If no purchase history, return trending products
            if (purchaseHistory.length === 0) {
                const trending = await this.getTrendingProducts([], userId);
                return trending.slice(0, 8).map(product => ({
                    ...product,
                    recommendation_score: 0.5,
                    recommendation_type: 'trending'
                }));
            }

            // Analyze category preferences
            const categoryPreferences = this.getCategoryPreferences(purchaseHistory);
            const preferredCategories = Object.keys(categoryPreferences);

            // Find similar users
            const similarUsers = await this.getSimilarUsers(userId, preferredCategories);

            // Get recommendations from collaborative filtering
            const collaborativeRecs = await this.getProductsFromSimilarUsers(similarUsers, userId);

            // Get trending products in preferred categories
            const trendingRecs = await this.getTrendingProducts(preferredCategories, userId);

            // Score and rank all recommendations
            const finalRecommendations = this.scoreRecommendations(
                collaborativeRecs, 
                trendingRecs, 
                categoryPreferences
            );

            return finalRecommendations;

        } catch (error) {
            console.error('Error generating recommendations:', error);
            return [];
        }
    }

    /**
     * Get recommendations with caching
     * @param {number} userId 
     * @returns {Array} Cached or fresh recommendations
     */
    async getRecommendationsWithCache(userId) {
        // Simple in-memory cache (in production, use Redis)
        const cacheKey = `recommendations_${userId}`;
        const cacheTime = 30 * 60 * 1000; // 30 minutes
        
        if (this.cache && this.cache[cacheKey] && 
            (Date.now() - this.cache[cacheKey].timestamp) < cacheTime) {
            return this.cache[cacheKey].data;
        }

        const recommendations = await this.generateRecommendations(userId);
        
        // Cache the results
        if (!this.cache) this.cache = {};
        this.cache[cacheKey] = {
            data: recommendations,
            timestamp: Date.now()
        };

        return recommendations;
    }
}

module.exports = new RecommendationEngine();
