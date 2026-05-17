const User = require('../models/User')
const Wallet = require('../models/Wallet')
const generateToken = require('../utils/generateToken')

// @desc  Register new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Please provide name, email and password' })
    
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: 'User already exists with this email' })

    const user = await User.create({ name, email, password })

    // Auto-create an empty wallet for the new user
    await Wallet.create({ user: user._id, cash: 0, online: 0 })

    res.status(201).json({user: user, token: generateToken(user._id)})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc  Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' })
    
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid email or password' })
    
    res.json({ user: user, token: generateToken(user._id)})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc  Get logged in user
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.json({_id: req.user._id, name: req.user.name, email: req.user.email,})
}

module.exports = { registerUser, loginUser, getMe }
