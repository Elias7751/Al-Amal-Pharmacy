const db = require('../config/db');

// Add address
const addAddress = async (req, res) => {
    const { title, address_line, city, phone, is_default } = req.body;
    const user_id = req.user.id;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        if (is_default) {
            await connection.execute('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [user_id]);
        }

        const [result] = await connection.execute(
            'INSERT INTO addresses (user_id, title, address_line, city, phone, is_default) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, title, address_line, city, phone, is_default ? 1 : 0]
        );

        await connection.commit();
        res.status(201).json({ success: true, message: 'Address added', id: result.insertId });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    } finally {
        if (connection) connection.release();
    }
};

// Get addresses
const getAddresses = async (req, res) => {
    const user_id = req.user.id;
    try {
        const [addresses] = await db.execute('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC', [user_id]);
        res.json({ success: true, addresses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete address
const deleteAddress = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        await db.execute('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, user_id]);
        res.json({ success: true, message: 'Address deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { addAddress, getAddresses, deleteAddress };
