const netStatusEl = document.getElementById('network-status');
const locStatusEl = document.getElementById('location-status');
const weatherInfoEl = document.getElementById('weather-info');
const alertMsgEl = document.getElementById('alert-msg');
const shareBtn = document.getElementById('share-btn');

const API_KEY = '6285758ee24bcd2f971ac3a59f3e8139';

let map = L.map('map').setView([0,0],13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const canvas = document.getElementById('route-canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let route = [], plannedRoute = [];
const MAX_DEV = 0.0015;

function checkNetwork(){
  if(!navigator.onLine) netStatusEl.textContent = ' Offline mode';
  else if(navigator.connection && navigator.connection.downlink < 1)
    netStatusEl.textContent = ' Slow network';
  else netStatusEl.textContent = '';
}
window.addEventListener('online', checkNetwork);
window.addEventListener('offline', checkNetwork);
checkNetwork();

function getWeather(lat, lon){
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
    .then(r=>r.json())
    .then(d=>{
      weatherInfoEl.textContent = `Weather: ${d.weather[0].main}, ${d.main.temp}°C`;
    })
    .catch(()=> weatherInfoEl.textContent='Weather data error');
}

function updateLocation(position){
  const {latitude: lat, longitude: lon} = position.coords;
  locStatusEl.textContent = `Coords: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  map.setView([lat, lon], 13);
  L.circle([lat,lon],{radius:10, color:'blue'}).addTo(map);

  route.push([lat,lon]);
  drawRoute(route, 'blue');

  if(plannedRoute.length ===0) plannedRoute=[...route];
  const [pLat,pLon] = plannedRoute[0];
  if(Math.hypot(lat-pLat, lon-pLon)>MAX_DEV){
    alertMsgEl.textContent = ' You veered from your planned route!';
  }

  getWeather(lat, lon);
}

function drawRoute(routeArr, color){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  routeArr.forEach((pt,i)=>{
    const coords = map.latLngToContainerPoint(pt);
    if(i===0) ctx.moveTo(coords.x, coords.y);
    else ctx.lineTo(coords.x, coords.y);
  });
  ctx.stroke();
}

function startGeolocation(){
  if('geolocation' in navigator) {
    navigator.geolocation.watchPosition(updateLocation, e=>locStatusEl.textContent='GPS error', {
      enableHighAccuracy:true, maximumAge:2000, timeout:5000
    });
  }
}

function setupBackgroundCheck(){
  if('serviceWorker' in navigator && 'PeriodicSyncManager' in window){
    navigator.serviceWorker.register('./sw.js')
      .then(reg=>{
        reg.periodicSync.register('update-location', {minInterval:3600000});
      });
  } else setInterval(startGeolocation, 3600000);
}

shareBtn.onclick = () => {
  if(route.length){
    const url = `https://maps.google.com/?q=${route.slice(-1)[0].join(',')}`;
    prompt('Share this link:', url);
  }
};

startGeolocation();
setupBackgroundCheck();
