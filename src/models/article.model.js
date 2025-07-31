const pool = require("../providers/pg")

class ArticleModel {
    static async create({title, url, thumbnail, categoryId, date, author, sapo, img, photoCaption, content}){
      
      const result = await pool.query(
      `INSERT INTO article (title, url, thumbnail, categoryId, date, author, sapo, img, photoCaption, content)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [title, url, thumbnail, categoryId, date, author, sapo, img, photoCaption, content]
    );
    return result.rows;


    }


    static async findByUrl({url}){
      const result = await pool.query(
        'SELECT title FROM ARTICLE WHERE url = $1',[url]
      )
      return result.rows
    }

    static async getAllArticles(){
      const result = await pool.query(
        'SELECT * FROM ARTICLE'
      )
      return result.rows
    }

    static async getArticlesByCategory({categoryId}){
      const result = await pool.query(
        'SELECT * FROM ARTICLE WHERE categoryId = $1',[categoryId]
      )
      return result.rows
    }

}

module.exports = ArticleModel