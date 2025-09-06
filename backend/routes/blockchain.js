const express = require('express');
const BlockchainController = require('../controllers/blockchainController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { paramValidation } = require('../middleware/validation');

const router = express.Router();

// Public blockchain routes
router.get('/network-status', BlockchainController.getNetworkStatus);
router.get('/ownership/:ownership_id/history', paramValidation.ownershipId, BlockchainController.getOwnershipHistory);
router.get('/ownership/:ownership_id/verify', paramValidation.ownershipId, BlockchainController.verifyOwnership);

// Protected blockchain routes (for sellers/users creating ownership records)
router.post('/ownership', authenticateToken, BlockchainController.createOwnershipRecord);
router.post('/ownership/:ownership_id/transfer', authenticateToken, paramValidation.ownershipId, BlockchainController.transferOwnership);

module.exports = router;