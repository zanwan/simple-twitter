"use strict"
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    "Tweet",
    {
      description: DataTypes.TEXT,
      UserId: DataTypes.INTEGER,
      ReplyCounts: DataTypes.INTEGER,
      LikeCounts: DataTypes.INTEGER
    },
    {}
  )
  Tweet.associate = function(models) {
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
    Tweet.belongsTo(models.User)
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: "TweetId",
      as: "LikedUsers"
    })
  }
  return Tweet
}
