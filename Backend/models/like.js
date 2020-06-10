'use strict';
module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define('Like', {
    idMESSAGES: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER
  }, {});
  Likes.associate = function(models) {
    // associations can be defined here
    models.Like.belongsTo(models.User, {
	    foreignKey: {
	        allowNull: false
	    }
	});
    models.Like.belongsTo(models.Message, {
        foreignKey: {
            allowNull: false
        }
    });
  };
  return Likes;
};

