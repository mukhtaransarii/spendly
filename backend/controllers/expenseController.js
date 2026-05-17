const Expense = require('../models/Expense')

// @desc  Get all expenses of logged-in user
// @route GET /api/expenses
// @access Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1, time: -1 })
    res.json(expenses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc  Create a new expense
// @route POST /api/expenses
// @access Private
const createExpense = async (req, res) => {
  try {
    const { title, category, amount, note, date, time, method } = req.body

    if (!title || !category || !amount || !date || !time || !method) {
      return res.status(400).json({ message: 'Please provide all required fields' })
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      category,
      amount,
      note: note || '',
      date,
      time,
      method,
    })

    res.status(201).json(expense)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc  Update an expense
// @route PUT /api/expenses/:id
// @access Private
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    // Make sure the expense belongs to the logged-in user
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this expense' })
    }

    const { title, category, amount, note, date, time, method } = req.body

    expense.title = title ?? expense.title
    expense.category = category ?? expense.category
    expense.amount = amount ?? expense.amount
    expense.note = note ?? expense.note
    expense.date = date ?? expense.date
    expense.time = time ?? expense.time
    expense.method = method ?? expense.method

    const updated = await expense.save()
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc  Delete an expense
// @route DELETE /api/expenses/:id
// @access Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' })
    }

    await expense.deleteOne()
    res.json({ message: 'Expense deleted', id: req.params.id })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense }
