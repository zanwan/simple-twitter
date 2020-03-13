const Server = require("socket.io");
const io = new Server();

const chatController = {
  creatChat: (req, res) => {
    res.sendFile(__dirname + "/chat.html");
    // Each socket also fires a special disconnect event:
    io.on("connection", function(socket) {
      console.log("a user connected");
      socket.on("disconnect", function() {
        console.log("user disconnected");
      });
    });

    io.on("connection", function(socket) {
      socket.on("chat message", function(msg) {
        io.emit("chat message", msg);
      });
    });
  }
};

module.exports = chatController;
