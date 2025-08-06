const pool = require("../providers/pg")
const toSlug = require("../utils/slug")
class CategoryModel {
    static async create({name, url}){
        const slug = toSlug(name)
        const result = await pool.query(
      `INSERT INTO CATEGORY (name, url, slug)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, url, slug]
    );
    return result.rows[0];
    }

    static async findByName({name}){
    const result = await pool.query('SELECT * FROM CATEGORY WHERE NAME = $1',[name]);
    return result.rows[0];
    }

    static async findById(id){
    const result = await pool.query('SELECT * FROM CATEGORY WHERE ID = $1',[id]);
    return result.rows[0];
    }

    static async findBySlug(slug){
    const result = await pool.query('SELECT * FROM CATEGORY WHERE SLUG = $1',[slug]);
    return result.rows[0];
    }

    static async getAll(){
        const result = await pool.query("SELECT * FROM CATEGORY")
        return result.rows
    }
}

module.exports = CategoryModel