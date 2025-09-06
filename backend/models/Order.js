const db = require('../config/database');

class Order {
  static async create(orderData) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { user_id, products, total_price, shipping_address, payment_method = 'pending' } = orderData;
      
      // Create order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (user_id, total_price, status, shipping_address, payment_method, created_at) 
         VALUES (?, ?, 'pending', ?, ?, NOW())`,
        [user_id, total_price, JSON.stringify(shipping_address), payment_method]
      );
      
      const orderId = orderResult.insertId;
      
      // Add order items
      for (const product of products) {
        await connection.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, price_per_item) VALUES (?, ?, ?, ?)',
          [orderId, product.product_id, product.quantity, product.price]
        );
      }
      
      await connection.commit();
      return orderId;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id, userId = null) {
    let query = `
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE o.id = ?
    `;
    const params = [id];
    
    if (userId) {
      query += ' AND o.user_id = ?';
      params.push(userId);
    }
    
    const [rows] = await db.execute(query, params);
    
    if (!rows[0]) return null;
    
    const order = rows[0];
    order.shipping_address = JSON.parse(order.shipping_address || '{}');
    
    // Get order items
    const [items] = await db.execute(
      `SELECT oi.*, p.title, p.description, p.images 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );
    
    order.items = items.map(item => ({
      ...item,
      images: JSON.parse(item.images || '[]')
    }));
    
    return order;
  }

  static async findByUserId(userId, limit = 20, offset = 0) {
    const [rows] = await db.execute(
      `SELECT o.* FROM orders o 
       WHERE o.user_id = ? 
       ORDER BY o.created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    
    return rows.map(order => ({
      ...order,
      shipping_address: JSON.parse(order.shipping_address || '{}')
    }));
  }

  static async updateStatus(id, status, userId = null) {
    let query = 'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?';
    const params = [status, id];
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    const [result] = await db.execute(query, params);
    return result.affectedRows > 0;
  }

  static async getOrderStats(userId = null) {
    let query = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        SUM(total_price) as total_revenue,
        AVG(total_price) as average_order_value
      FROM orders
    `;
    const params = [];
    
    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }
    
    const [rows] = await db.execute(query, params);
    return rows[0];
  }

  static async getRecentOrders(limit = 10, userId = null) {
    let query = `
      SELECT o.*, u.name as customer_name 
      FROM orders o 
      JOIN users u ON o.user_id = u.id
    `;
    const params = [];
    
    if (userId) {
      query += ' WHERE o.user_id = ?';
      params.push(userId);
    }
    
    query += ' ORDER BY o.created_at DESC LIMIT ?';
    params.push(limit);
    
    const [rows] = await db.execute(query, params);
    
    return rows.map(order => ({
      ...order,
      shipping_address: JSON.parse(order.shipping_address || '{}')
    }));
  }

  static async getUserPurchaseHistory(userId, limit = 20, offset = 0) {
    const [rows] = await db.execute(
      `SELECT DISTINCT p.category, COUNT(*) as purchase_count, 
              MAX(o.created_at) as last_purchase
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = ? AND o.status = 'completed'
       GROUP BY p.category
       ORDER BY purchase_count DESC, last_purchase DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    
    return rows;
  }
}

module.exports = Order;