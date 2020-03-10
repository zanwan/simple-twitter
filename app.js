const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const port = 3000;
// 引入資料庫
const db = require("./models");
const bodyParser = require("body-parser");
// 設定 view engine 使用 handlebars
app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require("./routes")(app);
