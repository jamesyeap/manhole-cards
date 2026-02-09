import React, { useMemo } from "react";
import manholeCards from "./data/manholeCards.json";
import { segmentKey } from "./useRoute";

const WALK_SPEED_KMH = 5;
const STEPS_PER_KM = 1300;

const collectedCards = manholeCards.filter((c) => c.collected !== false);
const days = [...new Set(collectedCards.map((c) => c.collectionDay))].sort(
  (a, b) => a - b
);

const DAY_COLORS = {
  1: "#6A0DAD",
  2: "#3B82F6",
  3: "#10B981",
  4: "#F59E0B",
  5: "#EF4444",
};

function WalkingStats({ stops, segments, segmentDistances }) {
  const dayStats = useMemo(() => {
    return days.map((day) => {
      const dayStops = stops.filter((s) => s.collectionDay === day);
      let distance = 0;
      for (let i = 0; i < dayStops.length - 1; i++) {
        const key = segmentKey(dayStops[i], dayStops[i + 1]);
        if (segmentDistances[key] !== undefined) {
          distance += segmentDistances[key];
        }
      }
      const timeMinutes = (distance / WALK_SPEED_KMH) * 60;
      const steps = Math.round(distance * STEPS_PER_KM);
      return { day, distance, timeMinutes, steps, cards: dayStops.length };
    });
  }, [stops, segmentDistances]);

  const maxDistance = Math.max(...dayStats.map((d) => d.distance), 0.01);
  const hasAnyRoute = dayStats.some((d) => d.distance > 0);

  if (!hasAnyRoute) {
    return null;
  }

  return (
    <div className="walking-stats">
      <h3 className="walking-stats-title">Walking Stats by Day</h3>
      <div className="walking-stats-chart">
        {dayStats.map((stat) => (
          <div key={stat.day} className="walking-stats-bar-group">
            <div className="walking-stats-bar-container">
              <div
                className="walking-stats-bar"
                style={{
                  height: `${(stat.distance / maxDistance) * 100}%`,
                  backgroundColor: DAY_COLORS[stat.day] || "#6A0DAD",
                }}
              >
                {stat.distance > 0 && (
                  <span className="walking-stats-bar-value">
                    {stat.distance.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
            <span className="walking-stats-bar-label">Day {stat.day}</span>
          </div>
        ))}
      </div>
      <div className="walking-stats-legend">
        <span className="walking-stats-legend-item">km</span>
      </div>
      <div className="walking-stats-details">
        {dayStats.map((stat) => (
          <div key={stat.day} className="walking-stats-detail-row">
            <span
              className="walking-stats-dot"
              style={{ backgroundColor: DAY_COLORS[stat.day] || "#6A0DAD" }}
            />
            <span className="walking-stats-detail-day">Day {stat.day}</span>
            <span className="walking-stats-detail-values">
              {stat.distance > 0 ? (
                <>
                  {stat.distance.toFixed(2)} km
                  {" \u00B7 "}
                  {stat.steps.toLocaleString()} steps
                  {" \u00B7 "}
                  {stat.timeMinutes < 60
                    ? `${Math.round(stat.timeMinutes)} min`
                    : `${Math.floor(stat.timeMinutes / 60)}h ${Math.round(stat.timeMinutes % 60)}m`}
                </>
              ) : (
                <span className="walking-stats-no-route">no route drawn</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WalkingStats;
