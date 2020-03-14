const tweetsController = require("../controllers/tweetsController.js")
const adminController = require("../controllers/adminController.js")
const userController = require("../controllers/userController.js")
// const chatController = require("../controllers/chatController.js");
module.exports = (app, passport) => {
  // 記得這邊要接收 passport
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect("/signin")
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next()
      }
      return res.redirect("/")
    }
    res.redirect("/signin")
  }
  // 記得這邊要接收 passport
  // 如果使用者訪問首頁，就導向 /tweets 的頁面

  /* ---------------------------------- */
  /*               tweets               */
  /* ---------------------------------- */

  app.get("/", authenticated, (req, res) => res.redirect("tweets"))
  app.get("/tweets", authenticated, tweetsController.getTweets)
  app.post("/tweets", authenticated, tweetsController.postTweets)
  app.get("/tweets/:tweet_id/replies", authenticated, tweetsController.getTweet)
  app.post("/tweets/:tweet_id/replies", authenticated, tweetsController.postTweet)

  /* ---------------------------------- */
  /*                users               */
  /* ---------------------------------- */

  app.get("/users/:id/followings", authenticated, userController.getUserFollowings)
  app.get("/users/:id/followers", authenticated, userController.getUserFollowers)
  app.get("/users/:id/likes", authenticated, userController.getUserLike)

  /* ---------------------------------- */
  /*                admin               */
  /* ---------------------------------- */

  app.get("/admin", authenticated, (req, res) => res.redirect("/admin/tweets"))
  app.get("/admin/tweets", authenticated, adminController.getTweets)
  app.get("/admin/users", authenticated, adminController.getUsers)

  // 帳號權限管理-新增路由
  app.get("/admin/users", authenticatedAdmin, adminController.getAllUsers)
  app.put("/admin/users/:id", authenticatedAdmin, adminController.putUser)

  // 管理者刪除使用者評論
  app.delete("/admin/tweets/:id", authenticatedAdmin, adminController.deleteTweet)

  /* ---------------------------------- */
  /*             SocketIO.io            */
  /* ---------------------------------- */

  app.get("/chat", authenticated, (req, res) => res.redirect("/chat/:id"))
  // app.get("/chat/:id", authenticated, chatController.creatChat);
  app.get("/chat/:id", authenticated, (req, res) => res.sendFile(__dirname + "/chat2.html"))

  app.get("/signup", userController.signUpPage)
  app.post("/signup", userController.signUp)

  app.get("/signin", userController.signInPage)
  app.post(
    "/signin",
    passport.authenticate(
      "local",
      { failureRedirect: "/signin", failureFlash: true },
      userController.signIn
    )
  )

  // logout 永遠放最後面!
  app.get("/logout", userController.logout)
}
