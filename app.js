const express = require("express")
const handlebars = require("express-handlebars")
const db = require("./models")
const bodyParser = require("body-parser")
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("./config/passport")
const helpers = require("./_helpers")
const path = require("path")
const methodOverride = require("method-override")
const { generateMessage } = require("./utils/messageForm")
const app = express()
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}
const port = 3000

//在 app.js 中建立應用程式中的 server
//等於 app.js 是在 node.js 的 server 中
//socket.io 是在 app.js 的 server 中
const server = require("http").Server(app)
const io = require("socket.io")(server)

const sessionMiddleware = session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
})

// 設定 view engine 使用 handlebars
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    helpers: require("./config/handlebars-helper")
  })
)
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride("_method"))
app.use(express.static("public")) //讀取靜態檔案

// 把 req.flash 放到 res.locals 裡面
//只要把資料放進 res.locals，就可以讓 View 也能存取到。
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages")
  res.locals.error_messages = req.flash("error_messages")
  res.locals.user = helpers.getUser(req)
  next()
})

// ~~~以下這段，為聊天室的 code ，暫時勿動感恩~~~
// 1. 先建立起時間戳記，方便記錄對話時間
let now = new Date()
let daytime = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate()
daytime += " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()

// 2. 主程式裡面就跟 app和 io 講好 都要過 middleware 之後各自進各自的request時 他們就都可以取用session
// io.use和app.use同一層，但是各自要傳各自需要的req進去給sessionMiddleware
// 點其他路由的時候 不會有socket.request 只有我們平常在用的 app產生的req
// 只有點chat路由的時候 才會啟動io
// io才會建立socket instance
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next)
})

// 4. 當聊天室開始時，便啟動監聽
// connection 是個監聽 event，後面的 function 是 callback
io.on("connection", socket => {
  console.log("=====伺服器確認使用者連線=====")

  socket.on("join", (roomname, callback) => {
    console.log("進入私聊=======>", roomname)

    socket.join(roomname)

    //監聽使用者的 emit
    socket.on("createMessage", message => {
      console.log("監聽使用者創建的訊息", message)

      //伺服器的 emit
      socket.to(roomname).emit("newMessage", generateMessage(`${message.from}`, `${message.text}`))
    })

    callback()
  })

  socket.on("disconnect", function() {
    console.log("=====伺服器斷開使用者連線=====")
  })
  // console.log(name + " is connected");
  // 使用者進來時，出現提示訊息
  // io.sockets.emit("chat message", socket.request.session.username + " is joining now～")
  // 使用者離開時，出現提示訊息
  // socket.on("disconnect", function() {
  //   // console.log(name + " is disconnected");
  //   io.sockets.emit("chat message", socket.request.session.username + " leaves the chat room～")
  // })
})

// io.on("connection", function(socket) {
//   socket.on("chat message", function(msg) {
//     // 使用者發言時，訊息從 client 端送出後，在畫面上 render 出訊息+時間~
//     io.emit("chat message", socket.request.session.username + " says: " + msg + " @ " + daytime)
//   })
// })

server.listen(port, () => {
  db.sequelize.sync() // 跟資料庫同步
  console.log(`Example app listening on port ${port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require("./routes")(app, passport)

module.exports = app
