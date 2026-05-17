const Wallet = require('../models/Wallet')

// @desc  Get wallet of logged-in user
// @route GET /api/wallet
// @access Private
const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id })

    if (!wallet) {
      // Shouldn't happen since wallet is created on register, but just in case
      const newWallet = await Wallet.create({ user: req.user._id, cash: 0, online: 0 })
      return res.json(newWallet)
    }

    res.json(wallet)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc  Set wallet balances directly (used when syncing/correcting)
// @route PUT /api/wallet
// @access Private
const setWallet = async (req, res) => {
  try {
    const { cash, online } = req.body

    const wallet = await Wallet.findOneAndUpdate(
      { user: req.user._id },
      { cash, online },
      { new: true, upsert: true }
    )

    res.json(wallet)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getWallet, setWallet }
