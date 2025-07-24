const pool = require("../database/pg")

class ArticleModel {
    static async create({categoryId, date, title, author, sapo, img, photoCaption, content}){

        const result = await pool.query(
      `INSERT INTO article (categoryId, date, title, author, sapo, img, photoCaption, content)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [categoryId, date, title, author, sapo, img, photoCaption, content]
    );
    return result.rows[0];


    }
}

module.exports = ArticleModel