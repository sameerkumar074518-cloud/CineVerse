import { useRef, useState } from "react";
import { allSeries } from "./SeriesRow";

/* ✅ DATA WITH GENRES AND CAST */
export const allMovies = [
  {
    _id: "1",
    title: "Dhurandhar",
    image: "/images/thumb4.png",
    video: "https://vz-be4ef2dc-3b3.b-cdn.net/c8f17e7e-257f-4650-9fc9-74bc12d7b265/playlist.m3u8",
    genre: "Action, Spy, Thriller",
    duration: "3h 26m",
    cast: "Ranveer Singh, Akshaye Khanna, R Madhavan",
    description: "A fearless spy embarks on a dangerous mission to uncover a global conspiracy."
  },
  {
    _id: "2",
    title: "Ajab Prem Ki Ghazab Kahani",
    image: "/images/thumb9.png",
    video: "https://vz-be4ef2dc-3b3.b-cdn.net/afca21b1-d8b5-4dc1-b2d9-7e13f1285ca5/playlist.m3u8",
    genre: "Comedy, Drama, Love, Romance",
    duration: "2h 31m",
    cast: "Ranbir Kapoor, Katrina Kaif, Upen Patel",
    description: "A happy-go-lucky young man falls in love with a girl who is already in love with someone else."
  },
  {
    _id: "3",
    title: "The Notebook",
    image: "/images/thumb10.png",
    video: "https://vz-be4ef2dc-3b3.b-cdn.net/fb36b514-1f38-4435-b3c6-ab85f477cc39/playlist.m3u8",
    genre: "Romance, Sci-Fi, Love",
    duration: "2h 4m",
    cast: "Ryan Gosling, Rachel McAdams, James Garner",
    description: "An epic love story told through the pages of a notebook found in a nursing home."
  },
  {
    _id: "4",
    title: "Blink",
    image: "/images/thumb7.png",
    video: "https://vz-be4ef2dc-3b3.b-cdn.net/9ed57709-7b2a-4b16-ab25-de1f6376cb8c/playlist.m3u8",
    genre: "Sci-fi, Suspense, Thriller",
    duration: "2h 14m",
    cast: "Dheekshith Shetty, Chaithra J.Achar, Mandara Battalahalli",
    description: "In a world where sight is a luxury, one man discovers a terrifying secret about his past."
  },
  {
    _id: "5",
    title: "Passengers",
    image: "/images/thumb8.png",
    video: "https://vz-be4ef2dc-3b3.b-cdn.net/e9739d86-26c9-4ccd-bdff-0acbb1afdd52/playlist.m3u8",
    genre: "Sci-Fi, Love, Romance",
    duration: "1h 56m",
    cast: "Jennifer Lawrence, Chris Pratt, Michael Sheen",
    description: "Two passengers on a spacecraft traveling to a distant planet are woken up 90 years early."
  },
  {
    _id: "6",
    title: "Sambhavam Adhyayam Onnu",
    image: "/images/thumb1.png",
    video: "https://vz-be4ef2dc-3b3.b-cdn.net/65288ea7-6b4c-4f5a-88da-d6b9bb4704e4/playlist.m3u8",
    genre: "Sci-Fi, Thriller, Time Travel",
    duration: "2h 10m",
    cast: "Askar Ali, Vineeth Kumar",
    description: "A mysterious event leads to a series of thrilling investigations."
  },
  {
    _id: "7",
    title: "The Conjuring Last Rites",
    image: "/images/thumb2.png",
    video: "https://vz-be4ef2dc-3b3.b-cdn.net/3c04f393-4040-40a0-a9d3-7169c73ccb56/playlist.m3u8",
    genre: "Horror, Supernatural, Thriller",
    duration: "2h 16m",
    cast: "Patrick Wilson, Vera Farmiga",
    description: "Paranormal investigators take on their most terrifying case yet."
  },
  {
    _id: "8",
    title: "Youth",
    image: "/images/thumb3.png",
    video: "https://vz-be4ef2dc-3b3.b-cdn.net/9c61c8a0-8c23-47e2-b22b-ec4a3cbdf034/playlist.m3u8",
    genre: "Drama, School, Love",
    duration: "2h 20m",
    cast: "Ken Karunas, Suraj Venjaramoodu",
    description: "A group of friends navigates the complexities of school life and first love."
  },
  {
    _id: "9",
    title: "Officer on Duty",
    image: "/images/thumb5.png",
    video: "https://vz-be4ef2dc-3b3.b-cdn.net/3f8544e8-ad02-4bb5-a376-d9ce20dad64b/playlist.m3u8",
    genre: "Action, Thriller, Investigation",
    duration: "2h 14m",
    cast: "Kunchacko Boban, Priyamani",
    description: "A dedicated officer risks everything to solve a high-stakes crime."
  },
  {
    _id: "10",
    title: "Silsila",
    image: "/images/thumb6.png",
    video: "https://vz-be4ef2dc-3b3.b-cdn.net/6ba70595-32dd-4663-ad60-0f870a65df04/playlist.m3u8",
    genre: "Romance, Drama, Love, Comedy",
    duration: "3h 1m",
    cast: "Amitabh Bachchan, Rekha, Jaya Bachchan",
    description: "A classic tale of love, heartbreak, and difficult choices."
  }
];

