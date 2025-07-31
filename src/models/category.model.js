const pool = require("../providers/pg")

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

    static async findById({id}){
    const result = await pool.query('SELECT * FROM CATEGORY WHERE ID = $1',[id]);
    return result.rows;
    }

    static async getAll(){
        const result = await pool.query("SELECT * FROM CATEGORY")
        return result.rows
    }
}

module.exports = CategoryModel