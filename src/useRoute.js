import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import manholeCards from "./data/manholeCards.json";
import { computePolylineDistance } from "./distance";
import { decodeRouteData } from "./ExportShare";

const STOPS_KEY = "manhole-route-stops";
const SEGMENTS_KEY = "manhole-route-segments";

function loadFromHash() {
  const hash = window.location.hash;
  if (!hash || hash.length <= 1) return null;
  const result = decodeRouteData(hash);
  if (result && result.stops.length > 0) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    return result;
  }
  return null;
}

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
  const hashData = useRef(loadFromHash());
  const [stops, setStops] = useState(() =>
    hashData.current ? hashData.current.stops : loadStops()
  );
  const [segments, setSegments] = useState(() =>
    hashData.current ? hashData.current.segments : loadSegments()
  );
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
    (fromStop, toStop) => {
      if (!fromStop || !toStop) return;
      const key = segmentKey(fromStop, toStop);
      setDrawingSegment({
        key,
        fromStop,
        toStop,
        points: [fromStop.coordinates],
      });
    },
    [],
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
    (fromStop, toStop) => {
      if (!fromStop || !toStop) return;
      const key = segmentKey(fromStop, toStop);
      setSegments((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const segmentDistances = useMemo(() => {
    const result = {};
    for (const key of Object.keys(segments)) {
      result[key] = computePolylineDistance(segments[key]);
    }
    return result;
  }, [segments]);

  const totalDistance = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < stops.length - 1; i++) {
      const key = segmentKey(stops[i], stops[i + 1]);
      if (segmentDistances[key] !== undefined) {
        sum += segmentDistances[key];
      }
    }
    return sum;
  }, [stops, segmentDistances]);

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
    segmentDistances,
    totalDistance,
  };
}
