const db = require("../models")
const helpers = require("../_helpers");
const { Tweet, User, Like, Reply } = db
const blockController = require("./blockController")

const tweetsController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        User,
        Reply,
        { model: User, as: 'LikedUsers' }
      ]
    }).then(tweets => {
      const data = tweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id),
        likeCount: tweet.LikedUsers.length,
        replyCount: tweet.Replies.length
      }))
      User.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'Followers' }]
      }).then(users => {
        //整理 users 資料
        users = users.map(user => ({
          ...user.dataValues,
          // 計算追蹤者人數
          followerCount: user.Followers.length,
          // 判斷目前登入使用者是否已追蹤該 User 物件
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
        }))
        // 依追蹤者人數排序清單
        users = users.sort((a, b) => b.followerCount - a.followerCount)
        return res.render(
          'tweetsHome',
          JSON.parse(
            JSON.stringify({
              tweets: data,
              users: users
            })
          )
        )
      })
    })
  },
  //將新增的推播寫入資料庫
  postTweets: (req, res) => {
    if (!req.body.newTweet) {
      req.flash("error_messages", "沒有輸入任何推播訊息")
      return res.redirect("back")
    }
    return Tweet.create({
      description: req.body.newTweet,
      UserId: res.locals.user.id
    }).then(tweet => {
      req.flash("success_messages", "完成新增一則 tweet")
      res.redirect("/tweets")
    })
  },
  //GET	/tweets/:tweet_id/replies	回覆特定 tweet 的頁面，並看見 tweet 主人的簡介
  getTweet: (req, res) => {
    /* ---------------------------------- */
    /*                待二次重整            */
    /* ---------------------------------- */

    //Tweet 的 reply 一起撈可能無法依時間排序
    return Tweet.findAll({
      where: { id: req.params.tweet_id },
      include: [{ model: User }, { model: Reply, include: [{ model: User }] }, { model: Like }]
    }).then(tweet => {
      tweet = JSON.parse(JSON.stringify(tweet))[0]
      return User.findByPk(tweet.User.id, {
        include: [
          { model: Tweet },
          { model: Like },
          { model: User, as: "Followers" },
          { model: User, as: "Followings" }
        ]
      }).then(userdata => {
        return res.render("replies", { tweet, tweetuser: userdata.get({ plain: true }) })
      })
    })
  },

  //POST	/tweets/:tweet_id/replies	將回覆的內容寫入資料庫
  postReply: (req, res) => {
    return Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id,
      comment: req.body.replyMsg
    }).then(comment => {
      res.redirect(`/tweets/${req.params.tweet_id}/replies`)
    })
  }
}
module.exports = tweetsController
