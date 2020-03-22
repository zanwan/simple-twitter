"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Tweets", "geoInfo", {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Tweets", "geoInfo");
  }
};
