const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Transport', 'Food', 'Recharge', 'Other'],
      required: [true, 'Category is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: String, // "YYYY-MM-DD" — matches frontend format
      required: [true, 'Date is required'],
    },
    time: {
      type: String, // "HH:MM" — matches frontend format
      required: [true, 'Time is required'],
    },
    method: {
      type: String,
      enum: ['cash', 'online'],
      required: [true, 'Payment method is required'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Expense', expenseSchema)
