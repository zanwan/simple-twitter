const bcrypt = require("bcryptjs")
const db = require("../models")
const { Tweet, User, Like, Reply, Followship } = db

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
      //以網址參數查詢他人資料
      const userId = req.params.id
      //用於視圖判斷渲染
      const viewUser = true
      //開始查詢！
      User.findByPk(userId, {
        include: [
          { model: Tweet },
          { model: Like },
          { model: User, as: "Followings" },
          { model: User, as: "Followers" }
        ]
      }).then(otherUser => {
        //整理資料
        const tweetArr = otherUser.dataValues.Tweets.map(tweet => tweet.id)

        // 判斷使用者是否追蹤
        const followData = otherUser.dataValues.Followers.map(f => f.id).includes(req.user.id)

        //依 tweet id 找到本文與關聯資料
        return Tweet.findAll({
          where: { id: tweetArr },
          include: [{ model: Reply }, { model: Like }, { model: User }],
          nest: true,
          raw: true
        }).then(tweet => {
          console.log("======otherUser")
          console.log(otherUser.get({ plain: true }))
          res.render("profile", {
            userId: userId,
            otherUser: otherUser.get({ plain: true }),
            tweets: tweet,
            isFollowed: followData,
            viewUser: viewUser
          })
        })
      })
    }
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.id
    }).then(followship => {
      return res.redirect("back")
    })
  },

  editUserProfile: (req, res) => {
    return res.render("editProfile")
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.id
      }
    }).then(followship => {
      console.log(followship)
      followship.destroy().then(followship => {
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
