"use strict"

const bcrypt = require("bcryptjs")
const faker = require("faker")

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "root@example.com",
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          name: "root",
          introduction: faker.lorem.text(),
          avatar: "https://api.adorable.io/avatars/285/1.png",
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: "user1@example.com",
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          name: "user1",
          introduction: faker.lorem.text(),
          avatar: "https://api.adorable.io/avatars/285/2.png",
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: "user2@example.com",
          password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
          name: "user2",
          introduction: faker.lorem.text(),
          avatar: "https://api.adorable.io/avatars/285/3.png",
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
    queryInterface.bulkInsert(
      "Tweets",
      Array.from({ length: 50 }).map(_d => ({
        UserId: Math.floor(Math.random() * 3) + 1,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
    queryInterface.bulkInsert(
      "Likes",
      Array.from({ length: 50 }).map(_d => ({
        UserId: Math.floor(Math.random() * 3) + 1,
        TweetId: Math.floor(Math.random() * 50) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
    return queryInterface.bulkInsert(
      "Replies",
      Array.from({ length: 150 }).map(_d => ({
        comment: faker.lorem.sentence(),
        UserId: Math.floor(Math.random() * 3) + 1,
        TweetId: Math.floor(Math.random() * 50) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("Users", null, {})
    queryInterface.bulkDelete("Replies", null, {})
    return queryInterface.bulkDelete("Tweets", null, {})
  }
}
