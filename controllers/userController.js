const bcrypt = require("bcryptjs")
const db = require("../models")
const { Tweet, User, Like, Reply } = db

const userController = {
  signUpPage: (req, res) => {
    return res.render("signup")
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash("error_messages", "兩次密碼輸入不同！")
      return res.redirect("/signup")
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash("error_messages", "信箱重複！")
          return res.redirect("/signup")
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash("success_messages", "成功註冊帳號！")
            return res.redirect("/signin")
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render("signin")
  },

  signIn: (req, res) => {
    req.flash("success_messages", "成功登入！")
    res.redirect("/tweets")
  },

  //GET	/users/:id/followings	看見某一使用者正在關注的使用者
  getUserFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet },
        { model: User, as: "Followers" },
        { model: User, as: "Followings" },
        { model: Like }
      ]
    }).then(user => {
      user = JSON.parse(JSON.stringify(user))
      return res.render("following", { user })
    })
  },

  //GET	/users/:id/followers	看見某一使用者的跟隨者
  getUserFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet },
        { model: User, as: "Followers" },
        { model: User, as: "Followings" },
        { model: Like }
      ]
    }).then(user => {
      user = JSON.parse(JSON.stringify(user))
      return res.render("follower", { user })
    })
  },

  //GET	/users/:id/likes	看見某一使用者按過 like 的推播
  getUserLike: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet },
        { model: User, as: "Followers" },
        { model: User, as: "Followings" },
        { model: Like }
      ]
    }).then(user => {
      return Like.findAll({
        where: { userId: req.params.id },
        include: [
          {
            model: Tweet,
            include: [{ model: User }, { model: Reply }, { model: Like }]
          }
        ]
      }).then(tweets => {
        user = JSON.parse(JSON.stringify(user))
        tweets = JSON.parse(JSON.stringify(tweets))
        return res.render("like", { user, tweets })
      })
    })
  },

  logout: (req, res) => {
    req.flash("success_messages", "登出成功！")
    req.logout()
    res.redirect("/signin")
  },

  getUserTweets: (req, res) => {
    const userSelf = Number(req.user.id)
    const otherUser = Number(req.params.id)
    if (userSelf === otherUser) {
      const thisUser = true
      const user = req.user
      const userTweets = user.Tweets
      const tweetObject = userTweets.map(tweet => ({
        ...tweet
      }))
      const tweetId = tweetObject.map(tweet => Object.values(tweet)[0])
      console.log("======== why ======")
      console.log(tweetId)
      return Tweet.findAll({
        where: { id: tweetId },
        include: [{ model: Reply }, { model: Like }, { model: User }],
        nest: true,
        raw: true
      }).then(tweet => {
        console.log("==========FindData==========")
        console.log(tweet)
        res.render("profile", { tweets: tweet, thisUser: thisUser })
      })
    } else {
      const userId = req.params.id
      const viewUser = true
      User.findByPk(userId, {
        include: [
          { model: Tweet },
          { model: Like },
          { model: User, as: "Followings" },
          { model: User, as: "Followers" }
        ]
      }).then(otherUser => {
        console.log("++++++++ Hey ++++++++")
        console.log(otherUser)
        const userTweets = otherUser.Tweets
        const tweetObject = userTweets.map(tweet => ({
          ...tweet
        }))
        console.log("~~~~~~~Tweet Object~~~~~~~~~~")
        console.log(tweetObject)
        const tweetId = tweetObject.map(tweet => Object.values(tweet.dataValues)[0])
        console.log("~~~~~~~Tweet ID~~~~~~~~~~")
        console.log(tweetId)
        return Tweet.findAll({
          where: { id: tweetId },
          include: [{ model: Reply }, { model: Like }, { model: User }],
          nest: true,
          raw: true
        }).then(tweet => {
          console.log("==========FindOtherUserData==========")
          console.log(tweet)
          res.render("profile", {
            user: otherUser.get({ plain: true }),
            tweets: tweet,
            viewUser: viewUser
          })
        })
      })
    }
  }
}

module.exports = userController
