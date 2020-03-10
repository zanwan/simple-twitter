"use strict";
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    "Reply",
    {
      TweetId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      Comment: DataTypes.STRING
    },
    {}
  );
  Reply.associate = function(models) {};
  return Reply;
};
