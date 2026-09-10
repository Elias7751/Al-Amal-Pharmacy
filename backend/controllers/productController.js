const db = require('../config/db');

const getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

        let query = 'SELECT * FROM products WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
        const params = [];
        const countParams = [];

        // 1. Search by name (Arabic or English)
        if (search) {
            query += ' AND (name_ar LIKE ? OR name_en LIKE ? OR description LIKE ?)';
            countQuery += ' AND (name_ar LIKE ? OR name_en LIKE ? OR description LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
            countParams.push(searchTerm, searchTerm, searchTerm);
        }

        // 2. Filter by Category
        if (category) {
            query += ' AND category_id = ?';
            countQuery += ' AND category_id = ?';
            params.push(category);
            countParams.push(category);
        }

        // 3. Filter by Price Range
        if (minPrice) {
            query += ' AND price >= ?';
            countQuery += ' AND price >= ?';
            params.push(Number(minPrice));
            countParams.push(Number(minPrice));
        }
        if (maxPrice) {
            query += ' AND price <= ?';
            countQuery += ' AND price <= ?';
            params.push(Number(maxPrice));
            countParams.push(Number(maxPrice));
        }

        // 4. Pagination
        const offset = (Number(page) - 1) * Number(limit);
        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        // Note: For LIMIT and OFFSET we have to convert them to numbers, otherwise mysql2 might treat them as strings
        params.push(Number(limit), Number(offset));

        // Execute count query
        const [countResult] = await db.execute(countQuery, countParams);
        const totalProducts = countResult[0].total;

        // Execute data query
        const [products] = await db.execute(query, params);

        res.json({
            success: true,
            products,
            pagination: {
                total: totalProducts,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(totalProducts / Number(limit))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product: products[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const addProduct = async (req, res) => {
    const { name_ar, name_en, category_id, price, stock, image, description, is_prescription, rating, badge_ar, badge_en } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO products (name_ar, name_en, category_id, price, stock, image, description, is_prescription, rating, badge_ar, badge_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name_ar, name_en, category_id, price, stock || 0, image, description || '', is_prescription ? 1 : 0, rating || 5.0, badge_ar || null, badge_en || null]
        );
        res.status(201).json({ success: true, message: 'Product added successfully', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    const { name_ar, name_en, category_id, price, stock, image, description, is_prescription, rating, badge_ar, badge_en } = req.body;
    try {
        await db.execute(
            'UPDATE products SET name_ar=?, name_en=?, category_id=?, price=?, stock=?, image=?, description=?, is_prescription=?, rating=?, badge_ar=?, badge_en=? WHERE id=?',
            [name_ar, name_en, category_id, price, stock, image, description, is_prescription ? 1 : 0, rating, badge_ar, badge_en, req.params.id]
        );
        res.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };
