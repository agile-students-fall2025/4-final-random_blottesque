import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

// Chore subdocument schema
const choreSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid()
  },
  title: {
    type: String,
    required: [true, 'Chore title is required'],
    trim: true
  },
  due: {
    type: Date
  },
  assignee: {
    type: String,
    trim: true
  },
  repeat: {
    type: String,
    enum: ['None', 'Daily', 'Weekly', 'Monthly'],
    default: 'None'
  },
  description: {
    type: String,
    trim: true
  },
  done: {
    type: Boolean,
    default: false
  }
}, { _id: false });

// Expense subdocument schema
const expenseSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid()
  },
  description: {
    type: String,
    required: [true, 'Expense description is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  paidBy: {
    email: String,
    name: String
  },
  youOwe: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Inventory item subdocument schema
const inventoryItemSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid()
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Low', 'Good', 'Full'],
    default: 'Good'
  },
  info: {
    type: String,
    trim: true
  }
}, { _id: false });

// Main Group schema
const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  photoUrl: {
    type: String,
    trim: true,
    default: null
  },
  inviteCode: {
    type: String,
    uppercase: true,
    trim: true,
    default: () => nanoid(6).toUpperCase()
  },
  roommates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  components: {
    chores: { type: Boolean, default: true },
    expenses: { type: Boolean, default: true },
    inventory: { type: Boolean, default: true }
  },
  prefs: {
    quietStart: { type: String, default: '22:00' },
    quietEnd: { type: String, default: '06:00' },
    temperatureF: { type: Number, default: 72 },
    guestsAllowed: { type: Boolean, default: true },
    smokingAllowed: { type: Boolean, default: true },
    drinkingAllowed: { type: Boolean, default: true },
    partiesAllowed: { type: Boolean, default: true },
    nightTimeGuestsAllowed: { type: Boolean, default: true },
    accommodations: { type: String, default: 'None' }
  },
  chores: [choreSchema],
  expenses: [expenseSchema],
  inventory: [inventoryItemSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for invite code lookups
groupSchema.index({ inviteCode: 1 });

const Group = mongoose.model('Group', groupSchema);

export default Group;
