import mongoose from 'mongoose';

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
      default: 'https://via.placeholder.com/200x300?text=Book+Cover',
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
