const CategoryModel = require("../models/category.model")

class CategoryService{
    static async getAllCategories(){
        const categories = await CategoryModel.getAll()
        return categories;
    }
}

module.exports = CategoryService;