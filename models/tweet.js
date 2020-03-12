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
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
    Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
    Tweet.belongsTo(models.User)

    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers'
    })
  };
  return Tweet;
};
