import { useEffect, useState, useRef } from "react";

export default function ContinueWatching({ movies = [], onSelect, user }) {
  const [watched, setWatched] = useState([]);
  const scrollRef = useRef(null); // ✅ ADD

  useEffect(() => {
  if (!user) return;

  const filtered = (movies || [])
    .map((movie) => {

  const saveId =
    movie.seasons
      ? movie.title
      : movie.video;

  // ✅ SERIES USES LATEST CONTINUE KEY
  const key = movie.seasons
    ? `continue_${user}_${movie.title}`
    : `progress_${user}_${saveId}`;

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
  savedVideo: data.currentVideo || movie.video
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
}, [movies, user]);

  if (!watched.length) return null;

  // ✅ SCROLL FUNCTIONS
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div style={{ padding: "20px", color: "white", position: "relative" }}>
      <h2>Continue Watching</h2>

      {/* ⬅ LEFT */}
      <button onClick={scrollLeft} style={arrowStyle("left")}>◀</button>

      {/* ➡ RIGHT */}
      <button onClick={scrollRight} style={arrowStyle("right")}>▶</button>

      <div
        ref={scrollRef} // ✅ ADD
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: "15px",
          overflowX: "auto",
          paddingBottom: "10px",
          scrollBehavior: "smooth"
        }}
      >
        {watched.map((movie, index) => (
          <div key={index} style={{ width: "200px" }}>

            <div
              style={{
                position: "relative",
                width: "200px",
                height: "120px",
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
            <p style={{ textAlign: "center", marginTop: "6px", fontWeight: "bold" }}>
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
  zIndex: 10,
  background: "rgba(0,0,0,0.6)",
  border: "none",
  color: "white",
  fontSize: "20px",
  padding: "10px",
  cursor: "pointer",
  borderRadius: "50%"
});