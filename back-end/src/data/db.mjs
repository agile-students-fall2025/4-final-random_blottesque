import mongoose from 'mongoose';

const { Schema } = mongoose;
mongoose.connect(process.env.DSN);