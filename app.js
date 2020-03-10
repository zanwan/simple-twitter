const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const port = 3000;
// 引入資料庫
const db = require("./models");
// 登入使用者資料解析
const bodyParser = require("body-parser");
// 表單驗證與錯誤訊息
const flash = require("connect-flash");
const session = require("express-session");
// 建立使用者登入機制
const passport = require("./config/passport");

// 設定 view engine 使用 handlebars
app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");

// setup bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// setup session and flash
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(flash());

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

// setup passport
app.use(passport.initialize());
app.use(passport.session());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require("./routes")(app);
