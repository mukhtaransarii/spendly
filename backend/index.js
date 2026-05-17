require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/expenses', require('./routes/expenseRoutes'))
app.use('/api/wallet', require('./routes/walletRoutes'))
app.use('/api/balance-history', require('./routes/balanceHistoryRoutes'))

// Health check
app.get('/', (req, res) => res.json({ message: 'Daily Expense API is running' }))

// Error handlers
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
