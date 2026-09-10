const { Sequelize } = require('sequelize');

let sequelize;

// في Render يتم توفير DATABASE_URL تلقائياً لـ PostgreSQL
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // مطلوب لـ Render
      }
    }
  });
} else {
  // للتطوير المحلي - MySQL
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: process.env.DB_DIALECT || 'mysql',
      logging: false,
    }
  );
}

module.exports = sequelize;
