import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import app from './app.js';
import connectDB from './data/db.js';

const PORT = process.env.PORT || 4000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start HTTP server
    createServer(app).listen(PORT, '0.0.0.0', () => {
      console.log(`Roomier API running at ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
