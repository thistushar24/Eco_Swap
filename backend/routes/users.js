const express = require('express');
const UserController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { userValidation, paramValidation, queryValidation } = require('../middleware/validation');

const router = express.Router();

// Admin routes
router.get('/', authenticateToken, requireAdmin, queryValidation.pagination, UserController.getAllUsers);
router.get('/stats', authenticateToken, requireAdmin, UserController.getUserStats);

// User profile routes
router.get('/:id', authenticateToken, paramValidation.id, UserController.getUserById);
router.put('/:id', authenticateToken, paramValidation.id, userValidation.updateProfile, UserController.updateProfile);
router.delete('/:id', authenticateToken, paramValidation.id, UserController.deleteUser);

// Admin role management
router.put('/:id/role', authenticateToken, requireAdmin, paramValidation.id, userValidation.updateRole, UserController.updateUserRole);

module.exports = router;