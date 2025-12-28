import mongoose from 'mongoose';
import Book from '../models/Book.js';
import Category from '../models/Category.js';

// Get all books with filters
export const getAllBooks = async (req, res) => {
  try {
    const { search, category, author, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ISBN: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const books = await Book.find(filter)
      .populate('category')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      books,
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

// Get single book
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('category');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new book (Admin only)
export const createBook = async (req, res) => {
  try {
    const { title, author, publication, category, ISBN, quantity, rackNo, image, description } =
      req.body;

    // Validate required fields
    if (!title || !author || !publication || !category || !ISBN || quantity === undefined || quantity === null || !rackNo) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({ message: 'Quantity must be a valid number' });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Check if ISBN already exists
    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const book = new Book({
      title,
      author,
      publication,
      category,
      ISBN,
      quantity: parsedQuantity,
      availableCopies: parsedQuantity,
      rackNo,
      image: image || 'https://via.placeholder.com/200x300?text=Book+Cover',
      description,
    });

    await book.save();
    await book.populate('category');

    res.status(201).json({
      message: 'Book created successfully',
      book,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update book (Admin only)
export const updateBook = async (req, res) => {
  try {
    const { title, author, publication, category, ISBN, quantity, rackNo, image, description } =
      req.body;

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if new ISBN conflicts with other books
    if (ISBN && ISBN !== book.ISBN) {
      const existingBook = await Book.findOne({ ISBN });
      if (existingBook) {
        return res.status(400).json({ message: 'ISBN already exists' });
      }
    }

    // Update fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (publication) book.publication = publication;
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
      book.category = category;
    }
    if (ISBN) book.ISBN = ISBN;
    if (quantity !== undefined && quantity !== null) {
      const parsedQuantity = Number(quantity);
      if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
        return res.status(400).json({ message: 'Quantity must be a valid number' });
      }
      const quantityDiff = parsedQuantity - book.quantity;
      book.quantity = parsedQuantity;
      book.availableCopies += quantityDiff;
    }
    if (rackNo) book.rackNo = rackNo;
    if (image) book.image = image;
    if (description) book.description = description;

    await book.save();
    await book.populate('category');

    res.status(200).json({
      message: 'Book updated successfully',
      book,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete book (Admin only)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available books
export const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.find({ availableCopies: { $gt: 0 } })
      .populate('category')
      .sort({ createdAt: -1 });

    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
