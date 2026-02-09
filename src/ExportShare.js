import React, { useState, useCallback } from "react";
import manholeCards from "./data/manholeCards.json";

function encodeRouteData(stops, segments) {
  const data = {
    s: stops.map((s) => s.id),
    g: segments,
  };
  const json = JSON.stringify(data);
  return btoa(encodeURIComponent(json));
}

export function decodeRouteData(hash) {
  try {
    const raw = hash.startsWith("#") ? hash.slice(1) : hash;
    if (!raw) return null;
    const json = decodeURIComponent(atob(raw));
    const data = JSON.parse(json);
    if (!data.s || !Array.isArray(data.s)) return null;
    const stops = data.s
      .map((id) => manholeCards.find((c) => c.id === id))
      .filter(Boolean);
    const segments = data.g || {};
    return { stops, segments };
  } catch {
    return null;
  }
}

function generateGPX(stops, segments) {
  const timestamp = new Date().toISOString();
  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Manhole Card Route Planner"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>Manhole Card Route</name>
    <time>${timestamp}</time>
  </metadata>
`;

  stops.forEach((stop) => {
    const [lat, lon] = stop.coordinates;
    const name = stop.name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const ward = (stop.ward || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    gpx += `  <wpt lat="${lat}" lon="${lon}">
    <name>${name}</name>
    <desc>${ward}</desc>
  </wpt>
`;
  });

  const segmentEntries = Object.entries(segments);
  if (segmentEntries.length > 0) {
    gpx += `  <trk>
    <name>Manhole Card Route</name>
`;
    segmentEntries.forEach(([, points]) => {
      gpx += `    <trkseg>
`;
      points.forEach(([lat, lon]) => {
        gpx += `      <trkpt lat="${lat}" lon="${lon}"></trkpt>
`;
      });
      gpx += `    </trkseg>
`;
    });
    gpx += `  </trk>
`;
  }

  gpx += `</gpx>`;
  return gpx;
}

const ExportShare = ({ stops, segments }) => {
  const [copyState, setCopyState] = useState(null);

  const handleShareURL = useCallback(() => {
    if (stops.length === 0) return;
    const encoded = encodeRouteData(stops, segments);
    const base = window.location.origin + window.location.pathname;
    const url = `${base}#${encoded}`;
    navigator.clipboard.writeText(url).then(
      () => {
        setCopyState("copied");
        setTimeout(() => setCopyState(null), 2000);
      },
      () => {
        setCopyState("failed");
        setTimeout(() => setCopyState(null), 2000);
      }
    );
  }, [stops, segments]);

  const handleExportGPX = useCallback(() => {
    if (stops.length === 0) return;
    const gpx = generateGPX(stops, segments);
    const blob = new Blob([gpx], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manhole-route.gpx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [stops, segments]);

  const disabled = stops.length === 0;

  return (
    <div className="export-share">
      <button
        className="export-share-btn"
        onClick={handleShareURL}
        disabled={disabled}
      >
        {copyState === "copied"
          ? "Copied!"
          : copyState === "failed"
            ? "Copy failed"
            : "Share URL"}
      </button>
      <button
        className="export-share-btn"
        onClick={handleExportGPX}
        disabled={disabled}
      >
        Export GPX
      </button>
    </div>
  );
};

export default ExportShare;
