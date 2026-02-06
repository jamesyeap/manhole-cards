import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import manholeCards from "./data/manholeCards.json";

const manholeIcon = new L.Icon({
  iconUrl: `${process.env.PUBLIC_URL}/manhole-icon.svg`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const manholeIconActive = new L.Icon({
  iconUrl: `${process.env.PUBLIC_URL}/manhole-icon.svg`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17],
  className: "manhole-marker-active",
});

const categoryColors = {
  culture: "#8B5CF6",
  nature: "#10B981",
  character: "#F59E0B",
  landmark: "#3B82F6",
  art: "#EC4899",
};

const ManholeMarkers = ({ onToggleStop, isInRoute }) => {
  return (
    <>
      {manholeCards.map((card) => {
        const inRoute = isInRoute(card.id);
        return (
          <Marker
            key={card.id}
            position={card.coordinates}
            icon={inRoute ? manholeIconActive : manholeIcon}
          >
            <Popup maxWidth={280} className="manhole-popup">
              <div className="manhole-card-popup">
                <span
                  className="manhole-category-badge"
                  style={{ backgroundColor: categoryColors[card.category] }}
                >
                  {card.category}
                </span>
                <h2>{card.name}</h2>
                <p className="manhole-ward">{card.ward} Ward</p>
                <p className="manhole-description">{card.description}</p>
                <div className="manhole-distribution">
                  <strong>Pick up card at:</strong>
                  <p>{card.distributionLocation}</p>
                  <p className="manhole-address">
                    {card.distributionAddress}
                  </p>
                </div>
                <button
                  className={`route-toggle-btn ${inRoute ? "in-route" : ""}`}
                  onClick={() => onToggleStop(card)}
                >
                  {inRoute ? "Remove from route" : "Add to route"}
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default ManholeMarkers;
