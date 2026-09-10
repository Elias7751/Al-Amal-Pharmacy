const db = require('../config/db');

// Add a review for a product
const addReview = async (req, res) => {
    const { product_id, rating, comment } = req.body;
    const user_id = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Check if the user already reviewed this product
        const [existingReview] = await connection.execute(
            'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
            [user_id, product_id]
        );

        if (existingReview.length > 0) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
        }

        // 2. Insert the review
        await connection.execute(
            'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [product_id, user_id, rating, comment || null]
        );

        // 3. Update product rating and reviews count
        // Calculate new average rating
        const [stats] = await connection.execute(
            'SELECT AVG(rating) as avgRating, COUNT(id) as totalReviews FROM reviews WHERE product_id = ?',
            [product_id]
        );
        
        const newAvg = stats[0].avgRating || 0;
        const newTotal = stats[0].totalReviews || 0;

        await connection.execute(
            'UPDATE products SET rating = ?, reviews = ? WHERE id = ?',
            [newAvg, newTotal, product_id]
        );

        await connection.commit();
        res.status(201).json({ success: true, message: 'Review added successfully' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while adding review' });
    } finally {
        if (connection) connection.release();
    }
};

// Get reviews for a specific product
const getProductReviews = async (req, res) => {
    const { productId } = req.params;
    try {
        const [reviews] = await db.execute(`
            SELECT r.id, r.rating, r.comment, r.created_at, u.username 
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `, [productId]);

        res.json({ success: true, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { addReview, getProductReviews };
