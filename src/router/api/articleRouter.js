const express = require("express")
const ArticleController = require("../../controllers/article.controller")

const router = express.Router()


router.post('/', ArticleController.addArticle)
router.get('/crawl', ArticleController.crawlNewAricles)

module.exports = router
