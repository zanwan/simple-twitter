const db = require("../models")
const helpers = require("../_helpers");
const { Tweet, User, Like, Reply } = db

const blockController = {
  getPopular: (req, res, callback) => {
    let popUser = ""
    //查詢網紅
    //不知道如何排除特定
    User.findAll({
      order: [["FollowerCounts", "DESC"]],
      // 這裏如果關聯以下會出現重複，目前不知道怎麼辦
      // include: { model: User, as: "Followers" },
      limit: 10,
      nest: true,
      raw: true
    }).then(popusers => {
      //將是否已追蹤網紅的資訊，塞入網紅資料包中
      const popUserData = popusers.map(p => ({
        ...p,
        isFollowed: helpers.getUser(req).Followings.map(f => f.id).includes(p.id)
      }))
      const removeUserSelf = popUserData.filter(p => p.id !== helpers.getUser(req).id)
      popUser = removeUserSelf
      callback({ popUser })
    })
  },

  getSideUserProfile: (req, res, callback) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Tweet },
        { model: Like },
        { model: User, as: "Followings" },
        { model: User, as: "Followers" }
      ]
    }).then(userData => {
      //整理資料
      const tweetArr = userData.dataValues.Tweets.map(tweet => tweet.id)

      // 判斷使用者是否追蹤
      const isfollowed = userData.dataValues.Followers.map(f => f.id).includes(helpers.getUser(req).id)

      callback({ tweetArr, isfollowed, userData })
    })
  }
}

module.exports = blockController
