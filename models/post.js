//Importe Sequelize
const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../config/db')

//Modele d'un post
class Post extends Model{}
Post.init({
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  userId: {
      type: Sequelize.INTEGER,
      allowNull: false
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING
  }
}, {
  timestamps: true,
  modelName: 'posts',
  sequelize
});  

Post.sync()
module.exports = Post

