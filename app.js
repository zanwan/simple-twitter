const express = require("express")
const handlebars = require("express-handlebars")
const db = require("./models")
const bodyParser = require("body-parser")
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("./config/passport")
const helpers = require("./_helpers")
const path = require("path")

const app = express()
const port = 3000

// 設定 view engine 使用 handlebars
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main"
  })
)
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(express.static("public")) //讀取靜態檔案

//前端視圖暫時路由
app.get("/", (req, res) => res.redirect("/signin"))
app.get("/signin", (req, res) => {
  res.render("signin")
})
app.get("/signup", (req, res) => {
  res.render("signup")
})
app.get("/tweets", (req, res) => {
  res.render("tweetsHome", {
    tweets: [
      {
        description:
          "eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales",
        UserId: 1,
        replyCount: 10,
        likeCount: 30,
        user: {
          name: "zangwang",
          email: "zangwang@exmple.com",
          avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
          introduction:
            "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
        }
      },
      {
        description:
          "Airtable 依每個 base 提供各自獨立的 API 說明文件，第一次看到，好猛好美好易讀（的感覺）😱新手如我覺得感動..",
        UserId: 2,
        replyCount: 50,
        likeCount: 30,
        user: {
          name: "I Hate YOUUU",
          email: "die@exmple.com",
          avatar: "https://api.adorable.io/avatars/255/abott@adorable.png",
          introduction: "lorem mollis aliquam ut"
        }
      },
      {
        description:
          "eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales",
        UserId: 3,
        replyCount: 10,
        likeCount: 30,
        user: {
          name: "zangwang",
          email: "zangwang@exmple.com",
          avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
          introduction:
            "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
        }
      }
    ]
  })
})
app.get("/tweets/:id/replies", (req, res) => {
  res.render("replies", {
    tweets: [
      {
        description:
          "eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales",
        UserId: 1,
        replyCount: 10,
        likeCount: 30,
        user: {
          name: "zangwang",
          email: "zangwang@exmple.com",
          avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
          introduction:
            "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
        }
      }
    ],
    user: {
      name: "zangwang",
      email: "zangwang@exmple.com",
      avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
      introduction:
        "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
    },
    replies: [
      {
        TweetId: 1,
        UserId: 1,
        Comment: "DIE DIE DIE DIE"
      },
      {
        TweetId: 1,
        UserId: 3,
        Comment: "不要吵架"
      },
      {
        TweetId: 1,
        UserId: 4,
        Comment: "去練舞室打"
      }
    ]
  })
})
app.get("/users/:id/tweets", (req, res) => {
  res.render("profile", {
    tweets: [
      {
        description:
          "eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales",
        UserId: 1,
        replyCount: 10,
        likeCount: 30,
        user: {
          name: "zangwang",
          email: "zangwang@exmple.com",
          avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
          introduction:
            "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
        }
      },
      {
        description:
          "Airtable 依每個 base 提供各自獨立的 API 說明文件，第一次看到，好猛好美好易讀（的感覺）😱新手如我覺得感動..",
        UserId: 2,
        replyCount: 50,
        likeCount: 30,
        user: {
          name: "I Hate YOUUU",
          email: "die@exmple.com",
          avatar: "https://api.adorable.io/avatars/255/abott@adorable.png",
          introduction: "lorem mollis aliquam ut"
        }
      },
      {
        description:
          "eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales",
        UserId: 3,
        replyCount: 10,
        likeCount: 30,
        user: {
          name: "zangwang",
          email: "zangwang@exmple.com",
          avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
          introduction:
            "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
        }
      }
    ],
    user: {
      name: "zangwang",
      email: "zangwang@exmple.com",
      avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
      introduction:
        "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
    }
  })
})
app.get("/users/:id/followings", (req, res) => {
  res.render("following", {
    followings: [
      {
        name: "zangwang",
        email: "zangwang@exmple.com",
        avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
        introduction:
          "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
      },
      {
        name: "zangwang",
        email: "zangwang@exmple.com",
        avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
        introduction:
          "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
      },
      {
        name: "zangwang",
        email: "zangwang@exmple.com",
        avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
        introduction:
          "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
      },
      {
        name: "zangwang",
        email: "zangwang@exmple.com",
        avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
        introduction:
          "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
      }
    ],
    user: {
      name: "zangwang",
      email: "zangwang@exmple.com",
      avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
      introduction:
        "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
    }
  })
})
app.get("/users/:id/followers", (req, res) => {
  res.render("follower", {
    followers: [
      {
        name: "zangwang",
        email: "zangwang@exmple.com",
        avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
        introduction:
          "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
      },
      {
        name: "zangwang",
        email: "zangwang@exmple.com",
        avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
        introduction:
          "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
      },
      {
        name: "zangwang",
        email: "zangwang@exmple.com",
        avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
        introduction:
          "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
      },
      {
        name: "zangwang",
        email: "zangwang@exmple.com",
        avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
        introduction:
          "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
      }
    ],
    user: {
      name: "zangwang",
      email: "zangwang@exmple.com",
      avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
      introduction:
        "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
    }
  })
})
app.get("/users/:id/likes", (req, res) => {
  res.render("like", {
    tweets: [
      {
        description:
          "eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales",
        UserId: 1,
        replyCount: 10,
        likeCount: 30,
        user: {
          name: "zangwang",
          email: "zangwang@exmple.com",
          avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
          introduction:
            "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
        }
      },
      {
        description:
          "Airtable 依每個 base 提供各自獨立的 API 說明文件，第一次看到，好猛好美好易讀（的感覺）😱新手如我覺得感動..",
        UserId: 2,
        replyCount: 50,
        likeCount: 30,
        user: {
          name: "I Hate YOUUU",
          email: "die@exmple.com",
          avatar: "https://api.adorable.io/avatars/255/abott@adorable.png",
          introduction: "lorem mollis aliquam ut"
        }
      },
      {
        description:
          "eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales",
        UserId: 3,
        replyCount: 10,
        likeCount: 30,
        user: {
          name: "zangwang",
          email: "zangwang@exmple.com",
          avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
          introduction:
            "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
        }
      }
    ],
    user: {
      name: "zangwang",
      email: "zangwang@exmple.com",
      avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
      introduction:
        "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
    }
  })
})
app.get("/users/:id/edit", (req, res) => {
  res.render("editProfile")
})
app.get("/admin/tweets", (req, res) => {
  res.render("admin/allTweets", {
    tweets: [
      {
        description:
          "eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales",
        UserId: 1,
        replyCount: 10,
        likeCount: 30,
        user: {
          name: "zangwang",
          email: "zangwang@exmple.com",
          avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
          introduction:
            "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
        },
        user: {
          id: 1,
          name: "zangwang",
          email: "zangwang@exmple.com",
          avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
          introduction:
            "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
        }
      },
      {
        description:
          "Airtable 依每個 base 提供各自獨立的 API 說明文件，第一次看到，好猛好美好易讀（的感覺）😱新手如我覺得感動..",
        UserId: 2,
        replyCount: 50,
        likeCount: 30,
        user: {
          name: "I Hate YOUUU",
          email: "die@exmple.com",
          avatar: "https://api.adorable.io/avatars/255/abott@adorable.png",
          introduction: "lorem mollis aliquam ut"
        },
        user: {
          id: 1,
          name: "zangwang",
          email: "zangwang@exmple.com",
          avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
          introduction:
            "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
        }
      },
      {
        description:
          "eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales",
        UserId: 3,
        replyCount: 10,
        likeCount: 30,
        user: {
          name: "zangwang",
          email: "zangwang@exmple.com",
          avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
          introduction:
            "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
        }
      }
    ]
  })
})
app.get("/admin/users", (req, res) => {
  res.render("admin/allUsers", {
    users: [
      {
        id: 2,
        name: "zangwang",
        email: "zangwang@exmple.com",
        avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
        introduction:
          "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
      },
      {
        id: 2,
        name: "zangwang",
        email: "zangwang@exmple.com",
        avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
        introduction:
          "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
      },
      {
        id: 2,
        name: "zangwang",
        email: "zangwang@exmple.com",
        avatar: "https://api.adorable.io/avatars/285/abott@adorable.png",
        introduction:
          "lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec"
      }
    ]
  })
})

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
