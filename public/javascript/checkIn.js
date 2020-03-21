// 此段文件，為控制前台 checkin的 按鈕而設置
function geoFindMe() {
  const status = document.querySelector("#status");
  const mapLink = document.querySelector("#map-link");
  const mapLink2 = document.querySelector("#map-link2");

  mapLink.href = "";
  mapLink.textContent = "";

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = "";
    mapLink.href = `/checkin`;
    mapLink.textContent = `Latitude: ${Math.round(latitude)} °, 
    Longitude: ${Math.round(longitude)} °`;
    mapLink2.value = `Latitude: ${latitude} °, 
    Longitude: ${longitude} °`;
  }

  function error() {
    status.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

document.querySelector("#find-me").addEventListener("click", geoFindMe);
