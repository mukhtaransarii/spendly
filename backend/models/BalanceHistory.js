const mongoose = require('mongoose')

const balanceHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cash: {
      type: Number,
      default: 0, // amount added to cash (can be 0 if only online was added)
    },
    online: {
      type: Number,
      default: 0, // amount added to online (can be 0 if only cash was added)
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: String, // "YYYY-MM-DD"
      required: [true, 'Date is required'],
    },
    time: {
      type: String, // "HH:MM"
      required: [true, 'Time is required'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('BalanceHistory', balanceHistorySchema)
