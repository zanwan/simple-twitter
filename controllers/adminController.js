const adminController = {
  getTweets: (req, res) => {
    return res.render("admin/allTweets")
  },
  getUsers: (req, res) => {
    return res.render("admin/allUsers")
  }
}

module.exports = adminController
