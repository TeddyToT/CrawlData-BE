const pool = require("../database/pg")

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


    static async findByTitleAndUrl({title, url}){
      const result = await pool.query(
        'SELECT title FROM ARTICLE WHERE url = $1',[url]
      )
      console.log(result.rows);
      return result.rows
    }
}

module.exports = ArticleModel