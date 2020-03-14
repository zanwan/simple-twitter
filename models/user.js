"use strict"
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      introduction: DataTypes.TEXT,
      role: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN
    },
    {}
  )
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
    User.hasMany(models.Reply)
    // 被 User 追蹤
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    // 追蹤 User 的粉絲
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: "followerId",
      as: "Followers"
    })
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignkey: "UserId",
      as: "LikedTweets"
    })
  }
  return User
}
