const Product = require('../models/Product');
const Category = require('../models/Category');

class ProductService {
  static async getAllProducts(filters = {}) {
    const whereClause = { isActive: true };
    
    if (filters.categoryId) whereClause.categoryId = filters.categoryId;
    if (filters.requiresPrescription !== undefined) {
      whereClause.requiresPrescription = filters.requiresPrescription === 'true';
    }

    return await Product.findAll({
      where: whereClause,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
  }

  static async getProductById(id) {
    const product = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }]
    });
    if (!product) throw new Error('Product not found');
    return product;
  }

  static async createProduct(data) {
    return await Product.create(data);
  }

  static async updateProduct(id, data) {
    const product = await this.getProductById(id);
    return await product.update(data);
  }

  static async deleteProduct(id) {
    const product = await this.getProductById(id);
    // Soft delete
    return await product.update({ isActive: false });
  }
}

module.exports = ProductService;
