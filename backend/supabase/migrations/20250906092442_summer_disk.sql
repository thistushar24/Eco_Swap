/*
  # EcoFinds Database Schema

  1. New Tables
    - `users` - User accounts with authentication and role management
    - `products` - Product listings with seller information
    - `cart` - Shopping cart items for users
    - `orders` - Order management with status tracking
    - `order_items` - Individual items within orders
  
  2. Security
    - Password hashing handled by application layer
    - Foreign key constraints to maintain data integrity
    - Indexes on frequently queried columns
    - Proper data types and constraints
  
  3. Features
    - Support for blockchain ownership tracking
    - Flexible product image storage as JSON
    - Comprehensive order management with status tracking
    - User role-based access control
*/

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS ecofinds_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecofinds_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('buyer', 'seller', 'admin') DEFAULT 'buyer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  images JSON DEFAULT '[]',
  seller_id INT NOT NULL,
  blockchain_ownership_id VARCHAR(100) DEFAULT NULL,
  status ENUM('active', 'sold', 'inactive', 'deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_seller_id (seller_id),
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_price (price),
  INDEX idx_created_at (created_at),
  INDEX idx_blockchain_ownership (blockchain_ownership_id),
  FULLTEXT idx_search (title, description)
) ENGINE=InnoDB;

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_address JSON NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_total_price (total_price)
) ENGINE=InnoDB;

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price_per_item DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB;

-- Insert default admin user (password: Admin123!)
INSERT IGNORE INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@ecofinds.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2BL9UuE7eu', 'admin');

-- Insert sample categories data
INSERT IGNORE INTO products (title, description, price, category, images, seller_id, status) VALUES
('Sample Vintage Chair', 'Beautiful vintage wooden chair in excellent condition. Perfect for any home office or dining room.', 125.00, 'Furniture', '["https://images.pexels.com/photos/586564/pexels-photo-586564.jpeg"]', 1, 'active'),
('Eco-Friendly Water Bottle', 'Reusable stainless steel water bottle. Great for reducing plastic waste.', 25.99, 'Kitchen & Dining', '["https://images.pexels.com/photos/3394220/pexels-photo-3394220.jpeg"]', 1, 'active'),
('Pre-owned Designer Handbag', 'Authentic designer handbag in great condition. Only used a few times.', 350.00, 'Fashion', '["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg"]', 1, 'active');