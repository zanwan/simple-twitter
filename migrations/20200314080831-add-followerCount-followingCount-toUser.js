"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Users", "FollowerCounts", {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn("Users", "FollowingCounts", {
        type: Sequelize.INTEGER,
        defaultValue: 0
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Users", "FollowerCounts"),
      queryInterface.removeColumn("Users", "FollowingCounts")
    ])
  }
}
