const db = require("../models")
const { Tweet, User, Like, Reply } = db

const tweetsController = {
  getTweets: (req, res) => {
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
        isFollowed: req.user.Followings.map(f => f.id).includes(p.id)
      }))
      const removeUserSelf = popUserData.filter(p => p.id !== req.user.id)
      popUser = removeUserSelf
    })
    // 找出左欄時間週中的推文
    return Tweet.findAll({
      include: [{ model: User }, { model: Like }, { model: Reply }],
      order: [["createdAt", "DESC"]],
      limit: 20,
      nest: true,
      raw: true
    }).then(tweets => {
      //以兩個參數輸出
      return res.render("tweetsHome", { tweets: tweets, popUsers: popUser })
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
        console.log("=====userdata=====")
        console.log(userdata)
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
