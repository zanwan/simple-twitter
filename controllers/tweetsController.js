const db = require("../models");
const helpers = require("../_helpers");
const { Tweet, User, Like, Reply } = db;

const tweetsController = {
  //首頁 推文 與 popular 區塊
  getTweets: (req, res) => {
    return Tweet.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [User, Reply, { model: User, as: "LikedUsers" }]
    }).then(tweets => {
      const data = tweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: tweet.LikedUsers.map(d => d.id).includes(
          helpers.getUser(req).id
        ),
        likeCount: tweet.LikedUsers.length,
        replyCount: tweet.Replies.length
      }));
      // 網紅推主
      User.findAll({
        limit: 10,
        order: [["createdAt", "DESC"]],
        include: [{ model: User, as: "Followers" }]
      }).then(users => {
        //整理 users 資料
        users = users.map(user => ({
          ...user.dataValues,
          // 計算追蹤者人數
          followerCount: user.Followers.length,
          // 判斷目前登入使用者是否追蹤該網紅
          isFollowed: helpers
            .getUser(req)
            .Followings.map(d => d.id)
            .includes(user.id)
        }));
        // 依追蹤者人數排序清單
        //當我們想要排序陣列時，就可以使用 sort 方法，它會自動把陣列按照「字典順序」排序
        //a,b 代表排序時挑出來的前後項，b - a 時回傳正數表示 b 比 a大
        users = users.sort((a, b) => b.followerCount - a.followerCount);
        //排除使用者自己
        popuser = users.filter(p => p.id !== helpers.getUser(req).id);
        return res.render("tweetsHome", {
          tweets: JSON.parse(JSON.stringify(data)),
          popUsers: popuser
        });
      });
    });
  },
  //將新增的推播寫入資料庫
  postTweets: (req, res) => {
    if (req.body.description.length <= 140 && req.body.description.length > 0) {
      console.log(req.body);
      Tweet.create({
        description: req.body.description.trim(),
        UserId: helpers.getUser(req).id,
        geoInfo: req.body.mapLink
      }).then(tweet => {
        return res.redirect("/tweets");
      });
    } else {
      req.flash("error_messages", "輸入不可為空白！");
      return res.redirect("/tweets");
    }
  },
  //GET	/tweets/:tweet_id/replies	回覆特定 tweet 的頁面，並看見 tweet 主人的簡介
  getTweet: (req, res) => {
    return Tweet.findAll({
      where: { id: req.params.tweet_id },
      include: [
        { model: User },
        { model: Reply, include: [{ model: User }] },
        { model: Like },
        { model: User, as: "LikedUsers" }
      ]
    }).then(tweets => {
      //塞入統計資料
      const addCountData = tweets.map(t => ({
        ...t.dataValues,
        isLiked: t.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id),
        likeCount: t.Likes.length,
        replyCount: t.Replies.length
      }));
      tweet = JSON.parse(JSON.stringify(addCountData))[0];
      return User.findByPk(tweet.User.id, {
        include: [
          { model: Tweet },
          { model: Like },
          { model: User, as: "Followers" },
          { model: User, as: "Followings" },
          { model: Tweet, as: "LikedTweets" }
        ]
      }).then(userdata => {
        const isFollowed = helpers
          .getUser(req)
          .Followings.map(d => d.id)
          .includes(userdata.id);
        const thisUser =
          helpers.getUser(req).id === Number(userdata.dataValues.id)
            ? true
            : false;
        return res.render("replies", {
          tweet,
          profile: userdata.get({ plain: true }),
          thisUser,
          isFollowed
        });
      });
    });
  },

  //POST	/tweets/:tweet_id/replies	將回覆的內容寫入資料庫
  postReply: (req, res) => {
    return Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id,
      comment: req.body.replyMsg
    }).then(comment => {
      res.redirect(`/tweets/${req.params.tweet_id}/replies`);
    });
  }
};
module.exports = tweetsController;
