import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

import RoutingMachine from "./RoutingMachine";

// Fix for default icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const routePoints = [
  { name: "Tokyo Station", coordinates: [35.6812, 139.7671] },
  { name: "Shinjuku Gyoen", coordinates: [35.6852, 139.7107] },
  // This is an explicitly declared "via" point to guide the route. It has no name.
  { coordinates: [39.7, 139.75] },
  { name: "Ueno Park", coordinates: [35.7145, 139.7738] },
  { name: "Shibuya Crossing", coordinates: [35.6591, 139.7037] },
  { name: "Imperial Palace East Garden", coordinates: [35.6881, 139.7533] },
];

function App() {
  const defaultCenter = [35.6895, 139.6917]; // Centered around central Tokyo
  const defaultZoom = 12;

  // Prepare waypoints for the routing machine from the new detailed route points
  const waypoints = routePoints.map((p) =>
    L.Routing.waypoint(L.latLng(p.coordinates[0], p.coordinates[1]), p.name),
  );

  return (
    <div className="App">
      <h1 className="app-title">Interactive Route Planner</h1>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <RoutingMachine waypoints={waypoints} />
      </MapContainer>
    </div>
  );
}

export default App;
