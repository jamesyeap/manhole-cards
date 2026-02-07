import React, { useMemo } from "react";
import { CircleMarker, Tooltip } from "react-leaflet";
import tokyoWards from "./data/tokyoWards.json";
import manholeCards from "./data/manholeCards.json";

function WardHeatmap({ visible }) {
  const wardCounts = useMemo(() => {
    const counts = {};
    manholeCards.forEach((card) => {
      counts[card.ward] = (counts[card.ward] || 0) + 1;
    });
    return counts;
  }, []);

  if (!visible) return null;

  return (
    <>
      {tokyoWards.map((ward) => {
        const count = wardCounts[ward.name] || 0;
        const radius = count === 0 ? 8 : 8 + count * 6;
        const fillColor = count === 0 ? "#ccc" : "#6A0DAD";
        const fillOpacity =
          count === 0 ? 0.3 : Math.min(0.15 + count * 0.15, 0.8);

        return (
          <CircleMarker
            key={ward.name}
            center={ward.center}
            radius={radius}
            pathOptions={{
              fillColor,
              fillOpacity,
              color: "white",
              weight: 1,
              opacity: 0.8,
            }}
          >
            <Tooltip>
              {ward.name}: {count} card{count !== 1 ? "s" : ""}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}

export default WardHeatmap;
