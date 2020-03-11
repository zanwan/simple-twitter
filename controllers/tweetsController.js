const db = require('../models')
const Tweet = db.Tweet

const tweetsController = {
  getTweets: (req, res) => {
    return res.render("tweetsHome");
  },
  //將新增的推播寫入資料庫
  postTweets: (req, res) => {
    if (!req.body.newTweet) {
      req.flash('error_messages', "沒有輸入任何推播訊息")
      return res.redirect('back')
    }
    return Tweet.create({
      description: req.body.newTweet,
      UserId: req.body.id
    }).then((tweet) => {
      req.flash('success_messages', '完成新增一則 tweet')
      res.redirect('/tweets')
    })
  },
  //GET	/tweets/:tweet_id/replies	回覆特定 tweet 的頁面，並看見 tweet 主人的簡介
  getTweet: (req, res) => {
    return res.render('replies')
  }
};
module.exports = tweetsController;
