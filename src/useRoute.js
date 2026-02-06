import { useState, useCallback, useEffect } from "react";
import manholeCards from "./data/manholeCards.json";

const STOPS_KEY = "manhole-route-stops";
const SEGMENTS_KEY = "manhole-route-segments";

function loadStops() {
  try {
    const raw = localStorage.getItem(STOPS_KEY);
    if (!raw) return [];
    const ids = JSON.parse(raw);
    return ids
      .map((id) => manholeCards.find((c) => c.id === id))
      .filter(Boolean);
  } catch {
    return [];
  }
}

function saveStops(stops) {
  localStorage.setItem(STOPS_KEY, JSON.stringify(stops.map((s) => s.id)));
}

function segmentKey(stopA, stopB) {
  return `${stopA.id}::${stopB.id}`;
}

function loadSegments() {
  try {
    const raw = localStorage.getItem(SEGMENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSegments(segments) {
  localStorage.setItem(SEGMENTS_KEY, JSON.stringify(segments));
}

export { segmentKey };

export default function useRoute() {
  const [stops, setStops] = useState(loadStops);
  const [segments, setSegments] = useState(loadSegments);
  const [drawingSegment, setDrawingSegment] = useState(null);

  useEffect(() => {
    saveStops(stops);
  }, [stops]);

  useEffect(() => {
    saveSegments(segments);
  }, [segments]);

  const toggleStop = useCallback((card) => {
    setStops((prev) => {
      const exists = prev.find((s) => s.id === card.id);
      if (exists) return prev.filter((s) => s.id !== card.id);
      return [...prev, card];
    });
  }, []);

  const removeStop = useCallback((cardId) => {
    setStops((prev) => prev.filter((s) => s.id !== cardId));
  }, []);

  const moveStop = useCallback((fromIndex, toIndex) => {
    setStops((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const clearStops = useCallback(() => {
    setStops([]);
    setSegments({});
    setDrawingSegment(null);
  }, []);

  const isInRoute = useCallback(
    (cardId) => stops.some((s) => s.id === cardId),
    [stops],
  );

  const startDrawing = useCallback(
    (segIndex) => {
      const a = stops[segIndex];
      const b = stops[segIndex + 1];
      if (!a || !b) return;
      const key = segmentKey(a, b);
      setDrawingSegment({
        key,
        fromStop: a,
        toStop: b,
        points: [a.coordinates],
      });
    },
    [stops],
  );

  const addDrawingPoint = useCallback((latlng) => {
    setDrawingSegment((prev) => {
      if (!prev) return prev;
      return { ...prev, points: [...prev.points, [latlng.lat, latlng.lng]] };
    });
  }, []);

  const undoDrawingPoint = useCallback(() => {
    setDrawingSegment((prev) => {
      if (!prev || prev.points.length <= 1) return prev;
      return { ...prev, points: prev.points.slice(0, -1) };
    });
  }, []);

  const finishDrawing = useCallback(() => {
    setDrawingSegment((prev) => {
      if (!prev) return prev;
      const finalPoints = [...prev.points, prev.toStop.coordinates];
      setSegments((segs) => ({ ...segs, [prev.key]: finalPoints }));
      return null;
    });
  }, []);

  const cancelDrawing = useCallback(() => {
    setDrawingSegment(null);
  }, []);

  const clearSegment = useCallback(
    (segIndex) => {
      const a = stops[segIndex];
      const b = stops[segIndex + 1];
      if (!a || !b) return;
      const key = segmentKey(a, b);
      setSegments((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [stops],
  );

  return {
    stops,
    segments,
    drawingSegment,
    toggleStop,
    removeStop,
    moveStop,
    clearStops,
    isInRoute,
    startDrawing,
    addDrawingPoint,
    undoDrawingPoint,
    finishDrawing,
    cancelDrawing,
    clearSegment,
  };
}
