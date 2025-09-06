const User = require('../models/User');
const { validationResult } = require('express-validator');

class UserController {
  // Get all users (Admin only)
  static async getAllUsers(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { page = 1, limit = 50 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const users = await User.getAllUsers(parseInt(limit), offset);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            hasMore: users.length === parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      // Users can only view their own profile, admins can view any profile
      if (req.user.role !== 'admin' && req.user.userId != id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });

    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
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

      // Users can only update their own profile, admins can update any profile
      if (req.user.role !== 'admin' && req.user.userId != id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Remove sensitive fields from update data
      delete updateData.id;
      delete updateData.password; // Password updates should be handled separately
      
      // Only admins can change roles
      if (req.user.role !== 'admin') {
        delete updateData.role;
      }

      const updated = await User.updateById(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = await User.findById(id);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete user account
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Users can only delete their own account, admins can delete any account
      if (req.user.role !== 'admin' && req.user.userId != id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const deleted = await User.deleteById(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User account deleted successfully'
      });

    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user statistics (Admin only)
  static async getUserStats(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const stats = await User.getUserStats();

      res.json({
        success: true,
        data: { stats }
      });

    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update user role (Admin only)
  static async updateUserRole(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { role } = req.body;

      const updated = await User.updateById(id, { role });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = await User.findById(id);

      res.json({
        success: true,
        message: 'User role updated successfully',
        data: { user }
      });

    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = UserController;