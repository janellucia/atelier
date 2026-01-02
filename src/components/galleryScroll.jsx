import { useEffect, useRef, useState } from "react";

export default function GalleryScroll({ images, onImageClick, isEnabled = true }) {
  const galleryRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Mouse wheel => horizontal scroll (like your old wheelFunc)
  useEffect(() => {
    if (!isEnabled) return;

    const el = galleryRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isEnabled]);

  return (
    <section className="gallery" ref={galleryRef}>
      {images.map((img, idx) => {
        const isActive = hoveredIndex === idx;
        const isPrev = hoveredIndex != null && idx === hoveredIndex - 1;
        const isNext = hoveredIndex != null && idx === hoveredIndex + 1;

        const className = [
          "card",
          img.isWide ? "card-wide" : "",
          isActive ? "active" : "",
          isPrev ? "shrink-left" : "",
          isNext ? "shrink-right" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={img.i}
            className={className}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              draggable={false}
              loading="lazy"
              src={img.src}
              alt={`Gallery image ${img.label}`}
              onClick={() => onImageClick?.(img.i)}
            />
            <span>{img.label}</span>
          </div>
        );
      })}
    </section>
  );
}
