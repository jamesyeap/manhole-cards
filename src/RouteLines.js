import React from "react";
import { Polyline, CircleMarker, useMapEvents } from "react-leaflet";
import { segmentKey } from "./useRoute";

const ROUTE_STYLE = {
  color: "#6A0DAD",
  opacity: 0.8,
  weight: 5,
  dashArray: "10, 10",
};

const DRAWING_STYLE = {
  color: "#6A0DAD",
  opacity: 0.5,
  weight: 4,
  dashArray: "6, 8",
};

function DrawingClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

const RouteLines = ({
  stops,
  segments,
  drawingSegment,
  onMapClick,
}) => {
  return (
    <>
      {stops.map((stop, i) => {
        if (i >= stops.length - 1) return null;
        const next = stops[i + 1];
        const key = segmentKey(stop, next);
        const points = segments[key];
        if (!points) return null;
        return (
          <Polyline
            key={key}
            positions={points}
            pathOptions={ROUTE_STYLE}
          />
        );
      })}

      {drawingSegment && (
        <>
          <DrawingClickHandler onMapClick={onMapClick} />
          <Polyline
            positions={drawingSegment.points}
            pathOptions={DRAWING_STYLE}
          />
          {drawingSegment.points.map((pt, i) => (
            <CircleMarker
              key={i}
              center={pt}
              radius={3}
              pathOptions={{
                color: "#6A0DAD",
                fillColor: "#fff",
                fillOpacity: 1,
                weight: 2,
              }}
            />
          ))}
        </>
      )}
    </>
  );
};

export default RouteLines;
