const db = require('../config/database');

class Cart {
  static async addItem(userId, productId, quantity = 1) {
    // Check if item already exists in cart
    const [existing] = await db.execute(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      // Update quantity
      const [result] = await db.execute(
        'UPDATE cart SET quantity = quantity + ?, updated_at = NOW() WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
      return result.affectedRows > 0;
    } else {
      // Add new item
      const [result] = await db.execute(
        'INSERT INTO cart (user_id, product_id, quantity, created_at) VALUES (?, ?, ?, NOW())',
        [userId, productId, quantity]
      );
      return result.insertId > 0;
    }
  }

  static async removeItem(userId, productId) {
    const [result] = await db.execute(
      'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return result.affectedRows > 0;
  }

  static async updateQuantity(userId, productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }

    const [result] = await db.execute(
      'UPDATE cart SET quantity = ?, updated_at = NOW() WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );
    return result.affectedRows > 0;
  }

  static async getCartItems(userId) {
    const [rows] = await db.execute(
      `SELECT c.*, p.title, p.description, p.price, p.images, p.status,
              u.name as seller_name
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       JOIN users u ON p.seller_id = u.id
       WHERE c.user_id = ? AND p.status = 'active'
       ORDER BY c.created_at DESC`,
      [userId]
    );

    return rows.map(item => ({
      ...item,
      images: JSON.parse(item.images || '[]'),
      total_price: parseFloat(item.price) * item.quantity
    }));
  }

  static async getCartTotal(userId) {
    const [rows] = await db.execute(
      `SELECT 
        COUNT(*) as total_items,
        SUM(c.quantity) as total_quantity,
        SUM(p.price * c.quantity) as total_price
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ? AND p.status = 'active'`,
      [userId]
    );

    return rows[0] || { total_items: 0, total_quantity: 0, total_price: 0 };
  }

  static async clearCart(userId) {
    const [result] = await db.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
    return result.affectedRows > 0;
  }

  static async getItemCount(userId) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM cart WHERE user_id = ?',
      [userId]
    );
    return rows[0].count;
  }
}

module.exports = Cart;