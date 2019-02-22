'use strict';
module.exports = (sequelize, DataTypes) => {
  const location = sequelize.define('location', {
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    deviceId: {
      type: DataTypes.STRING,
      references: {
        model: 'device',
        key: 'deviceId',
      }
    }
  }, {});
  location.associate = function(models) {
    // associations can be defined here
    location.hasOne(models.device, {
    	foreignKey: {
        name: 'deviceId',
        allowNull: false
    }
    });
  };
  return location;
};