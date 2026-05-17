const express = require('express')
const router = express.Router()
const {
  getBalanceHistory,
  addBalance,
  updateBalanceHistory,
  deleteBalanceHistory,
} = require('../controllers/balanceHistoryController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.route('/').get(getBalanceHistory).post(addBalance)
router.route('/:id').put(updateBalanceHistory).delete(deleteBalanceHistory)

module.exports = router