export const movies = allMovies;

export default function MovieRow({
  movies = [],
  onSelect,
  onAdd,
  onRemove,
  title = "Movies",
  showAdd = true,
  isMyList = false
}) {
  const scrollRef = useRef(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
const [selectedSeason, setSelectedSeason] = useState(null);
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

      {/* Arrows: Pure white, No shadow, Fade in only on row hover */}
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
        {movies.length === 0 ? (
          <p style={{ color: "#888" }}>No movies found</p>
        ) : (
          movies.map((movie, index) => (
            <div 
              key={movie.video || index} 
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
    onSelect && onSelect(movie.video);
  } else {
    setSelectedMovie(movie);

    if (movie.seasons) {
      setSelectedSeason(movie.seasons[0]);
    }
  }
}}
/>onClick={() => {
  if (isSouthMovies) {
    onSelect && onSelect(movie.video);
  }

  // ✅ SEARCH MODE: series should directly open VideoPlayer
  else if (title === "" && movie.seasons) {
    onSelect &&
      onSelect({
        video: movie.seasons[0].video,
        title: `${movie.title} - Season 1`,
        seasons: movie.seasons,
        currentSeason: 1,
        isSeries: true
      });
  }

  // ✅ SEARCH MODE: movies direct play
  else if (title === "") {
    onSelect && onSelect(movie.video);
  }

  // ✅ NORMAL ROW: open preview modal
  else {
    setSelectedMovie(movie);

    if (movie.seasons) {
      setSelectedSeason(movie.seasons[0]);
    }
  }
}}
              </div>
              <p style={titleStyle}>{movie.title}</p>
            </div>
          ))
        )}
      </div>

      {/* 🔥 THE CENTER MODAL (Fixed: Close on click outside & Lookup full data) */}
      {selectedMovie && (() => {
        const fullMovieData =
  allMovies.find(m => m.video === selectedMovie.video) ||
  allSeries.find(s => s.title === selectedMovie.title) ||
  selectedMovie;

        return (
          <div 
            style={modalOverlayStyle} 
            onClick={() => setSelectedMovie(null)} 
          >
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              
              <button style={closeButtonStyle} onClick={() => setSelectedMovie(null)}>✕</button>

              <div style={{ position: "relative", height: "400px", width: "100%", backgroundColor: "#000" }}>
                <video
  key={
    fullMovieData.seasons
      ? selectedSeason?.video
      : fullMovieData.video
  }
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
  <source
  src={
    fullMovieData.seasons
      ? selectedSeason?.video
      : fullMovieData.video
  }
  type="application/x-mpegURL"
/>
</video>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                  style={muteButtonStyle}
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
              </div>

              <div style={{ padding: "35px", backgroundColor: "#181818", borderRadius: "0 0 12px 12px" }}>
                <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                  {fullMovieData.seasons && (
  <div
    style={{
      display: "flex",
      gap: "10px",
      flexWrap: "wrap"
    }}
  >
    {fullMovieData.seasons.map((seasonObj) => (
      <button
        key={seasonObj.season}
        onClick={() => setSelectedSeason(seasonObj)}
        style={{
          padding: "8px 16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          background:
            selectedSeason?.season === seasonObj.season
              ? "white"
              : "#333",
          color:
            selectedSeason?.season === seasonObj.season
              ? "black"
              : "white",
          fontWeight: "bold"
        }}
      >
        Season {seasonObj.season}
      </button>
    ))}
  </div>
)}
                  <button 
  style={smallPlayButtonStyle}
  onClick={(e) => {
  e.stopPropagation();

  setSelectedMovie(null); // ✅ closes preview modal

  onSelect &&
  onSelect(
    fullMovieData.seasons
      ? {
          video: selectedSeason.video,
          title: `${fullMovieData.title} - Season ${selectedSeason.season}`,
          seasons: fullMovieData.seasons,
          currentSeason: selectedSeason.season,
          isSeries: true
        }
      : fullMovieData.video
  );
}}
>
  ▶
</button>
                  {isMyList ? (
                    <button
  style={circleButtonStyle}
  onClick={() =>
    onRemove &&
    onRemove(
      fullMovieData.movieId ||
      (fullMovieData.seasons ? fullMovieData._id : fullMovieData.video)
    )
  }
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
      onAdd(
  fullMovieData.seasons
    ? {
        ...fullMovieData,
        movieId: fullMovieData._id,
        video: fullMovieData.seasons[0].video,
        isSeries: true
      }
    : fullMovieData
)
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
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "18px", marginBottom: "15px" }}>
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
                    <p style={{ margin: "0" }}>
  <span style={{ color: "#777" }}>Audio:</span> Multiple Languages Available — switch audio anytime from the player controls
</p>
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
  fontSize: "20px"
};

const titleStyle = {
  fontSize: "13px",
  marginTop: "6px",
  textAlign: "center",
  fontWeight: "600",
  color: "#ddd"
};