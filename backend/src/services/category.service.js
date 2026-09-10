const Category = require('../models/Category');

class CategoryService {
  static async getAllCategories() {
    return await Category.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
    });
  }

  static async getCategoryById(id) {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Category not found');
    return category;
  }

  static async createCategory(data) {
    const existing = await Category.findOne({ where: { name: data.name } });
    if (existing) throw new Error('Category with this name already exists');
    return await Category.create(data);
  }

  static async updateCategory(id, data) {
    const category = await this.getCategoryById(id);
    return await category.update(data);
  }

  static async deleteCategory(id) {
    const category = await this.getCategoryById(id);
    // Soft delete by setting isActive to false
    return await category.update({ isActive: false });
  }
}

module.exports = CategoryService;
