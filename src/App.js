import React, { useCallback, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

import ManholeMarkers from "./ManholeMarkers";
import StopList from "./StopList";
import RouteLines from "./RouteLines";
import TripStats from "./TripStats";
import DayPicker from "./DayPicker";
import WardHeatmap from "./WardHeatmap";
import useRoute from "./useRoute";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function FlyTo({ coordinates }) {
  const map = useMap();
  React.useEffect(() => {
    if (coordinates) {
      map.flyTo(coordinates, 15, { duration: 0.8 });
    }
  }, [map, coordinates]);
  return null;
}

function App() {
  const defaultCenter = [35.6895, 139.6917];
  const defaultZoom = 12;
  const {
    stops,
    segments,
    drawingSegment,
    toggleStop,
    removeStop,
    moveStop,
    clearStops,
    isInRoute,
    startDrawing,
    addDrawingPoint,
    undoDrawingPoint,
    finishDrawing,
    cancelDrawing,
    clearSegment,
    segmentDistances,
    totalDistance,
  } = useRoute();
  const [flyTarget, setFlyTarget] = React.useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const handleLocate = useCallback((stop) => {
    setFlyTarget(stop.coordinates);
    setTimeout(() => setFlyTarget(null), 1000);
  }, []);

  return (
    <div className="App">
      <h1 className="app-title">Manhole Card Route Planner</h1>
      <TripStats totalDistance={totalDistance} />
      <DayPicker selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      <button
        className={`heatmap-toggle-btn${showHeatmap ? " active" : ""}`}
        onClick={() => setShowHeatmap((v) => !v)}
      >
        {showHeatmap ? "Hide Ward Heatmap" : "Show Ward Heatmap"}
      </button>
      <div className="app-layout">
        <StopList
          stops={stops}
          segments={segments}
          drawingSegment={drawingSegment}
          onRemove={removeStop}
          onMove={moveStop}
          onClear={clearStops}
          onLocate={handleLocate}
          onStartDrawing={startDrawing}
          onFinishDrawing={finishDrawing}
          onCancelDrawing={cancelDrawing}
          onUndoPoint={undoDrawingPoint}
          onClearSegment={clearSegment}
          segmentDistances={segmentDistances}
          totalDistance={totalDistance}
          selectedDay={selectedDay}
          />
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          className="map-container"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <RouteLines
            stops={stops}
            segments={segments}
            drawingSegment={drawingSegment}
            onMapClick={addDrawingPoint}
          />
          <ManholeMarkers onToggleStop={toggleStop} isInRoute={isInRoute} selectedDay={selectedDay} />
          <WardHeatmap visible={showHeatmap} />
          {flyTarget && <FlyTo coordinates={flyTarget} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
