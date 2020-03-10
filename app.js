const express = require("express")
const handlebars = require("express-handlebars")
const db = require("./models")
const bodyParser = require("body-parser")
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("./config/passport")
const helpers = require("./_helpers")

const app = express()
const port = 3000

// 設定 view engine 使用 handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(express.static("public")) //讀取靜態檔案
//前端視圖暫時路由
app.get("/", (req, res) => res.render("admin/allTweets"))

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages")
  res.locals.error_messages = req.flash("error_messages")
  res.locals.user = req.user
  next()
})

app.listen(port, () => {
  db.sequelize.sync() // 跟資料庫同步
  console.log(`Example app listening on port ${port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require("./routes")(app, passport)
