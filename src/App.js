import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Fix for default icon in react-leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const japanLocations = [
  {
    id: 1,
    name: "Tokyo Station",
    coordinates: [35.6812, 139.7671],
    description:
      "Found a Tokyo Station manhole card, featuring its iconic red brick facade. A busy but rewarding hunt!",
    imageUrl:
      "https://anythingsearch.info/card/wp-content/uploads/2021/11/13-219-B01.jpg",
  },
  {
    id: 2,
    name: "Shinjuku Gyoen",
    coordinates: [35.6852, 139.7107],
    description:
      "Collected a beautiful Shinjuku Gyoen card, showing its serene gardens amidst the city bustle. A peaceful find!",
    imageUrl:
      "https://anythingsearch.info/card/wp-content/uploads/2021/11/13-219-B01.jpg",
  },
  {
    id: 3,
    name: "Ueno Park",
    coordinates: [35.7145, 139.7738],
    description:
      "Discovered an Ueno Park manhole card, highlighting its museums and cherry blossoms. A cultural treasure!",
    imageUrl:
      "https://anythingsearch.info/card/wp-content/uploads/2021/11/13-219-B01.jpg",
  },
  {
    id: 4,
    name: "Shibuya Crossing",
    coordinates: [35.6591, 139.7037],
    description:
      "Managed to get a Shibuya Crossing manhole card, capturing the energy of the world-famous intersection. Electrifying!",
    imageUrl:
      "https://anythingsearch.info/card/wp-content/uploads/2021/11/13-219-B01.jpg",
  },
  {
    id: 5,
    name: "Imperial Palace East Garden",
    coordinates: [35.6881, 139.7533],
    description:
      "Acquired an Imperial Palace card, depicting its ancient stone walls and lush greenery. A majestic find!",
    imageUrl:
      "https://anythingsearch.info/card/wp-content/uploads/2021/11/13-219-B01.jpg",
  },
];

function App() {
  const defaultCenter = [35.6895, 139.6917]; // Centered around central Tokyo
  const defaultZoom = 12;

  return (
    <div className="App">
      <h1 className="app-title">My Manhole Card Collection in Japan</h1>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {japanLocations.map((location) => (
          <Marker key={location.id} position={location.coordinates}>
            <Popup>
              <div>
                <h2>{location.name}</h2>
                <p>{location.description}</p>
                {location.imageUrl && (
                  <img
                    src={location.imageUrl}
                    alt={`Manhole card from ${location.name}`}
                    style={{
                      width: "100px",
                      height: "auto",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
