const passport = require("passport")
const LocalStrategy = require("passport-local")
const bcrypt = require("bcryptjs")
const db = require("../models")
const { Tweet, User, Like, Reply } = db

// setup passport strategy
passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    // authenticate user
    (req, username, password, cb) => {
      User.findOne({ where: { email: username } }).then(user => {
        if (!user) return cb(null, false, req.flash("error_messages", "帳號或密碼輸入錯誤"))
        if (!bcrypt.compareSync(password, user.password))
          return cb(null, false, req.flash("error_messages", "帳號或密碼輸入錯誤！"))
        return cb(null, user)
      })
    }
  )
)

// serialize and deserialize user
//序列化這個技術的用意就是只存 user id，不存整個 user
//當資料很大包、會頻繁使用資料，但用到的欄位又很少時，就會考慮使用序列化的技巧來節省空間。
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
//反序列化」就是透過 user id，把整個 user 物件實例拿出來。
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: Tweet },
      { model: Like },
      { model: User, as: "Followers" },
      { model: User, as: "Followings" }
    ]
  }).then(user => {
    return cb(null, JSON.parse(JSON.stringify(user)))
  })
})

module.exports = passport
