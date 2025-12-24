import Issue from '../models/Issue.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

const FINE_PER_DAY = 10; // Fine in rupees per day

// Request a book
export const requestBook = async (req, res) => {
  try {
    const { bookId, daysNeeded } = req.body;
    const userId = req.user.id;

    if (!bookId || !daysNeeded) {
      return res.status(400).json({ message: 'Please provide bookId and daysNeeded' });
    }

    // Check if book exists and has available copies
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    // Check if user already has this book issued
    const existingIssue = await Issue.findOne({
      userId,
      bookId,
      status: { $in: ['pending', 'approved', 'issued'] },
    });

    if (existingIssue) {
      return res.status(400).json({ message: 'You already have a request for this book' });
    }

    // Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(daysNeeded));

    const issue = new Issue({
      bookId,
      userId,
      dueDate,
      status: 'pending',
    });

    await issue.save();
    await issue.populate(['bookId', 'userId']);

    res.status(201).json({
      message: 'Book request submitted successfully',
      issue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all issue requests (Admin)
export const getAllIssueRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    const issues = await Issue.find(filter)
      .populate('bookId')
      .populate('userId')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Issue.countDocuments(filter);

    res.status(200).json({
      issues,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's issue requests
export const getUserIssueRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const issues = await Issue.find({ userId })
      .populate('bookId')
      .populate('userId')
      .sort({ createdAt: -1 });

    res.status(200).json({ issues });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve issue request (Admin)
export const approveIssueRequest = async (req, res) => {
  try {
    const { issueId } = req.params;
    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ message: 'Issue request not found' });
    }

    if (issue.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be approved' });
    }

    // Check book availability
    const book = await Book.findById(issue.bookId);
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book is no longer available' });
    }

    // Update issue status
    issue.status = 'approved';
    await issue.save();

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    await issue.populate(['bookId', 'userId']);

    res.status(200).json({
      message: 'Issue request approved',
      issue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject issue request (Admin)
export const rejectIssueRequest = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { remarks } = req.body;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue request not found' });
    }

    if (issue.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be rejected' });
    }

    issue.status = 'rejected';
    issue.remarks = remarks || '';
    await issue.save();

    await issue.populate(['bookId', 'userId']);

    res.status(200).json({
      message: 'Issue request rejected',
      issue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark as issued (Admin - after book is physically given)
export const markAsIssued = async (req, res) => {
  try {
    const { issueId } = req.params;
    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ message: 'Issue request not found' });
    }

    if (issue.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved requests can be marked as issued' });
    }

    issue.status = 'issued';
    issue.issueDate = new Date();
    await issue.save();

    await issue.populate(['bookId', 'userId']);

    res.status(200).json({
      message: 'Book marked as issued',
      issue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Return book
export const returnBook = async (req, res) => {
  try {
    const { issueId } = req.params;
    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ message: 'Issue record not found' });
    }

    if (issue.status !== 'issued') {
      return res.status(400).json({ message: 'Only issued books can be returned' });
    }

    // Calculate fine if return is late
    const today = new Date();
    let fine = 0;

    if (today > issue.dueDate) {
      const daysLate = Math.ceil((today - issue.dueDate) / (1000 * 60 * 60 * 24));
      fine = daysLate * FINE_PER_DAY;
    }

    issue.status = 'returned';
    issue.returnDate = today;
    issue.fine = fine;
    await issue.save();

    // Increase available copies
    const book = await Book.findById(issue.bookId);
    book.availableCopies += 1;
    await book.save();

    await issue.populate(['bookId', 'userId']);

    res.status(200).json({
      message: 'Book returned successfully',
      issue,
      fine,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get issued books
export const getIssuedBooks = async (req, res) => {
  try {
    const issues = await Issue.find({ status: 'issued' })
      .populate('bookId')
      .populate('userId')
      .sort({ dueDate: 1 });

    res.status(200).json({ issues });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's issued books
export const getUserIssuedBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const issues = await Issue.find({ userId, status: 'issued' })
      .populate('bookId')
      .sort({ dueDate: 1 });

    res.status(200).json({ issues });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's fine details
export const getUserFineDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const issues = await Issue.find({ userId, fine: { $gt: 0 } })
      .populate('bookId')
      .sort({ createdAt: -1 });

    const totalFine = issues.reduce((sum, issue) => sum + issue.fine, 0);

    res.status(200).json({
      issues,
      totalFine,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
