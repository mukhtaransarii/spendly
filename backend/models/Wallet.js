const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one wallet per user
    },
    cash: {
      type: Number,
      default: 0,
      min: [0, 'Cash cannot be negative'],
    },
    online: {
      type: Number,
      default: 0,
      min: [0, 'Online balance cannot be negative'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Wallet', walletSchema)
