const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const CouponService = require('./coupon.service');
const NotificationService = require('./notification.service');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const CartService = require('./cart.service');
const sequelize = require('../config/database');

class OrderService {
  /**
   * Create an order from the user's active cart
   */
  static async checkout(userId, shippingAddress, paymentMethod, couponCode) {
    // 1. Get user cart
    const cart = await CartService.getCartByUserId(userId);
    
    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // 2. Start a transaction
    const transaction = await sequelize.transaction();

    try {
      let totalAmount = 0;
      const orderItemsData = [];

      // 3. Verify stock and calculate total
      for (const cartItem of cart.items) {
        const product = cartItem.product;
        
        if (!product || !product.isActive) {
          throw new Error(`Product ${product.name} is no longer available`);
        }
        if (product.stock < cartItem.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const price = parseFloat(product.price);
        totalAmount += price * cartItem.quantity;

        orderItemsData.push({
          productId: product.id,
          quantity: cartItem.quantity,
          price: price // freeze the price
        });
        
        // Decrease stock
        await Product.update(
          { stock: product.stock - cartItem.quantity },
          { where: { id: product.id }, transaction }
        );
        
        // Log Inventory OUT
        await Inventory.create({
          productId: product.id,
          type: 'OUT',
          quantity: cartItem.quantity,
          reference: 'Checkout',
          notes: `Cart Checkout for user ${userId}`
        }, { transaction });
      }

      let discountApplied = 0;
      if (couponCode) {
        try {
          const coupon = await CouponService.validateCoupon(couponCode);
          const discountPercentage = coupon.discountPercentage;
          discountApplied = (totalAmount * discountPercentage) / 100;
          totalAmount = totalAmount - discountApplied;
        } catch (couponError) {
          throw new Error(`Coupon Error: ${couponError.message}`);
        }
      }

      // 4. Create the Order
      const order = await Order.create({
        userId,
        shippingAddress,
        totalAmount,
        discountApplied,
        paymentMethod,
        status: 'Pending'
      }, { transaction });

      // 5. Create Order Items
      for (const itemData of orderItemsData) {
        itemData.orderId = order.id;
        await OrderItem.create(itemData, { transaction });
      }

      // 6. Clear the cart
      await CartService.clearCart(userId);

      await transaction.commit();
      return await this.getOrderById(userId, order.id);

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get all orders for a specific user
   */
  static async getUserOrders(userId) {
    return await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'images', 'isActive'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Get specific order details (Ensure it belongs to the user or requested by admin)
   */
  static async getOrderById(userId, orderId) {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'images', 'isActive'] }]
        }
      ]
    });
    if (!order) throw new Error('Order not found');
    return order;
  }

  /**
   * Admin: Get all orders
   */
  static async getAllOrders() {
    return await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'images', 'isActive'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Admin: Update order status
   */
  static async updateOrderStatus(orderId, statusData) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error('Order not found');
    
    const updatedOrder = await order.update(statusData);

    // Send a notification if the primary status changed
    if (statusData.status) {
      await NotificationService.createNotification(
        order.userId,
        'Order Status Updated',
        `Your order #${order.id} status is now: ${statusData.status}`
      );
    }

    return updatedOrder;
  }
}

module.exports = OrderService;
