const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Path or URL to the uploaded prescription image'
  },
  userNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Reviewed', 'Rejected', 'Converted'),
    defaultValue: 'Pending',
  }
}, {
  timestamps: true,
});

// Associations
User.hasMany(Prescription, { foreignKey: 'userId', as: 'prescriptions' });
Prescription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Prescription;
