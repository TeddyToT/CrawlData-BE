const express = require("express")


const router = express.Router()

router.use('/api/article', require('./api/articleRouter'))
router.use('/api/category', require('./api/categoryRouter'))




module.exports = router