"use strict";
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    "Tweet",
    {
      description: DataTypes.TEXT,
      UserId: DataTypes.INTEGER
    },
    {}
  );
  Tweet.associate = function(models) {};
  return Tweet;
};
