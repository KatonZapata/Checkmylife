import { Coordinador } from "./coordinador.js";

window.addEventListener("DOMContentLoaded", function () {
  const usuariologeado = JSON.parse(localStorage.getItem('currentUser'));
    // transformar el localStorage en un objeto Coordinador
    const coordinador2 = new Coordinador();
    coordinador2.nombres = usuariologeado.nombres;
    coordinador2.apellidos = usuariologeado.apellidos;
    coordinador2.usuario = usuariologeado.usuario;
    // Mostrar el nombre del coordinador en la html
    document.getElementById('username').textContent = `${coordinador2.nombres} ${coordinador2.apellidos}`;
  // -------- Barra de energía --------
  const totalDuration = 8 * 60 * 60; // 8 horas en segundos
  let remainingTime = totalDuration;
  const energyFill = document.getElementById("energy-fill");

  function updateEnergyBar() {
    const percentage = (remainingTime / totalDuration) * 100;
    energyFill.style.width = `${percentage}%`;
    if (remainingTime > 0) {
      remainingTime--;
      setTimeout(updateEnergyBar, 1000);
    } else {
      energyFill.style.backgroundColor = "red";
    }
  }

  updateEnergyBar();

  // -------- Mapa --------
  const map = L.map("mapid").setView([6.2442, -75.5812], 13); // Medellín

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const iconOrigen = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

  const iconDestino = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

  const iconActual = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/5374/5374939.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

  const startMarker = L.marker([6.2442, -75.5812], {
    draggable: true,
    icon: iconOrigen
  }).addTo(map).bindPopup("Origen");

  const endMarker = L.marker([6.2700, -75.5700], {
    draggable: true,
    icon: iconDestino
  }).addTo(map).bindPopup("Destino");

  const routeControl = L.Routing.control({
    waypoints: [startMarker.getLatLng(), endMarker.getLatLng()],
    routeWhileDragging: false,
    draggableWaypoints: false,
    addWaypoints: false,
    createMarker: () => null
  }).addTo(map);

  function updateRoute() {
    routeControl.setWaypoints([
      startMarker.getLatLng(),
      endMarker.getLatLng()
    ]);
  }

  let ubicacionActual = null;

  function actualizarInfo() {
    const origenPos = startMarker.getLatLng();
    const destinoPos = endMarker.getLatLng();

    document.getElementById("infoOrigen").innerHTML = 
      `Origen: ${origenPos.lat.toFixed(5)}, ${origenPos.lng.toFixed(5)}`;

    document.getElementById("infoDestino").innerHTML = 
      `Destino: ${destinoPos.lat.toFixed(5)}, ${destinoPos.lng.toFixed(5)}`;

    if (ubicacionActual) {
      document.getElementById("infoActual").innerHTML = 
        `Ubicación Actual: ${ubicacionActual.lat.toFixed(5)}, ${ubicacionActual.lng.toFixed(5)}`;
    } else {
      document.getElementById("infoActual").innerHTML = 
        "Ubicación Actual: No disponible";
    }
  }

  // Eventos para actualizar ruta e info
  startMarker.on("dragend", function () {
    updateRoute();
    actualizarInfo();
  });

  endMarker.on("dragend", function () {
    updateRoute();
    actualizarInfo();
  });

  // Geolocalización
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        ubicacionActual = { lat: latitude, lng: longitude };
        L.marker([latitude, longitude], {
          icon: iconActual
        }).addTo(map).bindPopup("Ubicación Actual").openPopup();

        actualizarInfo();
      },
      (error) => {
        console.error("No se pudo obtener la ubicación:", error.message);
      }
    );
  } else {
    alert("Geolocalización no es compatible en este navegador.");
  }

  actualizarInfo(); // Inicializar valores en pantalla
});
