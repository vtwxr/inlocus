'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.geolocation);
    user.hasMany(models.application);
    user.hasOne(models.roles);
    user.hasOne(models.SDK);
    user.hasMany(models.beacon_master);
    user.hasMany(models.tags);
    user.hasMany(models.location_master);
  };
  return user;
};