const bcrypt = require("bcryptjs")
const db = require("../models")
const { Tweet, User, Like, Reply, Followship } = db
const blockController = require("./blockController")

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
    //分為使用者本人 vs 瀏覽其他使用者 兩種情況
    const userSelf = Number(req.user.id)
    const otherUser = Number(req.params.id)
    if (userSelf === otherUser) {
      //使用 req.user
      const thisUser = true
      let user = JSON.parse(JSON.stringify(req.user))
      return res.render("following", { user: user, thisUser: thisUser })
    } else {
      let viewUser = true
      return blockController.getSideUserProfile(req, res, data => {
        let otherUser = data.userData.toJSON()
        let followData = data.isfollowed
        return res.render("following", {
          userId: req.params.id,
          otherUser: otherUser,
          isFollowed: followData,
          viewUser: viewUser
        })
      })
    }
  },

  //GET	/users/:id/followers	看見某一使用者的跟隨者
  getUserFollowers: (req, res) => {
    //分為使用者本人 vs 瀏覽其他使用者 兩種情況
    const userSelf = Number(req.user.id)
    const otherUser = Number(req.params.id)
    if (userSelf === otherUser) {
      //使用 req.user
      const thisUser = true
      const user = JSON.parse(JSON.stringify(req.user))
      return res.render("follower", { user: user, thisUser: thisUser })
    } else {
      let viewUser = true
      //左側欄資訊
      return blockController.getSideUserProfile(req, res, data => {
        let otherUser = data.userData.toJSON()
        let followData = data.isfollowed
        return res.render("follower", {
          userId: req.params.id,
          otherUser: otherUser,
          isFollowed: followData,
          viewUser: viewUser
        })
      })
    }
  },

  //GET	/users/:id/likes	看見某一使用者按過 like 的推播
  getUserLike: (req, res) => {
    //分為使用者本人 vs 瀏覽其他使用者 兩種情況
    const userSelf = Number(req.user.id)
    const otherUser = Number(req.params.id)
    if (userSelf === otherUser) {
      //使用 req.user
      const thisUser = true
      const user = req.user
      const likeArr = user.Likes.map(l => Object.values(l.dataValues)[1])
      return Tweet.findAll({
        where: { id: likeArr },
        include: [{ model: Reply }, { model: Like }, { model: User }]
      }).then(tweets => {
        tweets = JSON.parse(JSON.stringify(tweets))
        res.render("like", { user: user, thisUser: thisUser, tweets: tweets })
      })
    } else {
      const viewUser = true
      return User.findByPk(req.params.id, {
        include: [
          { model: Tweet },
          { model: Like },
          { model: User, as: "Followers" },
          { model: User, as: "Followings" }
        ]
      }).then(user => {
        const likeArr = user.Likes.map(l => Object.values(l.dataValues)[1])
        return Tweet.findAll({
          where: { id: likeArr },
          include: [{ model: Reply }, { model: Like }, { model: User }]
        }).then(tweets => {
          //其他人的檔案需要塞入是否有追蹤的資訊
          addisFollow = user.dataValues.map(u => ({
            ...u,
            isFollowed: req.user.Followings.map(f => f.id).includes(u.id)
          }))
          user = JSON.parse(JSON.stringify(addisFollow))
          tweets = JSON.parse(JSON.stringify(tweets))
          res.render("like", { viewUser: viewUser, otherUser: user, tweets: tweets })
        })
      })
    }
  },

  getUserTweets: (req, res) => {
    //分為使用者本人 vs 瀏覽其他使用者 兩種情況
    const userSelf = Number(req.user.id)
    const otherUser = Number(req.params.id)
    //當為本人
    if (userSelf === otherUser) {
      const thisUser = true
      //展開在登入時有存好的本人資料
      const tweetObject = req.user.Tweets.map(tweet => ({
        ...tweet.dataValues
      }))
      //蒐集所有推文的id
      const tweetId = tweetObject.map(tweet => Object.values(tweet)[0])
      //找出推文與資料關聯
      return Tweet.findAll({
        where: { id: tweetId },
        include: [{ model: Reply }, { model: Like }, { model: User }],
        order: [["createdAt", "DESC"]],
        limit: 3,
        nest: true,
        raw: true
      }).then(tweet => {
        res.render("profile", { tweets: tweet, thisUser: thisUser })
      })
      //當瀏覽他人
    } else {
      //用於視圖判斷渲染
      const viewUser = true
      //開始查詢！
      return blockController.getSideUserProfile(req, res, data => {
        let tweetId = data.tweetArr
        let otherUser = data.userData.toJSON()
        let followData = data.isfollowed

        return Tweet.findAll({
          where: { id: tweetId },
          include: [{ model: Reply }, { model: Like }, { model: User }],
          nest: true,
          raw: true
        }).then(tweet => {
          console.log(tweet)
          res.render("profile", {
            userId: req.params.id,
            otherUser: otherUser,
            tweets: tweet,
            isFollowed: followData,
            viewUser: viewUser
          })
        })
      })
    }
  },

  editUserProfile: (req, res) => {
    return res.render("editProfile")
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.id
    }).then(followship => {
      return res.redirect("back")
    })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.id
      }
    }).then(followship => {
      followship.destroy().then(followship => {
        return res.redirect("back")
      })
    })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      TweetId: req.params.id
    }).then(like => {
      return res.redirect("back")
    })
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.id
      }
    }).then(like => {
      like.destroy().then(unlike => {
        return res.redirect("back")
      })
    })
  },

  logout: (req, res) => {
    req.flash("success_messages", "登出成功！")
    req.logout()
    res.redirect("/signin")
  }
}

module.exports = userController
