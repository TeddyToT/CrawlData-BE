const CategoryModel = require("../models/category.model")

class CategoryService{
    static async getAllCategories(){
        const categories = await CategoryModel.getAll()
        if (categories.length === 0){
          return {success: false, categories: categories}
        }
        return {success: true, categories: categories}
    }

    static async getCategoryBySlug({slug}){
        const category = await CategoryModel.findBySlug(slug)
        if (!category || Object.keys(category).length === 0)
          return { success: false, message: "Wrong slug"}
        return { success: true, category: category};
    }

    static async getCategoryById({id}){
        const category = await CategoryModel.findById(id)
        if (!category || Object.keys(category).length === 0)
          return { success: false, message: "Wrong id"}
        return { success: true, category: category};
    }
}

module.exports = CategoryService;