import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "../styles/main.css";

import Logo from "../images/logo.svg";
import Header from "../components/header";
import GalleryScroll from "../components/galleryScroll";


// If your gallery images are in: src/images/gallery/1.jpg ... 23.jpg
// Vite needs static resolution for imports; we’ll use import.meta.glob
const galleryImports = import.meta.glob("../images/gallery/*.{jpg,jpeg,png,webp}", {
  eager: true,
});

function pad2(n) {
  return String(n).padStart(2, "0");
}

function getMonthYearStamp() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `(${month}'${year})`;
}

// Build an array like [1..23]
const COUNT = 23;
const WIDE = new Set([2, 7, 15, 18]);

function resolveImageByIndex(i) {
  // expects filenames like 1.jpg, 2.jpg ... 23.jpg
  // find a match in the glob map
  const key = Object.keys(galleryImports).find((k) => {
    const name = k.split("/").pop()?.split(".")[0];
    return Number(name) === i;
  });
  return key ? galleryImports[key].default : "";
}

export default function AtelierIndex() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1); // 1-based
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const galleryRef = useRef(null);

  const images = useMemo(() => {
    return Array.from({ length: COUNT }, (_, idx) => {
      const i = idx + 1;
      return {
        i,
        src: resolveImageByIndex(i),
        label: pad2(i),
        isWide: WIDE.has(i),
      };
    });
  }, []);

  const maxIndex = images.length;

  const openFullscreenAt = useCallback(
    (i) => {
      setActiveIndex(i);
      setIsFullscreen(true);
    },
    [setActiveIndex, setIsFullscreen]
  );

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((prev) => {
      // mimic your original: if index === maxIndex - 1 -> 1 else +1
      if (prev === maxIndex - 1) return 1;
      return prev + 1;
    });
  }, [maxIndex]);

  const prev = useCallback(() => {
    setActiveIndex((prevVal) => {
      // mimic your original: if index === 1 -> maxIndex - 1 else -1
      if (prevVal === 1) return maxIndex - 1;
      return prevVal - 1;
    });
  }, [maxIndex]);

  // Loader: match your window load behaviour
  useEffect(() => {
    const handle = () => setIsLoaded(true);

    if (document.readyState === "complete") {
      handle();
    } else {
      window.addEventListener("load", handle);
      return () => window.removeEventListener("load", handle);
    }
  }, []);

  // Mouse wheel => horizontal scroll (like old wheelFunc)
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;

    const onWheel = (e) => {
      // prevent page vertical scroll from “stealing” the wheel
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    // passive must be false if we call preventDefault
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isLoaded]);

  // Keyboard events (Escape / arrows) when fullscreen is open
  useEffect(() => {
    if (!isFullscreen) return;

    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeFullscreen();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isFullscreen, prev, next, closeFullscreen]);

  const mainSrc = resolveImageByIndex(activeIndex);
  const sideSrc = resolveImageByIndex(activeIndex + 1); // will be blank at 24, but we never allow activeIndex = 23 in nav logic
  // ^ your original logic effectively keeps index in 1..22 for next/prev loop

  return (
    <>
      {/* LOADER */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.span
            className="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <main className={`container ${!isLoaded ? "hidden" : ""} ${isFullscreen ? "hidden" : ""}`}>
        <Header
          dateLabel={getMonthYearStamp()}
          imagesCount={images.length}
          onViewGallery={() => openFullscreenAt(activeIndex)}
        />

        <section className="typography" aria-hidden="true">
          <h2>
            At the heart of our mission is a deep respect for design as both an art and a language—one that speaks to emotion,
            memory, and identity.
          </h2>
        </section>

        <GalleryScroll
          images={images}
          onImageClick={(i) => openFullscreenAt(i)}
          isEnabled={isLoaded && !isFullscreen}
        />

      </main>

      {/* FULLSCREEN */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.section
            className="full-screen full-screen__typography"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="btn-close" onClick={closeFullscreen} aria-label="Close">
              &times;
            </button>

            <motion.img
              key={mainSrc}
              draggable={false}
              loading="lazy"
              className="main-img"
              src={mainSrc}
              alt="Selected image"
              onClick={closeFullscreen}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />

            <div className="side-screen">
              <div className="side-screen__div">
                <motion.img
                  key={sideSrc}
                  draggable={false}
                  loading="lazy"
                  className="side-img"
                  src={sideSrc}
                  alt="Next image preview"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <p>Neque porro quisquam</p>
              </div>

              <div className="side-screen__text">
                <p>
                  In venenatis <br />
                  non velit in <br />
                  tincidunt
                </p>

                <div className="side-screen__buttons">
                  <button className="btn-prev" onClick={prev}>
                    Prev
                  </button>
                  /
                  <button className="btn-next" onClick={next}>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
