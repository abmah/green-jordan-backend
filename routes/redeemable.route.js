import express from 'express';
import {
  createRedeemable,
  updateRedeemable,
  deleteRedeemable,
  getAllRedeemables,
  getAvailableRedeemables,
  redeemItem,
  getRedeemedItems,
} from '../controllers/redeemable.controller.js';

const router = express.Router();

// Public Routes
router.get('/all', getAllRedeemables);
router.get('/available/:userId', getAvailableRedeemables);
router.post('/redeem/:redeemableId', redeemItem); // Redeem an item
router.get('/basket/:userId', getRedeemedItems); // Get the user's redeemed items

// Admin Routes
router.post('/', createRedeemable); // Create a redeemable item
router.put('/:id', updateRedeemable); // Update a redeemable item
router.delete('/:id', deleteRedeemable); // Delete a redeemable item

export default router;
