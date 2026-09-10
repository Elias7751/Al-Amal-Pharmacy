require('dotenv').config();
const app = require('./app');

// Environment variables
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    try {
        // Initialize database connection
        const sequelize = require('./config/database');
        
        // Sync models
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        
        // Sync models with the database (use force: false to avoid dropping tables)
        await sequelize.sync({ force: false });
        console.log('Database models synchronized.');

        // Auto-create admin if it doesn't exist
        const User = require('./models/User');
        const bcrypt = require('bcrypt');
        const adminEmail = 'admin@alamal.com';
        
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('Admin@1234', 10);
            await User.create({
                firstName: 'مدير',
                lastName: 'النظام',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                phone: '0500000000'
            });
            console.log('✅ تم إنشاء حساب المدير الافتراضي بنجاح.');
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
