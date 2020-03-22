"use strict"
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Messagelogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      senterId: {
        type: Sequelize.INTEGER
      },
      getterId: {
        type: Sequelize.INTEGER
      },
      roomId: {
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Messagelogs", {
      restartIdentity: true
    })
  }
}
