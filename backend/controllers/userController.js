const db = require('../config/db');

const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, phone, email, role, created_at FROM users ORDER BY created_at DESC');
        res.json({ success: true, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [userCheck] = await db.execute('SELECT role FROM users WHERE id = ?', [id]);
        if (userCheck.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
        
        if (userCheck[0].role === 'admin') {
            return res.status(403).json({ success: false, message: 'Cannot delete an admin' });
        }

        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getAllUsers, deleteUser };
