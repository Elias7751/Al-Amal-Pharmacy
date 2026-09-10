const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

class CartService {
  /**
   * Get the active cart for a user. Creates one if it doesn't exist.
   */
  static async getCartByUserId(userId) {
    let cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'price', 'stock', 'images', 'isActive'] }]
        }
      ]
    });

    if (!cart) {
      cart = await Cart.create({ userId });
      cart.items = []; // New cart has no items
    }

    return cart;
  }

  /**
   * Add an item to the cart or update its quantity
   */
  static async addItemToCart(userId, productId, quantity) {
    const cart = await this.getCartByUserId(userId);
    
    // Check if product exists and has enough stock
    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) {
      throw new Error('Product not found or inactive');
    }
    if (product.stock < quantity) {
      throw new Error(`Only ${product.stock} items left in stock`);
    }

    // Check if item already in cart
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId }
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new Error(`Cannot add more. Only ${product.stock} items left in stock`);
      }
      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity
      });
    }

    return await this.getCartByUserId(userId); // Return updated cart
  }

  /**
   * Remove an item from the cart
   */
  static async removeItemFromCart(userId, itemId) {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    const cartItem = await CartItem.findOne({
      where: { id: itemId, cartId: cart.id }
    });

    if (!cartItem) throw new Error('Item not found in cart');

    await cartItem.destroy();
    return await this.getCartByUserId(userId);
  }

  /**
   * Clear the entire cart
   */
  static async clearCart(userId) {
    const cart = await Cart.findOne({ where: { userId } });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
    }
    return { message: 'Cart cleared successfully' };
  }
}

module.exports = CartService;
