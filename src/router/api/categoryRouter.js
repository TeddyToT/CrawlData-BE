const express = require("express")
const CategoryController = require("../../controllers/category.controller")

const router = express.Router()


router.get('/crawl', CategoryController.crawlNewCategories)
router.get('/', CategoryController.getAllCategories)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category Management
 */
/**
 * @swagger
 * /api/category/crawl:
 *   get:
 *     summary: Crawl new categories from tuoitre.vn
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: New categories successfully crawled and saved
 *       500:
 *         description: Server error during crawling
 */
/**
 * @swagger
 * /api/category/:
 *   get:
 *     summary: Get all categories from the database
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */

