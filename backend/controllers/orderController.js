const db = require('../config/db');
const { sendEmail } = require('../utils/emailService');

const createOrder = async (req, res) => {
    let { total_price, customer_name, customer_phone, items, address_id, coupon_code } = req.body;
    const user_id = req.user ? req.user.id : null; 
    let discount_amount = 0;
    let coupon_id = null;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Fetch items from cart if not provided
        if (!items || items.length === 0) {
            if (!user_id) throw new Error('Cart items required for guests');
            const [cartItems] = await connection.execute(`
                SELECT c.product_id as id, c.quantity, p.price 
                FROM cart_items c JOIN products p ON c.product_id = p.id 
                WHERE c.user_id = ?`, [user_id]);
            
            if (cartItems.length === 0) throw new Error('Cart is empty');
            items = cartItems;
            
            // Recalculate total_price if coming from cart
            total_price = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        // 2. Process Coupon
        if (coupon_code) {
            const [coupons] = await connection.execute('SELECT * FROM coupons WHERE code = ?', [coupon_code]);
            if (coupons.length > 0) {
                const coupon = coupons[0];
                if ((!coupon.valid_until || new Date(coupon.valid_until) >= new Date()) && 
                    (!coupon.max_uses || coupon.current_uses < coupon.max_uses)) {
                    
                    discount_amount = (total_price * coupon.discount_percentage) / 100;
                    total_price -= discount_amount;
                    coupon_id = coupon.id;

                    // Update coupon usage
                    await connection.execute('UPDATE coupons SET current_uses = current_uses + 1 WHERE id = ?', [coupon_id]);
                } else {
                    throw new Error('Invalid or expired coupon');
                }
            } else {
                throw new Error('Coupon not found');
            }
        }

        // 3. Insert Order
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, customer_name, customer_phone, total_amount, status, address_id, coupon_id, discount_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, customer_name || null, customer_phone || null, total_price, 'pending', address_id || null, coupon_id, discount_amount]
        );
        const orderId = orderResult.insertId;

        // 4. Verify stock and insert Order Items
        for (const item of items) {
            const [productRows] = await connection.execute('SELECT stock, name_ar FROM products WHERE id = ? FOR UPDATE', [item.id]);
            if (productRows.length === 0) throw new Error(`Product ID ${item.id} not found`);
            if (productRows[0].stock < item.quantity) throw new Error(`Insufficient stock for ${productRows[0].name_ar}`);

            await connection.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.id]);
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );
        }

        // 5. Clear cart if user is logged in
        if (user_id) {
            await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [user_id]);
        }

        await connection.commit();

        // 6. Send Email Notification
        if (user_id) {
            const [users] = await db.execute('SELECT email, name FROM users WHERE id = ?', [user_id]);
            if (users.length > 0 && users[0].email) {
                sendEmail(
                    users[0].email,
                    `تأكيد طلبك رقم #${orderId}`,
                    `شكراً لطلبك من صيدلية الأمل. إجمالي الطلب: ${total_price} ريال`,
                    `<h1>شكراً لطلبك!</h1><p>تم استلام طلبك رقم <strong>#${orderId}</strong> بنجاح. الإجمالي: ${total_price} ريال.</p>`
                );
            }
        }

        res.status(201).json({ success: true, message: 'Order created successfully', orderId });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    } finally {
        if (connection) connection.release();
    }
};

const getOrders = async (req, res) => {
    const user_id = req.user ? req.user.id : null;
    const role = req.user ? req.user.role : 'guest';

    try {
        let query = 'SELECT * FROM orders ORDER BY created_at DESC';
        let params = [];

        if (role !== 'admin') {
            if (!user_id) return res.status(403).json({ success: false, message: 'Unauthorized' });
            query = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
            params = [user_id];
        }

        const [orders] = await db.execute(query, params);
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;
    try {
        await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
        
        // Notify user via email
        const [orders] = await db.execute('SELECT user_id FROM orders WHERE id = ?', [orderId]);
        if (orders.length > 0 && orders[0].user_id) {
            const [users] = await db.execute('SELECT email, name FROM users WHERE id = ?', [orders[0].user_id]);
            if (users.length > 0 && users[0].email) {
                sendEmail(
                    users[0].email,
                    `تحديث حالة الطلب #${orderId}`,
                    `تغيرت حالة طلبك إلى: ${status}`,
                    `<h1>تحديث حالة الطلب</h1><p>عزيزي ${users[0].name}، لقد تغيرت حالة طلبك رقم <strong>#${orderId}</strong> إلى: <strong>${status}</strong>.</p>`
                );
            }
        }

        res.json({ success: true, message: 'Order status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getOrderById = async (req, res) => {
    const orderId = req.params.id;
    const user_id = req.user ? req.user.id : null;
    const role = req.user ? req.user.role : 'guest';

    try {
        const [orders] = await db.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (orders.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });

        const order = orders[0];
        if (role !== 'admin' && order.user_id !== user_id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
        }

        const [items] = await db.execute(`
            SELECT oi.id, oi.quantity, oi.price, p.name_ar as product_name, p.image as image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [orderId]);

        order.items = items;
        res.json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
