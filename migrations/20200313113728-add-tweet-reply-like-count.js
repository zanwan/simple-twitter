"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Tweets", "replyCounts", {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn("Tweets", "likeCounts", {
        type: Sequelize.INTEGER,
        defaultValue: 0
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Tweets", "replyCounts"),
      queryInterface.removeColumn("Tweets", "likeCounts")
    ])
  }
}
