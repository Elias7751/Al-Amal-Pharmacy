const db = require('../config/db');

// Add to wishlist
const addToWishlist = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;
    try {
        await db.execute('INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)', [user_id, product_id]);
        res.status(201).json({ success: true, message: 'Added to wishlist' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    const user_id = req.user.id;
    try {
        await db.execute('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [user_id, productId]);
        res.json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
    const user_id = req.user.id;
    try {
        const [wishlist] = await db.execute(`
            SELECT w.product_id, p.name_ar, p.name_en, p.price, p.image, p.stock
            FROM wishlist w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = ?
            ORDER BY w.created_at DESC
        `, [user_id]);
        res.json({ success: true, wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist };
