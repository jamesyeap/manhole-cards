import React, { useCallback, useState, useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

import ManholeMarkers from "./ManholeMarkers";
import StopList from "./StopList";
import RouteLines from "./RouteLines";
import TripStats from "./TripStats";
import DayPicker from "./DayPicker";
import WardHeatmap from "./WardHeatmap";
import WalkingStats from "./WalkingStats";
import ExportShare from "./ExportShare";
import MissedCardsLayer from "./MissedCardsLayer";
import BottomDrawer from "./BottomDrawer";
import useRoute from "./useRoute";
import manholeCards from "./data/manholeCards.json";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= breakpoint
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

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
  const [showMissedCards, setShowMissedCards] = useState(false);
  const isMobile = useIsMobile();

  const handleLocate = useCallback((stop) => {
    setFlyTarget(stop.coordinates);
    setTimeout(() => setFlyTarget(null), 1000);
  }, []);

  const stopListProps = {
    stops,
    segments,
    drawingSegment,
    onRemove: removeStop,
    onMove: moveStop,
    onClear: clearStops,
    onLocate: handleLocate,
    onStartDrawing: startDrawing,
    onFinishDrawing: finishDrawing,
    onCancelDrawing: cancelDrawing,
    onUndoPoint: undoDrawingPoint,
    onClearSegment: clearSegment,
    segmentDistances,
    totalDistance,
    selectedDay,
  };

  const mapContent = (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="map-container"
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="CartoDB Light">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="CartoDB Dark Matter">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      <RouteLines
        stops={stops}
        segments={segments}
        drawingSegment={drawingSegment}
        onMapClick={addDrawingPoint}
        selectedDay={selectedDay}
      />
      <ManholeMarkers
        onToggleStop={toggleStop}
        isInRoute={isInRoute}
        selectedDay={selectedDay}
        drawingSegment={drawingSegment}
        addDrawingPoint={addDrawingPoint}
        finishDrawing={finishDrawing}
      />
      <WardHeatmap visible={showHeatmap} />
      <MissedCardsLayer
        visible={showMissedCards}
        cards={manholeCards}
        segments={segments}
        selectedDay={selectedDay}
        stops={stops}
      />
      {flyTarget && <FlyTo coordinates={flyTarget} />}
    </MapContainer>
  );

  if (isMobile) {
    return (
      <div className="App App--mobile">
        <div className="mobile-map-fullscreen">{mapContent}</div>
        <BottomDrawer stopCount={stops.length}>
          <DayPicker selectedDay={selectedDay} onSelectDay={setSelectedDay} />
          <TripStats totalDistance={totalDistance} />
          <WalkingStats
            stops={stops}
            segments={segments}
            segmentDistances={segmentDistances}
          />
          <div className="app-controls">
            <button
              className={`heatmap-toggle-btn${showHeatmap ? " active" : ""}`}
              onClick={() => setShowHeatmap((v) => !v)}
            >
              {showHeatmap ? "Hide Heatmap" : "Heatmap"}
            </button>
            <button
              className={`heatmap-toggle-btn${showMissedCards ? " active" : ""}`}
              onClick={() => setShowMissedCards((v) => !v)}
            >
              {showMissedCards ? "Hide Missed" : "Missed"}
            </button>
            <ExportShare stops={stops} segments={segments} />
          </div>
          <StopList {...stopListProps} />
        </BottomDrawer>
      </div>
    );
  }

  return (
    <div className="App">
      <h1 className="app-title">Manhole Card Route Planner</h1>
      <TripStats totalDistance={totalDistance} />
      <DayPicker selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      <WalkingStats
        stops={stops}
        segments={segments}
        segmentDistances={segmentDistances}
      />
      <div className="app-controls">
        <button
          className={`heatmap-toggle-btn${showHeatmap ? " active" : ""}`}
          onClick={() => setShowHeatmap((v) => !v)}
        >
          {showHeatmap ? "Hide Ward Heatmap" : "Show Ward Heatmap"}
        </button>
        <button
          className={`heatmap-toggle-btn${showMissedCards ? " active" : ""}`}
          onClick={() => setShowMissedCards((v) => !v)}
        >
          {showMissedCards ? "Hide Missed Cards" : "Show Missed Cards"}
        </button>
        <ExportShare stops={stops} segments={segments} />
      </div>
      <div className="app-layout">
        <StopList {...stopListProps} />
        {mapContent}
      </div>
    </div>
  );
}

export default App;
