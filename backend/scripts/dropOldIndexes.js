import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dropOldIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the products collection
    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Get all indexes
    const indexes = await productsCollection.indexes();
    console.log('\nCurrent indexes:');
    indexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // Drop the old 'id_1' index if it exists
    try {
      await productsCollection.dropIndex('id_1');
      console.log('\n✅ Successfully dropped old "id_1" index');
    } catch (error) {
      if (error.code === 27) {
        console.log('\n✅ Index "id_1" does not exist (already removed)');
      } else {
        throw error;
      }
    }

    // Get updated indexes
    const updatedIndexes = await productsCollection.indexes();
    console.log('\nUpdated indexes:');
    updatedIndexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n✅ Index cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error dropping indexes:', error);
    process.exit(1);
  }
};

dropOldIndexes();
