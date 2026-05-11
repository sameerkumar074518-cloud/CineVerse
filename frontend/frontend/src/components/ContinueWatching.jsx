import { useEffect, useState, useRef } from "react";

export default function ContinueWatching({ movies = [], onSelect, user, profile }) {
  const [watched, setWatched] = useState([]);
const [rowHover, setRowHover] = useState(false);
const [hoveredIndex, setHoveredIndex] = useState(null);
  const scrollRef = useRef(null); // ✅ ADD

  useEffect(() => {
  if (!user || !profile) return;

  const filtered = (movies || [])
    .map((movie) => {

  const saveId =
    movie.seasons
      ? movie.title
      : movie.video;

  // ✅ SERIES USES LATEST CONTINUE KEY
  const key = movie.seasons
    ? `continue_${user}_${profile.id}_${movie.title}`
    : `progress_${user}_${profile.id}_${saveId}`;

  const saved = localStorage.getItem(key);

      if (!saved) return null;

      try {
        const data = JSON.parse(saved);

        if (!data || !data.duration || data.currentTime < 2) return null;

        const percent = (data.currentTime / data.duration) * 100;

        // ❌ REMOVE fully watched
        if (percent > 95) return null;

        return {
  ...movie,
  progress: percent,
  lastUpdated: data.lastUpdated || 0,

  isSeries: data.isSeries || false,
  seasons: data.seasons || null,
  currentSeason: data.currentSeason || null,
  fullTitle: data.title || movie.title,

  // ✅ latest watched season
  savedVideo: data.currentVideo || movie.video,
remainingTime: data.duration - data.currentTime
};
      } catch {
        return null;
      }
    })
    .filter(Boolean)

    // 🔥 SORT LATEST FIRST (NETFLIX STYLE)
    .sort((a, b) => b.lastUpdated - a.lastUpdated)

    // 🔥 REMOVE DUPLICATES
    .filter((movie, index, self) =>
  index ===
  self.findIndex(
    m =>
      (m.savedVideo || m.video) ===
      (movie.savedVideo || movie.video)
  )
);

  setWatched(filtered);
}, [movies, user, profile]);

  if (!watched.length) return null;

  // ✅ SCROLL FUNCTIONS
  const scrollLeft = () => {
  const row = scrollRef.current;
  if (!row) return;

  row.scrollBy({
    left: -(row.clientWidth * 0.85),
    behavior: "smooth"
  });
};

const scrollRight = () => {
  const row = scrollRef.current;
  if (!row) return;

  row.scrollBy({
    left: row.clientWidth * 0.85,
    behavior: "smooth"
  });
};

  return (
   <div
  onMouseEnter={() => setRowHover(true)}
  onMouseLeave={() => setRowHover(false)}
  style={{
    color: "white",
    padding: "18px 0",
    position: "relative",
    overflow: "hidden"
  }}
>
  <h2 style={{
    marginBottom: "12px",
    fontSize: "1.4vw",
    fontWeight: "700",
    paddingLeft: "4%",
    color: "#e5e5e5"
  }}>
    Continue Watching
  </h2>

  <button
    onClick={scrollLeft}
    style={{
      ...arrowStyle("left"),
      opacity: rowHover ? 1 : 0,
      pointerEvents: rowHover ? "auto" : "none"
    }}
  >
    ‹
  </button>

  <button
    onClick={scrollRight}
    style={{
      ...arrowStyle("right"),
      opacity: rowHover ? 1 : 0,
      pointerEvents: rowHover ? "auto" : "none"
    }}
  >
    ›
  </button>

      <div
        ref={scrollRef} // ✅ ADD
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: "8px",
overflowX: "auto",
paddingLeft: "4%",
paddingRight: "4%",
paddingBottom: "10px",
          scrollBehavior: "smooth"
        }}
      >
        {watched.map((movie, index) => (
          <div
  key={index}
  style={{
    position: "relative",
    minWidth: "18vw",
    width: "18vw",
    flex: "0 0 18vw",
    transition: "transform 0.25s ease",
    cursor: "pointer"
  }}
>

            <div
  onMouseEnter={() => setHoveredIndex(index)}
  onMouseLeave={() => setHoveredIndex(null)}
  onClick={() => {
    if (movie.isSeries) {
      const originalSeries = movies.find(
        (m) =>
          m.title?.toLowerCase().trim() ===
          movie.title?.toLowerCase().trim()
      );

      if (!originalSeries) return;

      onSelect({
        ...originalSeries,
        video: movie.savedVideo || movie.video,
        currentSeason: movie.currentSeason,
        isSeries: true,
        seasons: originalSeries.seasons
      });

    } else {
      onSelect(movie.savedVideo || movie.video);
    }
  }}
  style={{
    position: "relative",
    width: "100%",
    height: "10vw",
    cursor: "pointer",
                overflow: "hidden",
                borderRadius: "6px"
              }}
            >
              <img
  src={movie.image}
  alt={movie.title}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    cursor: "pointer"
  }}
  onClick={() => {

  if (movie.isSeries) {

    // ✅ find original full series object
    const originalSeries = movies.find(
  (m) =>
    m.title?.toLowerCase().trim() ===
    movie.title?.toLowerCase().trim()
);

    if (!originalSeries) return;

    onSelect({
      ...originalSeries,

      // ✅ open saved season video
      video: movie.savedVideo || movie.video,

      currentSeason: movie.currentSeason,

      // ✅ IMPORTANT
      isSeries: true,
      seasons: originalSeries.seasons
    });

  } else {
    onSelect(movie);
  }
}}
/>

{hoveredIndex === index && (
  <div style={{
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "15px",
    fontWeight: "bold",
    zIndex: 5
  }}>
    {Math.floor(movie.remainingTime / 3600) > 0
      ? `${Math.floor(movie.remainingTime / 3600)}h ${Math.floor((movie.remainingTime % 3600) / 60)}m left`
      : `${Math.floor(movie.remainingTime / 60)}m left`}
  </div>
)}

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: "4px",
                  width: `${Math.min(movie.progress || 0, 100)}%`,
                  background: "#e50914"
                }}
              />
            </div>

            {/* ✅ FULL TITLE */}
           <p style={{
  fontSize: "13px",
  marginTop: "6px",
  textAlign: "center",
  fontWeight: "600",
  color: "#ddd"
}}>
              {movie.fullTitle || movie.title}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
}

/* 🔥 SAME STYLE AS MOVIEROW */
const arrowStyle = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: "0",
  transform: "translateY(-50%)",
  zIndex: 20,
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: "60px",
  fontWeight: "900",
  width: "5%",
  height: "100%",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  filter: `
    drop-shadow(0px 0px 2px rgba(0,0,0,1)) 
    drop-shadow(0px 0px 10px rgba(0,0,0,0.8))
  `,
  transition: "transform 0.1s ease-in-out"
});