'use strict';
module.exports = (sequelize, DataTypes) => {
  const geofence = sequelize.define('geofence', {
    name: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    radius: DataTypes.DOUBLE
  }, {});
  geofence.associate = function(models) {
    geofence.belongsTo(models.user, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      targetKey: 'id'
    });

    geofence.hasMany(models.geolocation)
  };
  return geofence;
};