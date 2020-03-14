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
  app.get("/", (req, res) => res.redirect("/signin"))
  /* ---------------------------------- */
  /*               signin               */
  /* ---------------------------------- */

  app.get("/signup", userController.signUpPage) //OK
  app.post("/signup", userController.signUp) //OK

  app.get("/signin", userController.signInPage) //OK
  app.post(
    "/signin",
    passport.authenticate("local", { failureRedirect: "/signin", failureFlash: true }),
    userController.signIn
  ) //OK

  /* ---------------------------------- */
  /*               tweets               */
  /* ---------------------------------- */

  app.get("/tweets", authenticated, tweetsController.getTweets)
  app.post("/tweets", authenticated, tweetsController.postTweets)
  app.get("/tweets/:id/replies", authenticated, tweetsController.getTweet)
  app.post("/tweets/:id/replies", authenticated, tweetsController.postTweet)

  /* ---------------------------------- */
  /*                users               */
  /* ---------------------------------- */
  app.get("/users/:id/tweets", authenticated, userController.getUserTweets) //OK
  app.get("/users/:id/likes", authenticated, userController.getUserLike)

  /* ---------------------------------- */
  /*               Follow               */
  /* ---------------------------------- */

  app.post("/followships/:id", authenticated, userController.addFollowing)

  app.delete("/followships/:followingId", authenticated, userController.removeFollowing)

  app.get("/users/:id/followings", authenticated, userController.getUserFollowings)

  app.get("/users/:id/followers", authenticated, userController.getUserFollowers)

  /* ---------------------------------- */
  /*                admin               */
  /* ---------------------------------- */

  app.get("/admin", authenticatedAdmin, (req, res) => res.redirect("/admin/tweets"))
  app.get("/admin/tweets", authenticatedAdmin, adminController.getTweets)
  app.get("/admin/users", authenticatedAdmin, adminController.getAllUsers)

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

  /* ---------------------------------- */
  /*               logout               */
  /* ---------------------------------- */

  app.get("/logout", userController.logout) //OK
}
