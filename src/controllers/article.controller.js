const ArticleService = require("../services/article.service")


class ArticleController {

     addArticle = async (req, res, next) => {
        try {
            const article = await ArticleService.addArticle(req.body)
            return res.status(201).json({success: true, article})
        } catch (error) {
            next(error)
        }
    }

    crawlNewAricles = async (req, res, next) => {
        try {
            const result = await ArticleService.crawlNewArticles()
            return res.status(201).json({
                success: result.success, 
                articles: result.articles})
        } catch (error) {
            next(error)
        }
    }

    getAllArticles = async (req, res, next) => {
        try {
            const result = await ArticleService.getAllArticles()
            return res.status(200).json({
                success: result.success,
                articles: result.articles
            })
        }catch (error) {
            next(error)
        }
    }

     getArticlesByCategory = async (req, res, next) => {
        try {
            const result = await ArticleService.getArticlesByCategory(req.query)
            return res.status(200).json({
                success: result.success,
                articles: result.articles
            })
        }catch (error) {
            next(error)
        }
    }

    getArticleById = async (req, res, next) => {
        try {
            const result = await ArticleService.getArticleById(req.query)
            return res.status(200).json({
                success: result.success,
                message: result.message,
                article: result.article
            })
        }catch (error) {
            next(error)
        }
    }
}
module.exports = new ArticleController()