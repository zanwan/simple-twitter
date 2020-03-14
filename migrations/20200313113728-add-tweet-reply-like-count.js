"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Tweets", "ReplyCounts", {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn("Tweets", "LikeCounts", {
        type: Sequelize.INTEGER,
        defaultValue: 0
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Tweets", "ReplyCounts"),
      queryInterface.removeColumn("Tweets", "LikeCounts")
    ])
  }
}
