const tweetsController = require("../controllers/tweetsController.js");
const adminController = require("../controllers/adminController.js");
const userController = require("../controllers/userController.js");
const path = require("path");
// const chatController = require("../controllers/chatController.js");
module.exports = (app, passport) => {
  // 記得這邊要接收 passport
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/signin");
  };
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next();
      }
      return res.redirect("/");
    }
    res.redirect("/signin");
  };
  // 記得這邊要接收 passport
  // 如果使用者訪問首頁，就導向 /tweets 的頁面
  app.get("/", authenticated, (req, res) => res.redirect("tweets"));
  app.get("/tweets", authenticated, tweetsController.getTweets);
  app.post("/tweets", authenticated, tweetsController.postTweets);

  app.get(
    "/tweets/:tweet_id/replies",
    authenticated,
    tweetsController.getTweet
  );

  app.get("/chat", authenticated, (req, res) => res.redirect("/chat/:id"));
  // app.get("/chat/:id", authenticated, chatController.creatChat);
  app.get("/chat/:id", authenticated, (req, res) =>
    res.sendFile(path.join(__dirname, "../public", "chat2.html"))
  );

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

  // 連到 /admin 頁面就轉到 /admin/tweets
  app.get("/admin", authenticated, (req, res) => res.redirect("/admin/tweets"));
  app.get("/admin/tweets", authenticated, adminController.getTweets);
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
