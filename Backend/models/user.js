'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name1: DataTypes.STRING,
    name2: DataTypes.STRING,
    username: DataTypes.STRING,
    pole: DataTypes.STRING,
    email: DataTypes.STRING,
    mdp: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    // associations can be defined here
        models.User.hasMany(models.Message);
        models.User.hasMany(models.Like);
        models.User.hasMany(models.Comment)
  };
  return User;
};