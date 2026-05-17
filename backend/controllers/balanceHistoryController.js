const BalanceHistory = require('../models/BalanceHistory')
const Wallet = require('../models/Wallet')

// @desc  Get all balance history of logged-in user
// @route GET /api/balance-history
// @access Private
const getBalanceHistory = async (req, res) => {
  try {
    const history = await BalanceHistory.find({ user: req.user._id }).sort({ date: -1, time: -1 })
    res.json(history)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc  Add balance — creates history entry AND updates wallet
// @route POST /api/balance-history
// @access Private
const addBalance = async (req, res) => {
  try {
    const { cash, online, note, date, time } = req.body

    if (cash === undefined || online === undefined || !date || !time) {
      return res.status(400).json({ message: 'Please provide cash, online, date and time' })
    }

    if (cash < 0 || online < 0) {
      return res.status(400).json({ message: 'Cash and online amounts cannot be negative' })
    }

    // Create history entry
    const entry = await BalanceHistory.create({
      user: req.user._id,
      cash,
      online,
      note: note || '',
      date,
      time,
    })

    // Add to wallet (upsert-safe)
    const wallet = await Wallet.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { cash, online } },
      { new: true, upsert: true }
    )

    res.status(201).json({ entry, wallet })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc  Update a balance history entry and re-sync wallet
// @route PUT /api/balance-history/:id
// @access Private
const updateBalanceHistory = async (req, res) => {
  try {
    const entry = await BalanceHistory.findById(req.params.id)

    if (!entry) {
      return res.status(404).json({ message: 'Balance history entry not found' })
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this entry' })
    }

    const { cash: newCash, online: newOnline, note, date, time } = req.body

    // Calculate the diff to apply to wallet
    const cashDiff = (newCash ?? entry.cash) - entry.cash
    const onlineDiff = (newOnline ?? entry.online) - entry.online

    // Update the history entry
    entry.cash = newCash ?? entry.cash
    entry.online = newOnline ?? entry.online
    entry.note = note ?? entry.note
    entry.date = date ?? entry.date
    entry.time = time ?? entry.time

    const updated = await entry.save()

    // Apply diff to wallet
    const wallet = await Wallet.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { cash: cashDiff, online: onlineDiff } },
      { new: true, upsert: true }
    )

    res.json({ entry: updated, wallet })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc  Delete a balance history entry and reverse its effect on wallet
// @route DELETE /api/balance-history/:id
// @access Private
const deleteBalanceHistory = async (req, res) => {
  try {
    const entry = await BalanceHistory.findById(req.params.id)

    if (!entry) {
      return res.status(404).json({ message: 'Balance history entry not found' })
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this entry' })
    }

    // Reverse the balance from wallet
    const wallet = await Wallet.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { cash: -entry.cash, online: -entry.online } },
      { new: true }
    )

    await entry.deleteOne()

    res.json({ message: 'Balance history entry deleted', id: req.params.id, wallet })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getBalanceHistory, addBalance, updateBalanceHistory, deleteBalanceHistory }
