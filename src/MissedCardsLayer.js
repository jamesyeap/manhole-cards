import React, { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { haversineDistance } from "./distance";

function createMissedIcon() {
  return L.divIcon({
    className: "missed-card-icon",
    html: '<div style="width:24px;height:24px;border-radius:50%;background:#999;opacity:0.7;display:flex;align-items:center;justify-content:center;border:2px solid #777;color:white;font-size:14px;font-weight:bold;line-height:1;">✕</div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

const missedIcon = createMissedIcon();

function findClosestApproach(card, segments, selectedDay, stops) {
  const allPoints = [];

  Object.entries(segments).forEach(([key, points]) => {
    if (selectedDay != null) {
      const [fromId, toId] = key.split("::");
      const fromStop = stops.find((s) => s.id === fromId);
      const toStop = stops.find((s) => s.id === toId);
      if (!fromStop || !toStop) return;
      if (fromStop.collectionDay !== selectedDay && toStop.collectionDay !== selectedDay) return;
    }

    const day = (() => {
      const [fromId] = key.split("::");
      const s = stops.find((st) => st.id === fromId);
      return s ? s.collectionDay : null;
    })();

    points.forEach((pt) => {
      allPoints.push({ lat: pt[0], lon: pt[1], day });
    });
  });

  if (allPoints.length === 0) return null;

  let minDist = Infinity;
  let closestDay = null;

  allPoints.forEach((pt) => {
    const d = haversineDistance(card.coordinates[0], card.coordinates[1], pt.lat, pt.lon);
    if (d < minDist) {
      minDist = d;
      closestDay = pt.day;
    }
  });

  return { distance: minDist, day: closestDay };
}

function MissedCardsLayer({ visible, cards, segments, selectedDay, stops }) {
  const missedCards = useMemo(
    () => cards.filter((c) => c.collected === false),
    [cards],
  );

  const approaches = useMemo(() => {
    const result = {};
    missedCards.forEach((card) => {
      result[card.id] = findClosestApproach(card, segments, selectedDay, stops);
    });
    return result;
  }, [missedCards, segments, selectedDay, stops]);

  if (!visible) return null;

  return (
    <>
      {missedCards.map((card) => {
        const approach = approaches[card.id];
        return (
          <Marker
            key={card.id}
            position={card.coordinates}
            icon={missedIcon}
          >
            <Popup maxWidth={260} className="missed-card-popup">
              <div className="missed-card-popup-content">
                <h3 style={{ margin: "0 0 4px", fontSize: "1em", color: "#666" }}>
                  {card.name}
                </h3>
                <p style={{ margin: "0 0 2px", fontSize: "0.85em", color: "#999" }}>
                  {card.ward} Ward &middot; {card.category}
                </p>
                <p style={{ margin: "8px 0 0", fontSize: "0.85em", color: "#888" }}>
                  {approach
                    ? `Closest approach: ${approach.distance.toFixed(2)} km${approach.day ? ` from Day ${approach.day} route` : ""}`
                    : "No route drawn yet"}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default MissedCardsLayer;
