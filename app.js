const express = require("express");
const handlebars = require("express-handlebars");
const db = require("./models");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport");
const helpers = require("./_helpers");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const port = 3000;

const server = require("http").Server(app);
const io = require("socket.io")(server);

const sessionMiddleware = session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
});

// 設定 view engine 使用 handlebars
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.static("public")); //讀取靜態檔案

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  res.locals.user = req.user;
  next();
});

let now = new Date();
let daytime =
  now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
daytime +=
  " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", function(socket) {
  console.log(socket.request.session.username + " is connected");
  socket.on("disconnect", function() {
    console.log(socket.request.session.username + " is disconnected");
  });
});

io.on("connection", function(socket) {
  socket.on("chat message", function(msg) {
    io.emit(
      "chat message",
      socket.request.session.username + " says: " + msg + " @ " + daytime
    );
  });
});

server.listen(port, () => {
  db.sequelize.sync(); // 跟資料庫同步
  console.log(`Example app listening on port ${port}`);
});

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require("./routes")(app, passport);
