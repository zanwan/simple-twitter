const helpers = require("../_helpers");
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
      return next();
    }
    res.redirect("/signin");
  };

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === "admin") {
        return next();
      }
      return res.redirect("/");
    }
    res.redirect("/signin");
  };
  app.get("/", (req, res) => res.redirect("/tweets"));
  /* ---------------------------------- */
  /*               signin               */
  /* ---------------------------------- */
  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);

  app.get("/signin", userController.signInPage);
  app.post(
    "/signin",
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true
    }),
    userController.signIn
  );
  /* ---------------------------------- */
  /*                Chatroom             */
  /* ---------------------------------- */

  app.get("/chat", authenticated, (req, res) =>
    res.sendFile(path.join(__dirname, "../public", "chat2.html"))
  );

  /* ---------------------------------- */
  /*               Check-in          */
  /* ---------------------------------- */

  app.get("/checkin", authenticated, (req, res) =>
    res.sendFile(path.join(__dirname, "../public", "googleCheckIn.html"))
  );

  /* ---------------------------------- */
  /*               tweets               */
  /* ---------------------------------- */

  app.get("/tweets", authenticated, tweetsController.getTweets); //OK
  app.post("/tweets", authenticated, tweetsController.postTweets); //OK
  app.get(
    "/tweets/:tweet_id/replies",
    authenticated,
    tweetsController.getTweet
  ); //OK
  app.post(
    "/tweets/:tweet_id/replies",
    authenticated,
    tweetsController.postReply
  ); //OK

  /* ---------------------------------- */
  /*                users               */
  /* ---------------------------------- */
  app.get("/users/:id/tweets", authenticated, userController.getUserTweets); //OK
  app.get("/users/:id/likes", authenticated, userController.getUserLike); //OK
  app.get("/users/:id/edit", authenticated, userController.editUserProfile); //OK
  app.post(
    "/users/:id/edit",
    authenticated,
    upload.single("avatar"),
    userController.putUserProfile
  ); //OK

  app.get('/api/user', authenticated, userController.getMention)
  /* ---------------------------------- */
  /*               Follow               */
  /* ---------------------------------- */

  app.post("/followships/", authenticated, userController.addFollowing); //OK

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

  app.post("/tweets/:id/like", authenticated, userController.addLike);

  app.post("/tweets/:id/unlike", authenticated, userController.removeLike);

  /* ---------------------------------- */
  /*                admin               */
  /* ---------------------------------- */

  app.get("/admin", authenticatedAdmin, (req, res) =>
    res.redirect("/admin/tweets")
  );

  app.get("/admin/tweets", authenticatedAdmin, adminController.getTweets);

  app.get("/admin/users", authenticatedAdmin, adminController.getAllUsers);

  // 管理者刪除使用者評論
  app.delete(
    "/admin/tweets/:id",
    authenticatedAdmin,
    adminController.deleteTweet
  );

  // 帳號權限管理-新增路由
  app.put("/admin/users/:id", authenticatedAdmin, adminController.putUser);

  // logout 永遠放最後面!
  app.get("/logout", userController.logout);
};
