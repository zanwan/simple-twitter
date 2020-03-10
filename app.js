const express = require("express");
const helpers = require("./_helpers");

const app = express();
const port = 3000;
// 引入 handlebars
const handlebars = require("express-handlebars");

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
// Handlebars 註冊樣板引擎
app.engine("handlebars", handlebars());
// 設定使用 Handlebars 做為樣板引擎
app.set("view engine", "handlebars");

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
