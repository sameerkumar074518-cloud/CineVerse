import { useRef, useState } from "react";

/* ✅ DATA WITH GENRES AND CAST */
export const allSeries = [
  {
  _id: "11",

  title: "From",

  image: "/images/From.png",

  genre: "Horror, Mystery, Thriller, Survival",

  duration: "3 Seasons",

  cast: "Harold Perrineau, Catalina Sandino Moreno, Eion Bailey",

  description:
    "A mysterious town traps everyone who enters. As terrifying creatures emerge at night, the residents struggle to survive and uncover the truth behind the town.",

  seasons: [
    {
      season: 1,
      video:
        "https://cineverse.b-cdn.net/From%20Season1.mp4",
        image: "/images/From.png",
        
    },

    {
      season: 2,
      video:
        "https://cineverse.b-cdn.net/From%20Season2.mp4",
        image: "/images/From.png",
    },

    {
      season: 3,
      video:
        "https://cineverse.b-cdn.net/From%20Season3.mp4",
        image: "/images/From.png",
    }
  ]
},
];

export const series = allSeries;

export default function SeriesRow({
  series = [],
  onSelect,
  onAdd,
  onRemove,
  title = "Movies",
  showAdd = true,
  isMyList = false
}) {
  const scrollRef = useRef(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [rowHover, setRowHover] = useState(false);
  const videoRef = useRef(null);

  const isSouthMovies = title.toLowerCase().includes("south");

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
      {title}
    </h2>

    {/* Arrows disappear instantly when rowHover is false */}
    <button 
      onClick={scrollLeft} 
      style={{ 
        ...arrowStyle("left"), 
        opacity: rowHover ? 1 : 0,
        pointerEvents: rowHover ? "auto" : "none",
        transition: "opacity 0.2s ease" // Smooth but fast disappear
      }}
    >
      ‹
    </button>

    <button 
      onClick={scrollRight} 
      style={{ 
        ...arrowStyle("right"), 
        opacity: rowHover ? 1 : 0,
        pointerEvents: rowHover ? "auto" : "none",
        transition: "opacity 0.2s ease"
      }}
    >
      ›
    </button>

    <div
      ref={scrollRef}
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
        {series.length === 0 ? (
          <p style={{ color: "#888" }}>No movies found</p>
        ) : (
          series.map((movie, index) => (
            <div 
              key={movie._id || index}
              style={{
  position: "relative",
  minWidth: "18vw",
  width: "18vw",
  flex: "0 0 18vw",
  transition: "transform 0.25s ease",
  cursor: "pointer"
}}
            >
              <div style={{
  width: "100%",
  height: "10vw",
  borderRadius: "4px",
  overflow: "hidden",
  background: "#111"
}}>
                <img
  src={movie.image || "/images/thumb1.png"}
  alt={movie.title}
  style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
  onClick={() => {
  if (isSouthMovies) {
    onSelect && onSelect(movie.video); // ✅ direct play (YouTube)
  } else {
    setSelectedMovie(movie);

setSelectedSeason(movie.seasons?.[0]);
  }
}}
/>
              </div>
              <p style={titleStyle}>{movie.title}</p>
            </div>
          ))
        )}
      </div>

      {/* 🔥 THE CENTER MODAL (Fixed: Close on click outside & Lookup full data) */}
      {selectedMovie && (() => {
      const fullMovieData = selectedMovie;

        return (
          <div 
            style={modalOverlayStyle} 
            onClick={() => setSelectedMovie(null)} 
          >
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              
              <button style={closeButtonStyle} onClick={() => setSelectedMovie(null)}>✕</button>

              <div style={{ position: "relative", height: "400px", width: "100%", backgroundColor: "#000" }}>
                <video
  key={selectedSeason.video}
  ref={videoRef}
  autoPlay
  muted={isMuted}
  loop
  preload="metadata"
  crossOrigin="anonymous"
  onLoadedMetadata={() => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.duration * 0.3;
    }
  }}
  style={{ 
    width: "100%", 
    height: "100%", 
    objectFit: "cover", 
    borderRadius: "12px 12px 0 0" 
  }}
>
  <source src={selectedSeason.video} type="video/mp4" />
</video>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                  style={muteButtonStyle}
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
              </div>

              <div style={{ padding: "35px", backgroundColor: "#181818", borderRadius: "0 0 12px 12px" }}>
                <div
  style={{
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    position: "relative",
    zIndex: 9999
  }}
>
                  <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
    position: "relative",
    zIndex: 1
  }}
>
  {fullMovieData.seasons.map((seasonObj) => (
    <button
      key={seasonObj.season}
      onClick={() => setSelectedSeason(seasonObj)}
      style={{
        padding: "8px 18px",
        background:
          selectedSeason.season === seasonObj.season
            ? "white"
            : "#333",
        color:
          selectedSeason.season === seasonObj.season
            ? "black"
            : "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Season {seasonObj.season}
    </button>
  ))}
</div>
                  <button 
  style={smallPlayButtonStyle}
  onClick={(e) => {
  e.stopPropagation();

  setSelectedMovie(null); // ✅ closes modal completely

  onSelect &&
    onSelect({
      video: selectedSeason.video,
      title: `${fullMovieData.title} - Season ${selectedSeason.season}`,
      seasons: fullMovieData.seasons,
      currentSeason: selectedSeason.season,
      isSeries: true
    });
}}
>
  ▶
</button>
                  {isMyList ? (
 <button
  type="button"
  style={{
    ...circleButtonStyle,
    position: "relative",
    zIndex: 999999,
    pointerEvents: "auto"
  }}
  onClick={(e) => {
  e.stopPropagation();

  const id = fullMovieData.movieId || fullMovieData._id;

  console.log("DELETE ID USED:", id);

  if (!id) {
    alert("No ID found for this series");
    return;
  }

  onRemove && onRemove(id);
}}
  title="Remove from My List"
>
  ✕
</button>
) : (
                    showAdd && (
  <button
    style={circleButtonStyle}
    onClick={() =>
      onAdd &&
      onAdd({
  movieId: fullMovieData._id, // series delete id
  title: fullMovieData.title,
  image: fullMovieData.image,
  video: fullMovieData.seasons?.[0]?.video,

  genre: fullMovieData.genre,
  cast: fullMovieData.cast,
  description: fullMovieData.description,
  duration: fullMovieData.duration,

  isSeries: true,
  seasons: fullMovieData.seasons
})
    }
    title="Add to My List"
  >
    +
  </button>
)
                  )}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                  <div style={{ flex: "1.5", minWidth: "300px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px", fontSize: "18px", marginBottom: "15px" }}>
                      <span style={{ color: "#46d369", fontWeight: "bold" }}>{fullMovieData.title}</span>
                      <span>{fullMovieData.duration}</span>
                      <span style={{ border: "1px solid #808080", padding: "0 6px", fontSize: "12px" }}>HD</span>
                    </div>
                    <p style={{ fontSize: "16px", color: "#d2d2d2", lineHeight: "1.5" }}>
                      {fullMovieData.description}
                    </p>
                  </div>

                  <div style={{ flex: "1", fontSize: "14px", borderLeft: "1px solid #333", paddingLeft: "20px" }}>
                    <p style={{ margin: "0 0 10px 0" }}><span style={{ color: "#777" }}>Cast:</span> {fullMovieData.cast}</p>
                    <p style={{ margin: "0 0 10px 0" }}><span style={{ color: "#777" }}>Genres:</span> {fullMovieData.genre}</p>
                    <p style={{ margin: "0" }}><span style={{ color: "#777" }}>Audio:</span> Hindi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* 🎨 STYLES */
const arrowStyle = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: "0",
  transform: "translateY(-50%)",
  zIndex: 20,
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: "60px",           // Increased size
  fontWeight: "900",          // Makes the arrow thicker/bolder
  width: "5%",                // Slightly wider hit area
  height: "100%",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // ✅ Multi-layered shadow for that "Ultra Dark" visibility
  filter: `
    drop-shadow(0px 0px 2px rgba(0,0,0,1)) 
    drop-shadow(0px 0px 10px rgba(0,0,0,0.8))
  `,
  transition: "transform 0.1s ease-in-out",
  // Optional: adds a slight scale effect on click
  ":active": {
    transform: "translateY(-50%) scale(0.9)"
  }
});

const smallPreviewCardStyle = {
  position: "absolute",
  top: "-100px",
  left: "0",
  width: "300px", // tighter Netflix-like width
  zIndex: 500,
  boxShadow: "0 10px 30px rgba(0,0,0,0.9)",
  borderRadius: "8px",
  backgroundColor: "#181818",
  transition: "transform 0.25s ease",
};

const smallPlayButtonStyle = {
  background: "white",
  border: "none",
  color: "black",
  borderRadius: "50%",
  width: "38px",
  height: "38px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  paddingLeft: "4px"
};

const smallOutlineButtonStyle = {
  background: "rgba(42,42,42,0.6)",
  border: "2px solid rgba(255,255,255,0.5)",
  color: "white",
  borderRadius: "50%",
  width: "38px",
  height: "38px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px"
};

const innerMuteIconStyle = {
  position: "absolute",
  bottom: "10px",
  right: "10px",
  border: "1px solid white",
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  background: "rgba(0,0,0,0.5)"
};

const progressBarContainer = {
  flex: 1,
  height: "4px",
  backgroundColor: "#444",
  borderRadius: "2px",
  position: "relative"
};

const progressBarFill = {
  width: "70%",
  height: "100%",
  backgroundColor: "#e50914",
  borderRadius: "2px"
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10000
};

const modalContentStyle = {
  width: "900px",
  maxWidth: "95vw",
  maxHeight: "95vh",
  backgroundColor: "#181818",
  borderRadius: "12px",
  position: "relative",
  overflowY: "auto",
  boxShadow: "0 0 40px rgba(0,0,0,0.8)"
};

const closeButtonStyle = {
  position: "absolute",
  top: "15px",
  right: "15px",
  background: "rgba(0,0,0,0.7)",
  border: "2px solid white",
  color: "white",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  cursor: "pointer",
  zIndex: 11000,
  fontSize: "20px"
};

const muteButtonStyle = {
  position: "absolute", 
  bottom: "20px", 
  right: "20px", 
  background: "rgba(0,0,0,0.6)", 
  border: "1px solid #fff", 
  borderRadius: "50%", 
  color: "white", 
  width: "40px", 
  height: "40px",
  cursor: "pointer"
};

const playButtonStyle = {
  background: "white", 
  color: "black", 
  border: "none", 
  borderRadius: "4px", 
  padding: "10px 30px", 
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer"
};

const circleButtonStyle = {
  background: "rgba(42,42,42,1)",
  border: "2px solid #808080",
  color: "white",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  cursor: "pointer",
  fontSize: "20px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  position: "relative",
  zIndex: 99999,
  pointerEvents: "auto"
};

const titleStyle = {
  fontSize: "13px",
  marginTop: "6px",
  textAlign: "center",
  fontWeight: "600",
  color: "#ddd"
};