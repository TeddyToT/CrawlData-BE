const ArticleModel = require("../models/article.model");
const CategoryModel = require("../models/category.model");
const CrawlService = require("./crawl.service");
const writeLog = require("../utils/logger");

class ArticleService {
  static async addArticle({ title, url, thumbnail, categoryId }) {
    const checkDuplicate = await ArticleModel.findByUrl({ url });

    if (Object.keys(checkDuplicate).length !== 0) {
      console.log(`Article "${title}" already exists`);
      return { success: false, message: `Article ${title} already exists` };
    }
    console.log(`Crawling Article "${title}"`);
    const article = await CrawlService.crawlArticle({ newURL: url });
    if (article.success === false) {
      writeLog(`Failed to crawl article: "${title}" - ${article.message}`);
      return article;
    }

    Object.assign(article, { title, url, thumbnail, categoryId });
    const newArticle = await ArticleModel.create(article);

    // writeLog(`Article saved: "${title}" (${url})`);

    return { newArticle };
  }

  static async crawlNewArticles() {
    const categories = await CategoryModel.getAll();
    const allResults = [];

    for (const category of categories) {
      try {
        console.log(`\nCrawling articles from ${category.name} category`);
        const newArticles = await this.crawlArticlesByCategory(category);
        allResults.push(...newArticles);
      } catch (err) {
        const msg = `[Category: ${category.name}] Error crawling category: ${err.message}`;
        console.error(msg);
        writeLog(msg);
        continue;
      }
    }

    return { success: true, articles: allResults };
  }

  static async crawlArticlesByCategory(category) {
    const savedArticles = [];
    const newArticles = await CrawlService.crawlNewArticlesByCategory(category);
    console.log(` Found ${newArticles.length} articles in category: "${category.name}"`);

    for (const article of newArticles) {
      try {
        const saved = await this.addArticle(article);
        if (saved?.success === false){
          continue;
        }
        savedArticles.push(saved);
      } catch (err) {
        console.error(
          `[Article: ${article.title}] Error saving article:`,
          err.message
        );
        continue;
      }
    }

    return savedArticles;
  }

  static async getAllArticles(){
        const articles = await ArticleModel.getAllArticles()
        return articles;
  }

  static async getArticlesByCategory({categoryId}){
        const articles = await ArticleModel.getArticlesByCategory({categoryId})
        return articles;
  }

}

module.exports = ArticleService;
