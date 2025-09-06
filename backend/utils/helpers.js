// Helper functions for common operations

const crypto = require('crypto');

/**
 * Generate a random string of specified length
 * @param {number} length - Length of the random string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Format price for display
 * @param {number} price - Price to format
 * @param {string} currency - Currency symbol
 * @returns {string} Formatted price
 */
const formatPrice = (price, currency = '$') => {
  return `${currency}${parseFloat(price).toFixed(2)}`;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate slug from string
 * @param {string} str - String to convert to slug
 * @returns {string} Slug
 */
const generateSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Calculate pagination offset
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {number} Offset
 */
const calculateOffset = (page, limit) => {
  return (parseInt(page) - 1) * parseInt(limit);
};

/**
 * Clean and validate object data
 * @param {object} obj - Object to clean
 * @param {array} allowedFields - Array of allowed field names
 * @returns {object} Cleaned object
 */
const cleanObject = (obj, allowedFields) => {
  const cleaned = {};
  allowedFields.forEach(field => {
    if (obj.hasOwnProperty(field) && obj[field] !== undefined) {
      cleaned[field] = obj[field];
    }
  });
  return cleaned;
};

/**
 * Generate order reference number
 * @returns {string} Order reference
 */
const generateOrderReference = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ECO-${timestamp.slice(-8)}-${random}`;
};

/**
 * Calculate distance between two points (for future location-based features)
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted date
 */
const formatDate = (date, locale = 'en-US') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Sanitize HTML content (basic)
 * @param {string} html - HTML to sanitize
 * @returns {string} Sanitized HTML
 */
const sanitizeHtml = (html) => {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Generate API response format
 * @param {boolean} success - Success status
 * @param {object} data - Response data
 * @param {string} message - Response message
 * @param {object} meta - Additional metadata
 * @returns {object} Formatted response
 */
const apiResponse = (success, data = null, message = null, meta = null) => {
  const response = { success };
  
  if (message) response.message = message;
  if (data) response.data = data;
  if (meta) response.meta = meta;
  
  return response;
};

module.exports = {
  generateRandomString,
  formatPrice,
  isValidEmail,
  generateSlug,
  calculateOffset,
  cleanObject,
  generateOrderReference,
  calculateDistance,
  formatDate,
  sanitizeHtml,
  apiResponse
};