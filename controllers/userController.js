const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;
const helpers = require("../_helpers.js");

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
    // io什麼都沒有 先跟app講好我要跟你共用session 然後app本來有的就一點點 所以app必須割地賠款地再多存一些東西好讓io取用這樣
    req.flash("success_messages", "成功登入！");
    res.redirect("/tweets");
  },

  logout: (req, res) => {
    req.flash("success_messages", "登出成功！");
    req.logout();
    res.redirect("/signin");
  }
};

module.exports = userController;
