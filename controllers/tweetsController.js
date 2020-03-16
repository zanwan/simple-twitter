const db = require("../models")
const { Tweet, User, Like, Reply } = db
const blockController = require("./blockController")

const tweetsController = {
  getTweets: (req, res) => {
    let popData = ""
    //呼叫封裝的函式
    blockController.getPopular(req, res, data => {
      return (popData = data)
    })
    return Tweet.findAll({
      include: [{ model: User }, { model: Like }, { model: Reply }],
      order: [["createdAt", "DESC"]],
      limit: 20,
      nest: true
    }).then(tweets => {
      //以兩個參數輸出
      //打包資料，偷塞資料
      let addCountData = tweets.map(t => ({
        ...t.dataValues,
        User: t.User.dataValues,
        isLiked: req.user.Likes.map(l => l.TweetId).includes(t.id)
      }))
      return res.render("tweetsHome", { tweets: addCountData, popUsers: popData.popUser })
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
  postTweet: (req, res) => {
    if (!req.body.replyMsg) {
      req.flash("error_messages", "沒有輸入任何推播訊息")
      return res.redirect("back")
    }
    return Reply.create({
      UserId: +res.locals.user.id,
      TweetId: Number(req.params.tweet_id),
      comment: req.body.replyMsg
    }).then(comment => {
      res.redirect(`/tweets/${req.params.tweet_id}/replies`)
    })
  }
}
module.exports = tweetsController
