const db = require('../config/db');

// Create a new coupon (Admin only)
const createCoupon = async (req, res) => {
    const { code, discount_percentage, valid_until, max_uses } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO coupons (code, discount_percentage, valid_until, max_uses) VALUES (?, ?, ?, ?)',
            [code, discount_percentage, valid_until || null, max_uses || null]
        );
        res.status(201).json({ success: true, message: 'Coupon created successfully', id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Validate and apply a coupon
const validateCoupon = async (req, res) => {
    const { code } = req.body;
    try {
        const [coupons] = await db.execute('SELECT * FROM coupons WHERE code = ?', [code]);
        if (coupons.length === 0) {
            return res.status(404).json({ success: false, message: 'Invalid coupon code' });
        }

        const coupon = coupons[0];

        // Check if expired
        if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
            return res.status(400).json({ success: false, message: 'Coupon has expired' });
        }

        // Check if usage limit reached
        if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
            return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
        }

        res.json({ success: true, discount_percentage: coupon.discount_percentage, coupon_id: coupon.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all coupons (Admin)
const getCoupons = async (req, res) => {
    try {
        const [coupons] = await db.execute('SELECT * FROM coupons ORDER BY created_at DESC');
        res.json({ success: true, coupons });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete a coupon (Admin)
const deleteCoupon = async (req, res) => {
    try {
        await db.execute('DELETE FROM coupons WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { createCoupon, validateCoupon, getCoupons, deleteCoupon };
