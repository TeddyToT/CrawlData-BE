const ArticleModel = require("../models/article.model")
const CategoryModel = require("../models/category.model")
const CrawlService = require("./crawl.service")

class ArticleService {
  static async addArticle({ title, url, thumbnail, categoryId }) {

    const checkDuplicate = await ArticleModel.findByTitleAndUrl({title, url})

    console.log(checkDuplicate.length, " cua ", title);
    if (Object.keys(checkDuplicate).length !== 0){
      console.log("message: ", `Article ${title} alrady exists`);
      return {success: false, message: `Article ${title} alrady exists`}
    }

    const article = await CrawlService.crawlArticle({newURL:url})
    if(article.success === false){
      return article
    }

    Object.assign(article, { title, url, thumbnail, categoryId });
    const newArticle = await ArticleModel.create(article)
      return {newArticle: newArticle}

  }

  static async crawlNewArticles(){
    const Categories = await CategoryModel.getAll();

    for (const category of Categories){
      const savedArticles = []
      const newArticles = await CrawlService.crawlNewArticle(category)
      for (const article of newArticles)
      {
        const savedArticle = await this.addArticle(article)
        console.log("saved article: ",savedArticle);
        savedArticles.push(savedArticle)
      }

    }


    return {success: true};
  }


}

module.exports = ArticleService;