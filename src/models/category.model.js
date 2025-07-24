const pool = require("../database/pg")

class CategoryModel {
    static async create({name, url}){
        const result = await pool.query(
      `INSERT INTO CATEGORY (name, url)
       VALUES ($1, $2)
       RETURNING *`,
      [name, url]
    );
    return result.rows[0];
    }

    static async findByName({name}){
        const result = await pool.query('SELECT * FROM CATEGORY WHERE NAME = $1',[name]);
    return result.rows[0];
    }
}

module.exports = CategoryModel