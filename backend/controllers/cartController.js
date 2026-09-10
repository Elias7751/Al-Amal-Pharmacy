const db = require('../config/db');

// Add or update cart item
const addToCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;
    try {
        // Check if item already exists in cart
        const [existing] = await db.execute('SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?', [user_id, product_id]);
        
        if (existing.length > 0) {
            // Update quantity
            const newQuantity = existing[0].quantity + (quantity || 1);
            await db.execute('UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?', [newQuantity, user_id, product_id]);
        } else {
            // Insert new item
            await db.execute('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity || 1]);
        }
        res.status(200).json({ success: true, message: 'Cart updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get cart items
const getCart = async (req, res) => {
    const user_id = req.user.id;
    try {
        const [cart] = await db.execute(`
            SELECT c.id as cart_item_id, c.quantity, p.id as product_id, p.name_ar, p.name_en, p.price, p.image, p.stock
            FROM cart_items c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `, [user_id]);
        
        let total_price = 0;
        cart.forEach(item => {
            total_price += item.price * item.quantity;
        });

        res.json({ success: true, cart, total_price });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Remove from cart
const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    const user_id = req.user.id;
    try {
        await db.execute('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [user_id, productId]);
        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    const user_id = req.user.id;
    try {
        await db.execute('DELETE FROM cart_items WHERE user_id = ?', [user_id]);
        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { addToCart, getCart, removeFromCart, clearCart };
