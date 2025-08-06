const express = require("express")
const CategoryController = require("../../controllers/category.controller")

const router = express.Router()


router.get('/crawl', CategoryController.crawlNewCategories)
router.get('/', CategoryController.getAllCategories)
router.get('/slug', CategoryController.getCategoryBySlug)
router.get('/id', CategoryController.getCategoryById)

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

/**
 * @swagger
 * /api/category/slug:
 *   get:
 *     summary: Get category by slug
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: Slug of the category
 *     responses:
 *       200:
 *         description: category with the specified slug
 *       404:
 *         description: category not found
 */
/**
 * @swagger
 * /api/category/id:
 *   get:
 *     summary: Get category by id
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: category with the specified id
 *       404:
 *         description: category not found
 */

