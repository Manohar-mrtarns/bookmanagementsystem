import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  changePassword,
  deactivateUser,
  activateUser,
  deleteUser,
  getDashboardStats,
} from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.put('/profile/:id', verifyToken, updateUserProfile);
router.post('/change-password', verifyToken, changePassword);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/stats', verifyToken, isAdmin, getDashboardStats);
router.get('/:id', verifyToken, isAdmin, getUserById);
router.post('/deactivate/:id', verifyToken, isAdmin, deactivateUser);
router.post('/activate/:id', verifyToken, isAdmin, activateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;
