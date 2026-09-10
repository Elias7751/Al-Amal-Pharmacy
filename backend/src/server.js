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

        // Auto-create or force update admin account
        const User = require('./models/User');
        const bcrypt = require('bcrypt');
        const adminEmail = 'admin@alamal.com';
        const plainPassword = '123456';
        
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        if (!existingAdmin) {
            await User.create({
                firstName: 'مدير',
                lastName: 'النظام',
                email: adminEmail,
                password: plainPassword,
                role: 'admin',
                phone: '0500000000'
            });
            console.log('✅ تم إنشاء حساب المدير الافتراضي بنجاح.');
        } else {
            // Force update password and role just to be safe
            existingAdmin.password = plainPassword;
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('✅ تم إعادة تعيين كلمة مرور حساب المدير إلى 123456.');
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
