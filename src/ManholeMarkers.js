import React, { useState, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import manholeCards from "./data/manholeCards.json";
import anythingsearchCards from "./data/anythingsearchCards.json";
import PhotoGallery from "./PhotoGallery";

const defaultIcon = new L.Icon({
  iconUrl: `${process.env.PUBLIC_URL}/manhole-icon.svg`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const defaultIconActive = new L.Icon({
  iconUrl: `${process.env.PUBLIC_URL}/manhole-icon.svg`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17],
  className: "manhole-marker-active",
});

function createCardIcon(imageUrl, active) {
  const size = active ? 44 : 36;
  const border = active ? "3px solid #6A0DAD" : "2px solid #fff";
  const shadow = active
    ? "0 0 6px #6A0DAD, 0 0 12px rgba(106,13,173,0.4), 0 2px 6px rgba(0,0,0,0.3)"
    : "0 2px 6px rgba(0,0,0,0.3)";
  return L.divIcon({
    className: "manhole-thumb-icon",
    html: `<div style="
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      border:${border};
      box-shadow:${shadow};
      background:url('${imageUrl}') center/cover no-repeat #eee;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
}

const categoryColors = {
  culture: "#8B5CF6",
  nature: "#10B981",
  character: "#F59E0B",
  landmark: "#3B82F6",
  art: "#EC4899",
};

function anythingsearchUrl(cardId) {
  return `https://anythingsearch.info/mhcard-${cardId.toLowerCase()}/`;
}

const ManholeMarkers = ({ onToggleStop, isInRoute, selectedDay, drawingSegment, addDrawingPoint, finishDrawing }) => {
  const [photoCard, setPhotoCard] = useState(null);

  const collectedCards = manholeCards.filter((c) => c.collected !== false);

  const iconCache = useMemo(() => {
    const cache = {};
    collectedCards.forEach((card) => {
      const asCard = anythingsearchCards[card.id];
      if (asCard && asCard.imageUrl) {
        cache[card.id] = {
          normal: createCardIcon(asCard.imageUrl, false),
          active: createCardIcon(asCard.imageUrl, true),
        };
      }
    });
    return cache;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {collectedCards.map((card) => {
        const inRoute = isInRoute(card.id);
        const dimmed =
          selectedDay !== null &&
          selectedDay !== undefined &&
          (!isInRoute(card.id) || card.collectionDay !== selectedDay);
        const asCard = anythingsearchCards[card.id];

        const icons = iconCache[card.id];
        let icon;
        if (icons) {
          icon = inRoute ? icons.active : icons.normal;
        } else {
          icon = inRoute ? defaultIconActive : defaultIcon;
        }

        return (
          <Marker
            key={card.id}
            position={card.coordinates}
            icon={icon}
            opacity={dimmed ? 0.3 : 1}
            eventHandlers={{
              click: (e) => {
                if (drawingSegment) {
                  e.target.closePopup();
                  if (card.id === drawingSegment.toStop.id) {
                    finishDrawing();
                  } else {
                    addDrawingPoint({ lat: card.coordinates[0], lng: card.coordinates[1] });
                  }
                }
              },
            }}
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
                {asCard && asCard.imageUrl && (
                  <a
                    href={anythingsearchUrl(card.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="anythingsearch-thumb-link"
                  >
                    <img
                      src={asCard.imageUrl}
                      alt={`${card.name} on AnythingSearch`}
                      className="anythingsearch-thumb"
                    />
                  </a>
                )}
                <a
                  href={anythingsearchUrl(card.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="anythingsearch-link-btn"
                >
                  View on AnythingSearch ↗
                </a>
                <button
                  className={`route-toggle-btn ${inRoute ? "in-route" : ""}`}
                  onClick={() => onToggleStop(card)}
                >
                  {inRoute ? "Remove from route" : "Add to route"}
                </button>
                <button
                  className="photo-gallery-btn"
                  onClick={() => setPhotoCard(card)}
                >
                  View Photos
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
      <PhotoGallery
        photos={photoCard ? photoCard.photos : []}
        isOpen={photoCard !== null}
        onClose={() => setPhotoCard(null)}
        cardName={photoCard ? photoCard.name : ""}
      />
    </>
  );
};

export default ManholeMarkers;
