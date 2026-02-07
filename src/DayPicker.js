import React from "react";
import manholeCards from "./data/manholeCards.json";

const days = [...new Set(manholeCards.map((c) => c.collectionDay))].sort(
  (a, b) => a - b
);

const DayPicker = ({ selectedDay, onSelectDay }) => {
  return (
    <div className="day-picker">
      <button
        className={`day-btn ${selectedDay === null ? "day-btn-active" : ""}`}
        onClick={() => onSelectDay(null)}
      >
        All
      </button>
      {days.map((day) => (
        <button
          key={day}
          className={`day-btn ${selectedDay === day ? "day-btn-active" : ""}`}
          onClick={() => onSelectDay(day)}
        >
          Day {day}
        </button>
      ))}
    </div>
  );
};

export default DayPicker;
