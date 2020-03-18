const bcrypt = require("bcryptjs");
const db = require("../models");
const { Tweet, User, Like, Reply, Followship } = db;
const blockController = require("./blockController");
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_ID;
const helpers = require("../_helpers");
const userController = {
  signUpPage: (req, res) => {
    return res.render("signup");
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash("error_messages", "兩次密碼輸入不同！");
      return res.redirect("/signup");
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash("error_messages", "信箱重複！");
          return res.redirect("/signup");
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            )
          }).then(user => {
            req.flash("success_messages", "成功註冊帳號！");
            return res.redirect("/signin");
          });
        }
      });
    }
  },

  signInPage: (req, res) => {
    return res.render("signin");
  },

  signIn: (req, res) => {
    req.session.username = helpers.getUser(req).name;
    // io什麼都沒有 先跟app講好我要跟你共用 session 然後app本來有的就一點點 所以app必須割地賠款地再多存一些東西好讓io取用這樣
    req.flash("success_messages", "成功登入！");
    res.redirect("/tweets");
  },

  //GET	/users/:id/followings	看見某一使用者正在關注的使用者
  getUserFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [User] },
        { model: User, as: 'Followers' },
        {
          model: User,
          as: 'Followings',
          include: [{ model: User, as: 'Followers' }]
        },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(user => {
      const isFollowed = helpers
        .getUser(req)
        .Followings.map(d => d.id)
        .includes(user.id)
      const followingList = user.Followings.map(r => ({
        ...r.dataValues,
        introduction: r.dataValues.introduction
          ? `${r.dataValues.introduction.substring(0, 50)}.....`
          : r.dataValues.introduction
      })).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      return res.render(
        'following',
        JSON.parse(
          JSON.stringify({
            profile: user,
            isFollowed,
            followingList
          })
        )
      )
    })
  },

  //GET	/users/:id/followers	看見某一使用者的跟隨者
  getUserFollowers: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [User] },
        {
          model: User,
          as: 'Followers',
          include: [{ model: User, as: 'Followers' }]
        },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(user => {
      const isFollowed = helpers
        .getUser(req)
        .Followings.map(d => d.id)
        .includes(user.id)
      const followerList = user.Followers.map(r => ({
        ...r.dataValues,
        introduction: r.dataValues.introduction
          ? `${r.dataValues.introduction.substring(0, 50)}.....`
          : r.dataValues.introduction,
        isFollowed: helpers
          .getUser(req)
          .Followings.map(d => d.id)
          .includes(r.id)
      })).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      return res.render(
        'follower',
        JSON.parse(
          JSON.stringify({
            profile: user,
            isFollowed,
            followerList
          })
        )
      )
    })
  },

  //GET	/users/:id/likes	看見某一使用者按過 like 的推播
  getUserLike: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets', include: [User, Reply, Like] }
      ]
    }).then(user => {
      const isFollowed = helpers
        .getUser(req)
        .Followings.map(d => d.id)
        .includes(user.id)
      const LikedTweetList = user.LikedTweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: helpers.getUser(req).LikedTweets
          ? helpers
            .getUser(req)
            .LikedTweets.map(d => d.id)
            .includes(tweet.id)
          : helpers.getUser(req).LikedTweets
      })).sort((a, b) => b.likeCreatedAt - a.likeCreatedAt)
      return res.render(
        'like',
        JSON.parse(
          JSON.stringify({
            profile: user,
            isFollowed,
            LikedTweetList
          })
        )
      )
    })
  },

  getUserTweets: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [User, Reply, Like] },
        { model: User, as: "Followers" },
        { model: User, as: "Followings" },
        { model: Tweet, as: "LikedTweets" }
      ]
    }).then(user => {
      const isFollowed = helpers
        .getUser(req)
        .Followings.map(d => d.id)
        .includes(user.id)
      const tweets = user.Tweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: helpers.getUser(req).LikedTweets
          ? helpers
            .getUser(req)
            .LikedTweets.map(d => d.id)
            .includes(tweet.id)
          : helpers.getUser(req).LikedTweets
      })).sort((a, b) => b.createdAt - a.createdAt)

      // 判斷 req.params.id 跟 登入者id 是否一致 
      const thisUser = helpers.getUser(req).id === Number(req.params.id) ? true : false

      res.render("profile", {
        thisUser,
        profile: JSON.parse(JSON.stringify(user)), tweets: JSON.parse(JSON.stringify(tweets)), isFollowed
      })
    })
  },

  editUserProfile: (req, res) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      req.flash('error_msg', '無權編輯')
      return res.redirect(`/users/${req.params.id}/tweets`)
    }
    return User.findByPk(req.params.id, { raw: true }).then(user => {
      return res.render('editProfile', { user })
    })
  },

  putUserProfile: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", "name didn't exist");
      return res.redirect("back");
    }

    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        if (err) console.log("Error: ", err);
        return User.findByPk(req.params.id).then(user => {
          user
            .update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: file ? img.data.link : user.avatar
            })
            .then(user => {
              req.flash("success_messages", "user was successfully to update");
              res.redirect(`/users/${req.params.id}/edit`);
            });
        });
      });
    } else {
      return User.findByPk(req.params.id).then(user => {
        user
          .update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar
          })
          .then(user => {
            req.flash("success_messages", "user was successfully to update");
            res.redirect(`/users/${req.params.id}/edit`);
          });
      });
    }
  },

  addFollowing: (req, res) => {
    if (helpers.getUser(req).id === Number(req.body.id)) {
      return res.send('cant not follow self')
    } else {
      return Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: Number(req.body.id)
      }).then(followship => {
        return res.redirect("back");
      });
    }
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.id
      }
    }).then(followship => {
      followship.destroy().then(followship => {
        return res.redirect("back");
      });
    });
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    }).then(like => {
      return res.redirect("back");
    });
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    }).then(like => {
      like.destroy().then(unlike => {
        return res.redirect("back");
      });
    });
  },

  logout: (req, res) => {
    req.flash("success_messages", "登出成功！");
    req.logout();
    res.redirect("/signin");
  }
};

module.exports = userController;
