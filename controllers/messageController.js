const bcrypt = require("bcryptjs")
const db = require("../models")
const { Tweet, User, Like, Reply, Followship, Messagelog } = db
const imgur = require("imgur-node-api")
const helpers = require("../_helpers")
const IMGUR_CLIENT_ID = process.env.IMGUR_ID

const messageController = {
  getUserData: (req, res) => {
    const user = helpers.getUser(req)
    res.json({ user: user })
  },

  getFollowingUser: (req, res) => {
    if (Number(helpers.getUser(req).id) !== Number(req.params.id)) {
      return res.redirect(`/users/${Number(helpers.getUser(req).id)}/messages`)
    }
    User.findByPk(helpers.getUser(req).id, {
      include: [
        { model: User, as: "Followings" },
        { model: User, as: "UserSentMessage" },
        { model: User, as: "UserGetMessage" }
      ],
      nest: true
    }).then(userdata => {
      //整理資料
      const addCurrentUser = userdata.dataValues.Followings.map(f => ({
        ...f.dataValues,
        currentUser: helpers.getUser(req).id
      }))

      console.log("Userdata========>", userdata)
      return res.render("messageDashboard", { chatUsers: addCurrentUser })
    })
  },

  startChatting: (req, res) => {
    if (Number(helpers.getUser(req).id) !== Number(req.params.id)) {
      return res.redirect(`/users/${Number(helpers.getUser(req).id)}/messages`)
    }
    User.findByPk(helpers.getUser(req).id, {
      include: [
        { model: User, as: "Followings" },
        { model: User, as: "UserSentMessage" },
        { model: User, as: "UserGetMessage" }
      ],
      nest: true
    }).then(userdata => {
      //整理資料
      const addCurrentUser = userdata.dataValues.Followings.map(f => ({
        ...f.dataValues,
        currentUser: helpers.getUser(req).id
      }))
      let chatUserName
      User.findByPk(req.params.getterId)
        .then(userName => {
          chatUserName = userName.dataValues.name
        })
        .then(final => {
          return res.render("messageRoom", { chatUsers: addCurrentUser, chatUserName })
        })
    })
  }
}

module.exports = messageController
