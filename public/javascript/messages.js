let socket = io()
let arr = []
let url = window.location.pathname
//要來拆字符摟~
let senter = url.charAt(7)
let getter = url.slice(18)
// 努力了很久，很抱歉用這種白痴做法
arr.push(senter)
arr.push(getter)
let roomsort = arr.sort((a, b) => b - a)
let roomname = roomsort.join("")

//懶得 webpack babel async await 直接用判斷？

// axios
//   .get("/api/users/data")
//   .then(function(response) {
//     // 1.handle success
//     username = response.data.user.name
//     useravatar = response.data.user.avatar
//     startSocket = true
//     console.log(response)
//   })
//   .catch(function(error) {
//     // 2.handle error
//     console.log(error)
//   })
//   .then(function() {
//     // 3.always executed
//   })

socket.on("connect", function() {
  console.log("使用者後端建立連線")
  socket.emit("join", roomname, function(err) {
    if (err) {
      alert("Something wrong!")
    } else {
      console.log("join room", roomname)
    }

    document.querySelector("#message-btn").addEventListener("click", function(e) {
      e.preventDefault()

      socket.emit(
        "createMessage",
        {
          from: senter,
          text: document.querySelector('input[name="message"]').value
        },
        function() {}
      )

      let inputText = document.querySelector('input[name="message"]').value
      let inputDate = moment(new Date()).format("LT")

      $(
        "#messages-list"
      ).append(`<div id="message-block" class="d-flex align-items-end flex-column">
      <div class="pr-3 pl-1" style="background-color: #1da1f2;color:white;border-radius: 20px 0px 0px 20px ">
        <p style="padding: 5px; margin:5px">${inputText}</p>
      </div>
      <div class="pr-2 text-muted" style="font-size: 10px;">${inputDate}</div>
    </div>`)

      document.querySelector('input[name="message"]').value = ""
    })

    socket.on("newMessage", function(message) {
      console.log("接受到newMessage", message)
      $(
        "#messages-list"
      ).append(`<div id="message-block" class="d-flex align-items-start flex-column">
      <div class="pl-3 pr-1" style="background-color: #1da1f2;color:white;border-radius: 0px 20px 20px 0px ">
        <p style="padding: 5px; margin:5px">${message.text}</p>
      </div>
      <div class="pl-1 mt-1 text-muted" style="font-size: 10px; ">${message.createdAt}</div>
    </div>`)
      // let ul = document.createElement("ul")
      // ul.innerText = `${message.from}: ${message.text}`
      // document.querySelector("#messages-list").appendChild(ul)
    })
  })
})

socket.on("disconnect", function() {
  console.log("使用者斷開後端連線")
})

// document.querySelector("#sent-message-btn").addEventListener("click", function(e) {
//   e.preventDefault()
//   console.log("hit")
// })

// socket.emit("createMessage", {
//   user: user,
//   message: document.querySelector("#input-message").value
// })
