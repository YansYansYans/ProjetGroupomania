//Importe Sequelize
const { Sequelize, Model } = require('sequelize');
const { sequelize }  = require('../config/db');

//Modele d'un commentaire
class Comment extends Model {}
Comment.init({
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
      type: Sequelize.INTEGER,
      allowNull: false
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  postId: {
      type: Sequelize.INTEGER,
      allowNull: false
  },
  content: {
      type: Sequelize.STRING,
      allowNull: false
  }
}, {
    timestamps: true,
    modelName: 'comments',
    sequelize
})

Comment.sync()
module.exports = Comment;