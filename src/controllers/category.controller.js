const CrawlService = require("../services/crawl.service")
const CategoryService = require("../services/category.service")

class CategoryController {

     crawlNewCategories = async (req, res, next) => {
        try {
            const categories = await CrawlService.crawlCategory()
            return res.status(201).json({success: categories.success, message:categories?.message, data:categories?.result})
        } catch (error) {
            next(error)
        }
    }

    getAllCategories = async (req, res, next) => {
        try {
            const categories = await CategoryService.getAllCategories()
            return res.status(201).json({success: true, categories:categories})
        } catch (error) {
            next(error)
        }
    }
}
module.exports = new CategoryController()