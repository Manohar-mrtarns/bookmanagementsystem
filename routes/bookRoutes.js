import express from 'express';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getAvailableBooks,
} from '../controllers/bookController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/available', getAvailableBooks);
router.get('/:id', getBookById);

// Admin routes
router.post('/', verifyToken, isAdmin, createBook);
router.put('/:id', verifyToken, isAdmin, updateBook);
router.delete('/:id', verifyToken, isAdmin, deleteBook);

export default router;
