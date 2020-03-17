const db = require("../models");
const helpers = require("../_helpers");
const { Tweet, User, Like, Reply } = db;
const adminController = {
  //A3: 使用者權限管理!
  getAllUsers: (req, res) => {
    return User.findAll({
      include: [
        { model: Tweet },
        { model: User, as: "Followers" },
        { model: User, as: "Followings" },
        { model: Like }
      ]
    }).then(users => {
      return res.render("admin/users", {
        users: JSON.parse(JSON.stringify(users))
      });
    });
  },
  // 修改使用者權限
  putUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      if (helpers.getUser(req).id === user.id) {
        req.flash("error_messages", "without permission change");
        res.redirect("/admin/users");
      } else {
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
      }
    });
  },
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [{ model: User }, { model: Reply }, { model: Like }]
    }).then(tweets => {
      return res.render("admin/tweets", {
        tweets: JSON.parse(JSON.stringify(tweets))
      });
    });
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id).then(tweet => {
      tweet.destroy().then(tweet => {
        res.redirect("/admin/tweets");
      });
    });
  }
};

module.exports = adminController;
