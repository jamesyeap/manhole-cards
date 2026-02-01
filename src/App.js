import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Fix for default icon in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


const japanLocations = [
  {
    id: 1,
    name: 'Tokyo',
    coordinates: [35.6895, 139.6917],
    description: 'Collected a special edition Tokyo manhole card near the Imperial Palace. It features cherry blossoms and the Tokyo Tower.',
    imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Tokyo+Card' // Placeholder image
  },
  {
    id: 2,
    name: 'Osaka',
    coordinates: [34.6937, 135.5023],
    description: 'Found a unique Osaka manhole card depicting Osaka Castle and local culinary delights like takoyaki. Very detailed!',
    imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Osaka+Card' // Placeholder image
  },
  {
    id: 3,
    name: 'Sapporo',
    coordinates: [43.0621, 141.3544],
    description: 'Acquired a beautiful Sapporo manhole card showcasing the Sapporo Snow Festival and a local beer motif. Chilly but worth it!',
    imageUrl: 'https://via.placeholder.com/150/008000/FFFFFF?text=Sapporo+Card' // Placeholder image
  },
  {
    id: 4,
    name: 'Fukuoka',
    coordinates: [33.5904, 130.4017],
    description: 'Managed to get a Fukuoka manhole card featuring Hakata ramen and Dazaifu Tenmangu Shrine. The design is quite intricate.',
    imageUrl: 'https://via.placeholder.com/150/FFFF00/000000?text=Fukuoka+Card' // Placeholder image
  },
  {
    id: 5,
    name: 'Kyoto',
    coordinates: [35.0116, 135.7681],
    description: 'Visited Kyoto and found a stunning manhole card illustrating a maiko and a traditional temple gate. Truly artistic.',
    imageUrl: 'https://via.placeholder.com/150/FFA500/FFFFFF?text=Kyoto+Card' // Placeholder image
  },
];

function App() {
  const defaultCenter = [36.2048, 138.2529]; // Center of Japan
  const defaultZoom = 6;

  return (
    <div className="App">
      <h1 className="app-title">My Manhole Card Collection in Japan</h1>
      <MapContainer center={defaultCenter} zoom={defaultZoom} className="map-container">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {japanLocations.map(location => (
          <Marker key={location.id} position={location.coordinates}>
            <Popup>
              <div>
                <h2>{location.name}</h2>
                <p>{location.description}</p>
                {location.imageUrl && (
                  <img src={location.imageUrl} alt={`Manhole card from ${location.name}`} style={{ width: '100%', height: 'auto' }} />
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
