import mongoose from 'mongoose';

const FALLBACK_COVER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='28' fill='%23334155'%3EBook%20Cover%3C/text%3E%3C/svg%3E";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a book title'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please provide an author name'],
      trim: true,
    },
    publication: {
      type: String,
      required: [true, 'Please provide publication name'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    ISBN: {
      type: String,
      required: [true, 'Please provide ISBN'],
      unique: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide total quantity'],
      min: 0,
    },
    availableCopies: {
      type: Number,
      required: [true, 'Please provide available copies'],
      min: 0,
    },
    rackNo: {
      type: String,
      required: [true, 'Please provide rack number'],
      trim: true,
    },
    image: {
      type: String,
      default: FALLBACK_COVER,
    },
    description: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Book', bookSchema);
