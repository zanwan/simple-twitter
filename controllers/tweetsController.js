const db = require('../models')
const { Tweet, User, Like, Reply } = db

const tweetsController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [
        { model: User },
        { model: Like },
        { model: Reply }
      ],
      order: [['updatedAt', 'DESC']],
      limit: 5

    }).then(tweets => {
      //console.log(JSON.parse(JSON.stringify(tweets)))
      return res.render('tweetsHome', { tweets: JSON.parse(JSON.stringify(tweets)) })
    })

  },
  //將新增的推播寫入資料庫
  postTweets: (req, res) => {
    if (!req.body.newTweet) {
      req.flash('error_messages', "沒有輸入任何推播訊息")
      return res.redirect('back')
    }
    return Tweet.create({
      description: req.body.newTweet,
      UserId: res.locals.user.id
    }).then((tweet) => {
      req.flash('success_messages', '完成新增一則 tweet')
      res.redirect('/tweets')
    })
  },
  //GET	/tweets/:tweet_id/replies	回覆特定 tweet 的頁面，並看見 tweet 主人的簡介
  getTweet: (req, res) => {
    return Tweet.findAll({
      where: { id: req.params.tweet_id },
      include: [
        { model: User },
        { model: Reply, include: [{ model: User }] },
        { model: Like }
      ]
    }).then(tweet => {

      tweet = JSON.parse(JSON.stringify(tweet))[0]
      //console.log(tweet)
      return User.findByPk(tweet.User.id, {
        include: [
          { model: Like },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet }
        ]
      }).then(user => {
        //console.log(JSON.parse(JSON.stringify(user)))
        user = JSON.parse(JSON.stringify(user))
        return res.render('replies', { tweet, user })
      })
    })

  }
};
module.exports = tweetsController;
