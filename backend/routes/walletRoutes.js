const express = require('express')
const router = express.Router()
const { getWallet, setWallet } = require('../controllers/walletController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.route('/').get(getWallet).put(setWallet)

module.exports = router
