//Importe Sequelize
const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db')

//Modele d'un utilisateur
class User extends Model{}
User.init({
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  imageUrl: {
    type: Sequelize.STRING,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
      type: Sequelize.STRING,
      allowNull: false
  }
}, {
  timestamps: false,
  modelName: 'users',
  sequelize
});

User.sync()
module.exports = User
