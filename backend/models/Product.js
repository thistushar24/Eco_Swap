const db = require('../config/database');

class Product {
  static async create(productData) {
    const {
      title,
      description,
      price,
      category,
      images = '[]',
      seller_id,
      blockchain_ownership_id = null
    } = productData;
    
    const [result] = await db.execute(
      `INSERT INTO products (title, description, price, category, images, seller_id, blockchain_ownership_id, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [title, description, price, category, JSON.stringify(images), seller_id, blockchain_ownership_id]
    );
    
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT p.*, u.name as seller_name, u.email as seller_email 
       FROM products p 
       JOIN users u ON p.seller_id = u.id 
       WHERE p.id = ? AND p.status = 'active'`,
      [id]
    );
    
    if (rows[0]) {
      rows[0].images = JSON.parse(rows[0].images || '[]');
    }
    
    return rows[0] || null;
  }

  static async findAll(filters = {}, limit = 20, offset = 0) {
    let query = `
      SELECT p.*, u.name as seller_name 
      FROM products p 
      JOIN users u ON p.seller_id = u.id 
      WHERE p.status = 'active'
    `;
    const params = [];

    // Apply filters
    if (filters.category) {
      query += ' AND p.category = ?';
      params.push(filters.category);
    }

    if (filters.min_price) {
      query += ' AND p.price >= ?';
      params.push(filters.min_price);
    }

    if (filters.max_price) {
      query += ' AND p.price <= ?';
      params.push(filters.max_price);
    }

    if (filters.search) {
      query += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.seller_id) {
      query += ' AND p.seller_id = ?';
      params.push(filters.seller_id);
    }

    // Order and pagination
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.execute(query, params);
    
    // Parse images JSON for each product
    return rows.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]')
    }));
  }

  static async updateById(id, updateData, sellerId = null) {
    const fields = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && updateData[key] !== undefined) {
        if (key === 'images') {
          fields.push(`${key} = ?`);
          values.push(JSON.stringify(updateData[key]));
        } else {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      }
    });
    
    if (fields.length === 0) return false;
    
    let query = `UPDATE products SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
    values.push(id);
    
    // If sellerId provided, ensure only the seller can update their product
    if (sellerId) {
      query += ' AND seller_id = ?';
      values.push(sellerId);
    }
    
    const [result] = await db.execute(query, values);
    
    return result.affectedRows > 0;
  }

  static async deleteById(id, sellerId = null) {
    let query = 'UPDATE products SET status = "deleted", updated_at = NOW() WHERE id = ?';
    const params = [id];
    
    if (sellerId) {
      query += ' AND seller_id = ?';
      params.push(sellerId);
    }
    
    const [result] = await db.execute(query, params);
    return result.affectedRows > 0;
  }

  static async getByCategory(category, limit = 10) {
    const [rows] = await db.execute(
      `SELECT p.*, u.name as seller_name 
       FROM products p 
       JOIN users u ON p.seller_id = u.id 
       WHERE p.category = ? AND p.status = 'active' 
       ORDER BY p.created_at DESC 
       LIMIT ?`,
      [category, limit]
    );
    
    return rows.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]')
    }));
  }

  static async getRecommendations(userId, limit = 10) {
    // Get user's purchase history and recommend similar products
    const [rows] = await db.execute(
      `SELECT DISTINCT p.*, u.name as seller_name
       FROM products p
       JOIN users u ON p.seller_id = u.id
       WHERE p.category IN (
         SELECT DISTINCT p2.category 
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         JOIN products p2 ON oi.product_id = p2.id
         WHERE o.user_id = ? AND o.status = 'completed'
       )
       AND p.status = 'active'
       AND p.seller_id != ?
       ORDER BY RAND()
       LIMIT ?`,
      [userId, userId, limit]
    );
    
    return rows.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]')
    }));
  }

  static async getProductStats() {
    const [rows] = await db.execute(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_products,
        COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as new_today,
        AVG(price) as average_price,
        COUNT(DISTINCT category) as total_categories
      FROM products
    `);
    
    return rows[0];
  }

  static async getCategories() {
    const [rows] = await db.execute(
      'SELECT category, COUNT(*) as count FROM products WHERE status = "active" GROUP BY category ORDER BY count DESC'
    );
    
    return rows;
  }
}

module.exports = Product;