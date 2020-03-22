const moment = require("moment")

let generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment(new Date()).format("LT")
  }
}

module.exports = { generateMessage }
