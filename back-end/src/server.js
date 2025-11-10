import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'http';
import app from './app.js';

const PORT = process.env.PORT || 4000;

createServer(app).listen(PORT, () => {
  console.log(`Roomier API running at http://localhost:${PORT}`);
});
