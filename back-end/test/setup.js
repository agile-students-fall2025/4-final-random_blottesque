import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

// Connect to MongoDB before tests
before(async function() {
  this.timeout(10000); // Allow 10 seconds for connection
  
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roomier_test';
  
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for tests');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
});

// Clean up after all tests
after(async function() {
  try {
    // Optionally clean up test data
    // await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  }
});
