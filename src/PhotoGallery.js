import React, { useState, useEffect, useCallback } from "react";

const PhotoGallery = ({ photos, isOpen, onClose, cardName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      setCurrentIndex(0);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const hasPhotos = photos && photos.length > 0;

  return (
    <div className="photo-gallery-overlay" onClick={onClose}>
      <div
        className="photo-gallery-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="photo-gallery-header">
          <h3>{cardName}</h3>
          <button className="photo-gallery-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="photo-gallery-body">
          {!hasPhotos ? (
            <div className="photo-gallery-placeholder">
              <span className="placeholder-icon">📷</span>
              No photos added yet
            </div>
          ) : (
            <>
              <img
                className="photo-gallery-image"
                src={photos[currentIndex].src}
                alt={photos[currentIndex].caption || cardName}
              />
              {photos[currentIndex].caption && (
                <p className="photo-gallery-caption">
                  {photos[currentIndex].caption}
                </p>
              )}
            </>
          )}
        </div>
        {hasPhotos && photos.length > 1 && (
          <div className="photo-gallery-nav">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              ‹
            </button>
            <span>
              {currentIndex + 1} / {photos.length}
            </span>
            <button
              disabled={currentIndex === photos.length - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;
