const express = require("express")
const ArticleController = require("../../controllers/article.controller")

const router = express.Router()


router.post('/', ArticleController.addArticle)

module.exports = router
