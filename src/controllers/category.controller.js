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
            const result = await CategoryService.getAllCategories()
            return res.status(201).json({success: result.success, categories:result.categories})
        } catch (error) {
            next(error)
        }
    }

    getCategoryBySlug = async (req, res, next) => {
        try {
            const result = await CategoryService.getCategoryBySlug(req.query)
            return res.status(200).json({
                success: result.success,
                message: result?.message,
                category: result.category
            })
        }catch (error) {
            next(error)
        }
    }

    getCategoryById = async (req, res, next) => {
        try {
            const result = await CategoryService.getCategoryById(req.query)
            return res.status(200).json({
                success: result.success,
                message: result?.message,
                category: result.category
            })
        }catch (error) {
            next(error)
        }
    }
}
module.exports = new CategoryController()