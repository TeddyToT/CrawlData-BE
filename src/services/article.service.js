const ArticleModel = require("../models/article.model")
const CrawlService = require("./crawl.service")

class ArticleService {
  static async addArticle({ url }) {

    const article = await CrawlService.crawlArticle({newURL:url})

    const newArticle = await ArticleModel.create(article)
    //   if (exists)
      return newArticle;

  }
}

module.exports = ArticleService;