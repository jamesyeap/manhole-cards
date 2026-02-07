import React from "react";
import manholeCards from "./data/manholeCards.json";

const uniqueWards = new Set(manholeCards.map((c) => c.ward)).size;
const uniqueCategories = new Set(manholeCards.map((c) => c.category)).size;

const categoryCounts = manholeCards.reduce((acc, c) => {
  acc[c.category] = (acc[c.category] || 0) + 1;
  return acc;
}, {});

function TripStats({ totalDistance }) {
  return (
    <div className="trip-stats">
      <div className="trip-stat-item">
        <span className="trip-stat-number">{manholeCards.length}</span>
        <span className="trip-stat-label">cards collected</span>
      </div>
      <div className="trip-stat-item">
        <span className="trip-stat-number">{uniqueWards}</span>
        <span className="trip-stat-label">wards visited</span>
      </div>
      <div className="trip-stat-item">
        <span className="trip-stat-number">{uniqueCategories}</span>
        <span className="trip-stat-label">categories</span>
      </div>
      {totalDistance > 0 && (
        <div className="trip-stat-item">
          <span className="trip-stat-number">{totalDistance.toFixed(2)}</span>
          <span className="trip-stat-label">km walked</span>
        </div>
      )}
      <div className="trip-stat-item trip-stats-categories">
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <span key={cat} className="manhole-category-badge trip-category-badge">
            {cat}: {count}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TripStats;
