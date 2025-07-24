const CrawlService = require("../services/crawl.service")


class CategoryController {

     crawlNewCategories = async (req, res, next) => {
        try {
            const categories = await CrawlService.crawlCategory()
            return res.status(201).json({success: categories.success, message:categories?.message, data:categories?.result})
        } catch (error) {
            next(error)
        }
    }
}
module.exports = new CategoryController()