import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

const clearProducts = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected! Clearing products collection...');

    const result = await Product.deleteMany({});

    console.log(`✅ Successfully deleted ${result.deletedCount} products`);
    console.log('Products collection is now empty and ready for fresh data!');

    process.exit(0);
  } catch (error) {
    console.error('Error clearing products:', error);
    process.exit(1);
  }
};

clearProducts();