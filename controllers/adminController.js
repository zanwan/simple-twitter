const db = require("../models");
const User = db.User;
const Tweet = db.Tweet;
const adminController = {
  //A3: 使用者權限管理!
  getAllUsers: (req, res) => {
    return User.findAll().then(users => {
      // 效果：登入中使用者無須權限轉移
      let loginUser = req.user.id;
      for (user of users) {
        if (user.id === loginUser) {
          user.dataValues.showLink = false;
        } else {
          user.dataValues.showLink = true;
        }
      }
      return res.render("admin/users", {
        users: JSON.parse(JSON.stringify(users))
      });
    });
  },
  // 修改使用者權限
  putUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      user
        .update({
          isAdmin: !user.isAdmin
        })
        .then(user => {
          req.flash(
            "success_messages",
            `Authority of ${user.name} was successfully changed`
          );
          res.redirect("/admin/users");
        });
    });
  },
  getTweets: (req, res) => {
    return Tweet.findAll().then(tweets => {
      return res.render("admin/tweets", {
        tweets: JSON.parse(JSON.stringify(tweets))
      });
    });
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.tweet_id).then(tweet => {
      tweet.destroy().then(tweet => {
        return res.render("admin/tweets", {
          tweets: JSON.parse(JSON.stringify(tweets))
        });
      });
    });
  }
};

module.exports = adminController;
