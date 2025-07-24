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
}
module.exports = new ArticleController()