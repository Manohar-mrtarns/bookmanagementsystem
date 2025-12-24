import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.post('/', verifyToken, isAdmin, createCategory);
router.put('/:id', verifyToken, isAdmin, updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

export default router;
