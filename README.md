# Simple Twitter
3 人團隊協作的 Twitter 平台仿作，前端使用 Bootstrap 與 Handlebars 樣版引擎與 ，後端為 Node.js，Sequelize ORM 操作 MySQL 資料庫。使用 Socket.IO 製作一對一聊天功能。部署於 Heroku。

- [Live Demo](https://safe-falls-02835.herokuapp.com/)
- [Original Repo](https://github.com/Samuel-Yeh01/simple-twitter-express-starter)

## 推特系統
- 推文
  - 新增推文
  - 打心推文
  - 回覆推文
- 個人頁面
  - 顯示追蹤者數與追蹤者
  - 顯示被追蹤者數與被追蹤者
  - 顯示打心推文數與打心推文
  - 顯示使用者的所有歷史推文
  - 編輯暱稱 / 自介 / 頭像

![](https://github.com/cybershota/imagebed/blob/main/twitter_home.gif)

## 聊天系統
- 互相追蹤的使用者可以一對一聊天

![](https://github.com/cybershota/imagebed/blob/main/twitter_message.gif)

## 使用技術
- Vanilla JavaScript 搭配 Boostrap UI 套件與 Handlebars 模版引擎為前端
- Node.js Express 後端 Restful API 回傳資料
- Sequelize ORM 操作 MySQL 資料庫
- Socket.IO 製作即時聊天系統
- Travis CI 測試
- Git 與 GitHub 版本控制
- 部署於 Heroku 使用 PostgreSQL 資料庫

## 製作心得
這是我第一次團對協作專案，對於 Git 要如何維護更有概念了。這其間使用 Jandi 即時溝通， HackMD 整理想關文件，在 3 人完全沒見過面的情況，完成可運行的專案，現在想起來還是挺神奇的！
這次專案我負責切版、部分後端邏輯撰寫與即時聊天功能。在切版的部分，因為還不會前端框架，只使用 Handlebars 模版引擎，特別研究 partial 要怎麼運作，讓前端程式更能重複運用；
後端邏輯的部分一度因為測試無法通過而額外改寫許多，了解到一個專案，如果測試案例已經寫好，就一定要緊貼著測試寫邏輯，不然真的自討苦吃呢！最後是 Socket.IO 的部分，是一個我無法掌握但硬生生做出來
的功能，在時限內已盡可能的理解，讓它動起來，未來我想再回頭好好寫清楚這一塊。
