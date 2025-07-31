const express = require("express")
const ArticleController = require("../../controllers/article.controller")

const router = express.Router()

router.get('/', ArticleController.getAllArticles)
router.post('/', ArticleController.addArticle)
router.get('/category', ArticleController.getArticlesByCategory)
router.get('/crawl', ArticleController.crawlNewAricles)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Articles Management
 */


/**
 * @swagger
 * /api/article/:
 *   get:
 *     summary: Get All Articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Get all articles from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /api/article/:
 *   post:
 *     summary: Add New Article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - url
 *               - thumbnail
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Article successfully created
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/article/category:
 *   get:
 *     summary: Get articles by category
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Articles in the specified category
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/article/crawl:
 *   get:
 *     summary: Crawl new articles from categories
 *     tags: [Articles]
 *     responses:
 *       201:
 *         description: Articles successfully crawled
 *       500:
 *         description: Server error during crawl
 */





