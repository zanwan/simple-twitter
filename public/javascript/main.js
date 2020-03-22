//監聽滑動參數
window.addEventListener("scroll", event => {
  console.log("===New Scroll===");
  console.log(window.scrollY);
  console.log(window.scrollX);
});

//研究網址：https://flaviocopes.com/scrolling/
const container = document.querySelector(".container");
container.scrollTop;
container.scrollLeft;
