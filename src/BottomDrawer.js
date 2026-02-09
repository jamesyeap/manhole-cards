import React, { useState, useRef, useCallback, useEffect } from "react";

const SNAP_COLLAPSED = 0;
const SNAP_HALF = 1;
const SNAP_FULL = 2;

const COLLAPSED_HEIGHT = 48;

function getMaxHeight() {
  return window.innerHeight - 40;
}

function getHalfHeight() {
  return window.innerHeight * 0.45;
}

function snapToHeight(snapState) {
  if (snapState === SNAP_COLLAPSED) return COLLAPSED_HEIGHT;
  if (snapState === SNAP_HALF) return getHalfHeight();
  return getMaxHeight();
}

function nearestSnap(height) {
  const collapsed = COLLAPSED_HEIGHT;
  const half = getHalfHeight();
  const full = getMaxHeight();
  const dists = [
    { snap: SNAP_COLLAPSED, dist: Math.abs(height - collapsed) },
    { snap: SNAP_HALF, dist: Math.abs(height - half) },
    { snap: SNAP_FULL, dist: Math.abs(height - full) },
  ];
  dists.sort((a, b) => a.dist - b.dist);
  return dists[0].snap;
}

const BottomDrawer = ({ children, stopCount }) => {
  const [snapState, setSnapState] = useState(SNAP_COLLAPSED);
  const [dragging, setDragging] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(COLLAPSED_HEIGHT);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!dragging) {
      setCurrentHeight(snapToHeight(snapState));
    }
  }, [snapState, dragging]);

  const handleTouchStart = useCallback(
    (e) => {
      const touch = e.touches[0];
      dragStartY.current = touch.clientY;
      dragStartHeight.current = currentHeight;
      setDragging(true);
    },
    [currentHeight]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!dragging) return;
      const touch = e.touches[0];
      const delta = dragStartY.current - touch.clientY;
      const newHeight = Math.max(
        COLLAPSED_HEIGHT,
        Math.min(getMaxHeight(), dragStartHeight.current + delta)
      );
      setCurrentHeight(newHeight);
    },
    [dragging]
  );

  const handleTouchEnd = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const velocitySnap = nearestSnap(currentHeight);
    setSnapState(velocitySnap);
    setCurrentHeight(snapToHeight(velocitySnap));
  }, [dragging, currentHeight]);

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      dragStartY.current = e.clientY;
      dragStartHeight.current = currentHeight;
      setDragging(true);

      const onMouseMove = (ev) => {
        const delta = dragStartY.current - ev.clientY;
        const newHeight = Math.max(
          COLLAPSED_HEIGHT,
          Math.min(getMaxHeight(), dragStartHeight.current + delta)
        );
        setCurrentHeight(newHeight);
      };

      const onMouseUp = () => {
        setDragging(false);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [currentHeight]
  );

  useEffect(() => {
    if (!dragging) return;
    const snap = nearestSnap(currentHeight);
    setSnapState(snap);
  }, [dragging, currentHeight]);

  const handleToggle = useCallback(() => {
    if (snapState === SNAP_COLLAPSED) {
      setSnapState(SNAP_HALF);
    } else {
      setSnapState(SNAP_COLLAPSED);
    }
  }, [snapState]);

  return (
    <div
      ref={drawerRef}
      className={`bottom-drawer ${dragging ? "bottom-drawer-dragging" : ""}`}
      style={{ height: currentHeight }}
    >
      <div
        className="bottom-drawer-handle"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onClick={handleToggle}
      >
        <div className="bottom-drawer-handle-bar" />
        <span className="bottom-drawer-summary">
          {stopCount > 0 ? `${stopCount} stop${stopCount !== 1 ? "s" : ""}` : "My Route"}
        </span>
      </div>
      <div className="bottom-drawer-content">{children}</div>
    </div>
  );
};

export default BottomDrawer;
