import React from "react";
import { segmentKey } from "./useRoute";

const StopList = ({
  stops,
  segments,
  drawingSegment,
  onRemove,
  onMove,
  onClear,
  onLocate,
  onStartDrawing,
  onFinishDrawing,
  onCancelDrawing,
  onUndoPoint,
  onClearSegment,
  segmentDistances,
  totalDistance,
  selectedDay,
}) => {
  const filteredStops =
    selectedDay != null
      ? stops.filter((s) => s.collectionDay === selectedDay)
      : stops;

  return (
    <div className="stop-list">
      <div className="stop-list-header">
        <h2>My Route{totalDistance > 0 && (
          <span className="route-total-distance">{totalDistance.toFixed(2)} km total</span>
        )}</h2>
        {stops.length > 0 && (
          <button className="clear-btn" onClick={onClear} disabled={!!drawingSegment}>
            Clear all
          </button>
        )}
      </div>

      {filteredStops.length === 0 ? (
        <p className="stop-list-empty">
          {selectedDay != null
            ? `No stops for Day ${selectedDay}.`
            : "Click a manhole marker on the map, then press \"Add to route\" to start building your walking route."}
        </p>
      ) : (
        <ol className="stop-items">
          {filteredStops.map((stop, i) => {
            const isDrawingActive = !!drawingSegment;
            const originalIndex = stops.indexOf(stop);
            return (
              <React.Fragment key={stop.id}>
                <li className="stop-item">
                  <div className="stop-item-info" onClick={() => onLocate(stop)}>
                    <span className="stop-number">{i + 1}</span>
                    <div>
                      <span className="stop-name">{stop.name}</span>
                      <span className="stop-ward">{stop.ward}</span>
                    </div>
                  </div>
                  <div className="stop-item-actions">
                    <button
                      className="stop-move-btn"
                      disabled={originalIndex === 0 || isDrawingActive}
                      onClick={() => onMove(originalIndex, originalIndex - 1)}
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      className="stop-move-btn"
                      disabled={originalIndex === stops.length - 1 || isDrawingActive}
                      onClick={() => onMove(originalIndex, originalIndex + 1)}
                      title="Move down"
                    >
                      ▼
                    </button>
                    <button
                      className="stop-remove-btn"
                      disabled={isDrawingActive}
                      onClick={() => onRemove(stop.id)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </li>

                {i < filteredStops.length - 1 && (
                  <SegmentControl
                    segIndex={originalIndex}
                    fromStop={stop}
                    toStop={filteredStops[i + 1]}
                    segments={segments}
                    drawingSegment={drawingSegment}
                    onStartDrawing={onStartDrawing}
                    onFinishDrawing={onFinishDrawing}
                    onCancelDrawing={onCancelDrawing}
                    onUndoPoint={onUndoPoint}
                    onClearSegment={onClearSegment}
                    segmentDistances={segmentDistances}
                  />
                )}
              </React.Fragment>
            );
          })}
        </ol>
      )}

      {drawingSegment && (
        <div className="drawing-banner">
          Drawing mode active — click on the map to trace your path.
        </div>
      )}
    </div>
  );
};

const SegmentControl = ({
  segIndex,
  fromStop,
  toStop,
  segments,
  drawingSegment,
  onStartDrawing,
  onFinishDrawing,
  onCancelDrawing,
  onUndoPoint,
  onClearSegment,
  segmentDistances,
}) => {
  const key = segmentKey(fromStop, toStop);
  const hasSegment = !!segments[key];
  const isThisDrawing = drawingSegment && drawingSegment.key === key;
  const isOtherDrawing = drawingSegment && drawingSegment.key !== key;

  if (isThisDrawing) {
    return (
      <li className="segment-control segment-drawing">
        <span className="segment-label">
          Click map to add points ({drawingSegment.points.length} placed)
        </span>
        <div className="segment-actions">
          <button
            className="segment-btn undo"
            onClick={onUndoPoint}
            disabled={drawingSegment.points.length <= 1}
          >
            Undo
          </button>
          <button
            className="segment-btn done"
            onClick={onFinishDrawing}
            disabled={drawingSegment.points.length < 2}
          >
            Done
          </button>
          <button className="segment-btn cancel" onClick={onCancelDrawing}>
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="segment-control">
      {hasSegment ? (
        <div className="segment-drawn">
          <span className="segment-check">&#10003;</span>
          <span className="segment-label">Route drawn</span>
          {segmentDistances[key] !== undefined && (
            <span className="segment-distance">{segmentDistances[key].toFixed(2)} km</span>
          )}
          <div className="segment-actions">
            <button
              className="segment-btn redraw"
              disabled={isOtherDrawing}
              onClick={() => onStartDrawing(segIndex)}
            >
              Redraw
            </button>
            <button
              className="segment-btn clear-seg"
              disabled={isOtherDrawing}
              onClick={() => onClearSegment(segIndex)}
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <button
          className="segment-draw-btn"
          disabled={isOtherDrawing}
          onClick={() => onStartDrawing(segIndex)}
        >
          Draw route between stops
        </button>
      )}
    </li>
  );
};

export default StopList;
