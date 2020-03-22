"use strict"
module.exports = (sequelize, DataTypes) => {
  const Messagelog = sequelize.define(
    "Messagelog",
    {
      senterId: DataTypes.INTEGER,
      getterId: DataTypes.INTEGER,
      roomId: DataTypes.INTEGER,
      message: DataTypes.STRING
    },
    {}
  )
  Messagelog.associate = function(models) {
    // associations can be defined here
  }
  return Messagelog
}
