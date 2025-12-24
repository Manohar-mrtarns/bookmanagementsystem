import express from 'express';
import {
  requestBook,
  getAllIssueRequests,
  getUserIssueRequests,
  approveIssueRequest,
  rejectIssueRequest,
  markAsIssued,
  returnBook,
  getIssuedBooks,
  getUserIssuedBooks,
  getUserFineDetails,
} from '../controllers/issueController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student routes
router.post('/request', verifyToken, requestBook);
router.get('/my-requests', verifyToken, getUserIssueRequests);
router.get('/my-issued', verifyToken, getUserIssuedBooks);
router.get('/my-fines', verifyToken, getUserFineDetails);
router.post('/return/:issueId', verifyToken, returnBook);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllIssueRequests);
router.get('/issued-books', verifyToken, isAdmin, getIssuedBooks);
router.post('/approve/:issueId', verifyToken, isAdmin, approveIssueRequest);
router.post('/reject/:issueId', verifyToken, isAdmin, rejectIssueRequest);
router.post('/mark-issued/:issueId', verifyToken, isAdmin, markAsIssued);

export default router;
