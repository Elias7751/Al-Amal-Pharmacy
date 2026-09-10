const db = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Sales (assuming all non-cancelled orders count towards sales)
        const [salesResult] = await db.execute("SELECT SUM(total_amount) as total_sales FROM orders WHERE status != 'cancelled'");
        const totalSales = salesResult[0].total_sales || 0;

        // 2. Total Orders
        const [ordersResult] = await db.execute("SELECT COUNT(id) as total_orders FROM orders");
        const totalOrders = ordersResult[0].total_orders || 0;

        // 3. Total Products
        const [productsResult] = await db.execute("SELECT COUNT(id) as total_products FROM products");
        const totalProducts = productsResult[0].total_products || 0;

        // 4. Total Users
        const [usersResult] = await db.execute("SELECT COUNT(id) as total_users FROM users WHERE role != 'admin'");
        const totalUsers = usersResult[0].total_users || 0;

        // 5. Recent 5 Orders
        const [recentOrders] = await db.execute("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5");

        res.json({
            success: true,
            stats: {
                totalSales,
                totalOrders,
                totalProducts,
                totalUsers,
                recentOrders
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching analytics' });
    }
};

module.exports = { getDashboardStats };
