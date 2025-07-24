const express = require("express")
const CategoryController = require("../../controllers/category.controller")

const router = express.Router()


router.get('/crawl', CategoryController.crawlNewCategories)

module.exports = router
