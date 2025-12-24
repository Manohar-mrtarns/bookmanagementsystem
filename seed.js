import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Book from './models/Book.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Book.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Fiction', description: 'Fictional stories and novels' },
      { name: 'Non-Fiction', description: 'Educational and informative books' },
      { name: 'Science', description: 'Science and technology books' },
      { name: 'History', description: 'Historical books and biographies' },
      { name: 'Self-Help', description: 'Personal development and self-help' },
      { name: 'Mystery', description: 'Mystery and thriller novels' },
    ]);
    console.log('Categories created:', categories.length);

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('password123', salt);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      phone: '9876543210',
      address: 'Library, Main Street',
    });
    console.log('Admin user created');

    // Create student users
    const studentPassword = await bcrypt.hash('password123', salt);
    const students = await User.insertMany([
      {
        name: 'John Doe',
        email: 'student@example.com',
        password: studentPassword,
        role: 'student',
        phone: '9876543211',
        address: '123 Student Street',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: studentPassword,
        role: 'student',
        phone: '9876543212',
        address: '456 College Avenue',
      },
    ]);
    console.log('Student users created:', students.length);

    // Create books
    const books = await Book.insertMany([
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        publication: 'Scribner',
        category: categories[0]._id,
        ISBN: '978-0743273565',
        quantity: 5,
        availableCopies: 5,
        rackNo: 'A1',
        image: 'https://images.unsplash.com/photo-1543002588-d83cea6bfbad?w=300',
        description: 'A classic American novel set in the Jazz Age.',
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        publication: 'J.B. Lippincott',
        category: categories[0]._id,
        ISBN: '978-0061120084',
        quantity: 4,
        availableCopies: 4,
        rackNo: 'A2',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300',
        description: 'A gripping tale of racial injustice and childhood innocence.',
      },
      {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        publication: 'Harper',
        category: categories[1]._id,
        ISBN: '978-0062316097',
        quantity: 6,
        availableCopies: 6,
        rackNo: 'B1',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300',
        description: 'A brief history of humankind from the Stone Age to modern times.',
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        publication: 'Bantam',
        category: categories[2]._id,
        ISBN: '978-0553380163',
        quantity: 3,
        availableCopies: 3,
        rackNo: 'C1',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300',
        description: 'From the Big Bang to Black Holes.',
      },
      {
        title: 'The Midnight Library',
        author: 'Matt Haig',
        publication: 'Viking',
        category: categories[0]._id,
        ISBN: '978-0525559474',
        quantity: 5,
        availableCopies: 5,
        rackNo: 'A3',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300',
        description: 'A novel about infinite possibilities and second chances.',
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        publication: 'Avery',
        category: categories[4]._id,
        ISBN: '978-0735211292',
        quantity: 7,
        availableCopies: 7,
        rackNo: 'D1',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300',
        description: 'Tiny changes, remarkable results.',
      },
      {
        title: 'The Da Vinci Code',
        author: 'Dan Brown',
        publication: 'Doubleday',
        category: categories[5]._id,
        ISBN: '978-0307474278',
        quantity: 4,
        availableCopies: 4,
        rackNo: 'E1',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300',
        description: 'A mystery thriller involving art, history, and conspiracy.',
      },
      {
        title: '1984',
        author: 'George Orwell',
        publication: 'Secker & Warburg',
        category: categories[0]._id,
        ISBN: '978-0451524935',
        quantity: 5,
        availableCopies: 5,
        rackNo: 'A4',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300',
        description: 'A dystopian social science fiction novel.',
      },
    ]);
    console.log('Books created:', books.length);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
