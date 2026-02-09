import React, { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import manholeCards from "./data/manholeCards.json";
import anythingsearchCards from "./data/anythingsearchCards.json";
import PhotoGallery from "./PhotoGallery";

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

function anythingsearchUrl(cardId) {
  return `https://anythingsearch.info/mhcard-${cardId.toLowerCase()}/`;
}

const ManholeMarkers = ({ onToggleStop, isInRoute, selectedDay, drawingSegment, addDrawingPoint, finishDrawing }) => {
  const [photoCard, setPhotoCard] = useState(null);

  const collectedCards = manholeCards.filter((c) => c.collected !== false);

  return (
    <>
      {collectedCards.map((card) => {
        const inRoute = isInRoute(card.id);
        const dimmed =
          selectedDay !== null &&
          selectedDay !== undefined &&
          card.collectionDay !== selectedDay;
        const asCard = anythingsearchCards[card.id];
        return (
          <Marker
            key={card.id}
            position={card.coordinates}
            icon={inRoute ? manholeIconActive : manholeIcon}
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
