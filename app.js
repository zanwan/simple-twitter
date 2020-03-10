const express = require("express")
const helpers = require("./_helpers")
const handlebars = require("express-handlebars")

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

//設定樣版引擎
app.engine("handlebars", handlebars()) //註冊樣版引擎
app.set("view engine", "handlebars") //設定樣板引擎
app.use(express.static("public")) //讀取靜態檔案
//前端視圖暫時路由
app.get("/", (req, res) => res.render("replies"))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
