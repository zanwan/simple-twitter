const helpers = require('../_helpers');
const path = require("path");
const tweetsController = require("../controllers/tweetsController.js");
const adminController = require("../controllers/adminController.js");
const userController = require("../controllers/userController.js");
const multer = require("multer");
const upload = multer({ dest: "temp/" });
// const chatController = require("../controllers/chatController.js");
module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }
  app.get("/", (req, res) => res.redirect("/tweets"));
  /* ---------------------------------- */
  /*               signin               */
  /* ---------------------------------- */

  // 聊天室試作
  // app.get("/chat", authenticated, (req, res) => res.redirect("/chat/:id"));
  // app.get("/chat/:id", authenticated, (req, res) =>
  //   res.sendFile(path.join(__dirname, "../public", "chat2.html"))
  // );
  app.get("/chat", authenticated, (req, res) =>
    res.sendFile(path.join(__dirname, "../public", "chat2.html"))
  );

  app.get("/signup", userController.signUpPage); //OK
  app.post("/signup", userController.signUp); //OK

  app.get("/signin", userController.signInPage); //OK
  app.post(
    "/signin",
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true
    }),
    userController.signIn
  ); //OK

  /* ---------------------------------- */
  /*               tweets               */
  /* ---------------------------------- */

  app.get("/tweets", authenticated, tweetsController.getTweets);
  app.post("/tweets", authenticated, tweetsController.postTweets); //OK
  app.get(
    "/tweets/:tweet_id/replies",
    authenticated,
    tweetsController.getTweet
  ); //OK
  app.post(
    "/tweets/:tweet_id/replies",
    authenticated,
    tweetsController.postTweet
  ); //OK

  /* ---------------------------------- */
  /*                users               */
  /* ---------------------------------- */
  app.get("/users/:id/tweets", authenticated, userController.getUserTweets); //OK
  app.get("/users/:id/likes", authenticated, userController.getUserLike);
  app.get("/users/:id/edit", authenticated, userController.editUserProfile);
  app.put(
    "/users/:id/edit",
    authenticated,
    upload.single("avatar"),
    userController.putUserProfile
  );

  /* ---------------------------------- */
  /*               Follow               */
  /* ---------------------------------- */

  app.post("/followships/:id", authenticated, userController.addFollowing); //OK

  app.delete("/followships/:id", authenticated, userController.removeFollowing); //OK

  app.get(
    "/users/:id/followings",
    authenticated,
    userController.getUserFollowings
  ); //OK

  app.get(
    "/users/:id/followers",
    authenticated,
    userController.getUserFollowers
  ); //OK

  /* ---------------------------------- */
  /*                Like                */
  /* ---------------------------------- */

  app.post("/tweets/:id/like", authenticated, userController.addLike); //OK

  app.delete("/tweets/:id/unlike", authenticated, userController.removeLike); //OK

  /* ---------------------------------- */
  /*                admin               */
  /* ---------------------------------- */

  app.get("/admin", authenticatedAdmin, (req, res) =>
    res.redirect("/admin/tweets")
  );
  app.get("/admin/tweets", authenticatedAdmin, adminController.getTweets);
  app.get("/admin/users", authenticatedAdmin, adminController.getAllUsers);

  // 連到 /admin 頁面就轉到 /admin/tweets
  app.get("/admin", authenticatedAdmin, (req, res) =>
    res.redirect("/admin/tweets")
  );
  app.get("/admin/tweets", authenticatedAdmin, adminController.getTweets);
  // 管理者刪除使用者評論
  app.delete(
    "/admin/tweets/:id",
    authenticatedAdmin,
    adminController.deleteTweet
  );
  // 帳號權限管理-新增路由
  app.get("/admin/users", authenticatedAdmin, adminController.getAllUsers);
  app.put("/admin/users/:id", authenticatedAdmin, adminController.putUser);

  // logout 永遠放最後面!
  app.get("/logout", userController.logout);
};
