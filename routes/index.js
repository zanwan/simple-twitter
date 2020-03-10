const restController = require("../controllers/restController.js");
const adminController = require("../controllers/adminController.js");
const userController = require("../controllers/userController.js");
module.exports = (app, passport) => {
  // 記得這邊要接收 passport
  // 如果使用者訪問首頁，就導向 /restaurants 的頁面
  app.get("/", (req, res) => res.redirect("restaurants"));
  app.get("/restaurants", restController.getRestaurants);

  // 連到 /admin 頁面就轉到 /admin/restaurants
  app.get("/admin", (req, res) => res.redirect("/admin/restaurants"));
  app.get("/admin/restaurants", adminController.getRestaurants);

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
  app.get("/logout", userController.logout);
};
