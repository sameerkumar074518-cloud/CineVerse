import { useRef, useState } from "react";

/* ✅ DATA WITH GENRES AND CAST */
export const allMovies = [
  {
    _id: "1",
    title: "Dhurandhar",
    image: "/images/thumb4.png",
    video: "https://cineverse.b-cdn.net/Dhurandhar.mp4",
    genre: "Action, Spy, Thriller",
    duration: "2h 15m",
    cast: "Ranveer Singh, Akshaye Khanna, R Madhavan",
    description: "A fearless spy embarks on a dangerous mission to uncover a global conspiracy."
  },
  {
    _id: "2",
    title: "Ajab Prem Ki Ghazab Kahani",
    image: "/images/thumb9.png",
    video: "https://cineverse.b-cdn.net/Ajab Prem Ki Ghazab Kahani.mp4",
    genre: "Comedy, Drama, Love, Romance",
    duration: "2h 30m",
    cast: "Ranbir Kapoor, Katrina Kaif, Upen Patel",
    description: "A happy-go-lucky young man falls in love with a girl who is already in love with someone else."
  },
  {
    _id: "3",
    title: "The Notebook",
    image: "/images/thumb10.png",
    video: "https://cineverse.b-cdn.net/The Notebook.mp4",
    genre: "Romance, Sci-Fi, Love",
    duration: "2h 4m",
    cast: "Ryan Gosling, Rachel McAdams, James Garner",
    description: "An epic love story told through the pages of a notebook found in a nursing home."
  },
  {
    _id: "4",
    title: "Blink",
    image: "/images/thumb7.png",
    video: "https://cineverse.b-cdn.net/Blink.mp4",
    genre: "Sci-fi, Suspense, Thriller",
    duration: "1h 55m",
    cast: "Dheekshith Shetty, Chaithra J.Achar, Mandara Battalahalli",
    description: "In a world where sight is a luxury, one man discovers a terrifying secret about his past."
  },
  {
    _id: "5",
    title: "Passengers",
    image: "/images/thumb8.png",
    video: "https://cineverse.b-cdn.net/Passengers.mp4",
    genre: "Sci-Fi, Love, Romance",
    duration: "1h 56m",
    cast: "Jennifer Lawrence, Chris Pratt, Michael Sheen",
    description: "Two passengers on a spacecraft traveling to a distant planet are woken up 90 years early."
  },
  {
    _id: "6",
    title: "Sambhavam Adhyayam Onnu",
    image: "/images/thumb1.png",
    video: "https://cineverse.b-cdn.net/Sambhavam Adhyayam Onnu.mp4",
    genre: "Sci-Fi, Thriller, Time Travel",
    duration: "2h 10m",
    cast: "Askar Ali, Vineeth Kumar",
    description: "A mysterious event leads to a series of thrilling investigations."
  },
  {
    _id: "7",
    title: "The Conjuring Last Rites",
    image: "/images/thumb2.png",
    video: "https://cineverse.b-cdn.net/The Conjuring Last Rites.mp4",
    genre: "Horror, Supernatural, Thriller",
    duration: "1h 48m",
    cast: "Patrick Wilson, Vera Farmiga",
    description: "Paranormal investigators take on their most terrifying case yet."
  },
  {
    _id: "8",
    title: "Youth",
    image: "/images/thumb3.png",
    video: "https://cineverse.b-cdn.net/Youth.mp4",
    genre: "Drama, School, Love",
    duration: "2h 5m",
    cast: "Ken Karunas, Suraj Venjaramoodu",
    description: "A group of friends navigates the complexities of school life and first love."
  },
  {
    _id: "9",
    title: "Officer on Duty",
    image: "/images/thumb5.png",
    video: "https://cineverse.b-cdn.net/Officer on Duty.mp4",
    genre: "Action, Thriller, Investigation",
    duration: "2h 20m",
    cast: "Kunchacko Boban, Priyamani",
    description: "A dedicated officer risks everything to solve a high-stakes crime."
  },
  {
    _id: "10",
    title: "Silsila",
    image: "/images/thumb6.png",
    video: "https://cineverse.b-cdn.net/Silsila.mp4",
    genre: "Romance, Drama, Love, Comedy",
    duration: "2h 12m",
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
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const isSouthMovies = title.toLowerCase().includes("south");

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div style={{ color: "white", padding: "20px", position: "relative" }}>
      <h2 style={{ marginBottom: "10px" }}>{title}</h2>

      <button onClick={scrollLeft} style={arrowStyle("left")}>◀</button>
      <button onClick={scrollRight} style={arrowStyle("right")}>▶</button>

      <div
        ref={scrollRef}
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: "15px",
          overflowX: "auto",
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
              style={{ position: "relative", minWidth: "200px" }}
            >
              <div style={{ width: "200px", height: "120px", borderRadius: "6px", overflow: "hidden" }}>
                <img
  src={movie.image || "/images/thumb1.png"}
  alt={movie.title}
  style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
  onClick={() => {
  if (isSouthMovies) {
    onSelect && onSelect(movie.video); // ✅ direct play (YouTube)
  } else {
    setSelectedMovie(movie); // ✅ normal modal
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
        const fullMovieData = allMovies.find(m => m.video === selectedMovie.video) || selectedMovie;

        return (
          <div 
            style={modalOverlayStyle} 
            onClick={() => setSelectedMovie(null)} 
          >
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              
              <button style={closeButtonStyle} onClick={() => setSelectedMovie(null)}>✕</button>

              <div style={{ position: "relative", height: "400px", width: "100%", backgroundColor: "#000" }}>
                <video
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
  <source src={fullMovieData.video} type="video/mp4" />
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
                  <button 
  style={smallPlayButtonStyle}
  onClick={(e) => {
    e.stopPropagation();
    onSelect && onSelect(fullMovieData.video);
  }}
>
  ▶
</button>
                  {isMyList ? (
                    <button style={circleButtonStyle} onClick={() => onRemove && onRemove(fullMovieData.video)} title="Remove from My List">✕</button>
                  ) : (
                    showAdd && <button style={circleButtonStyle} onClick={() => onAdd && onAdd(fullMovieData)} title="Add to My List">+</button>
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
  [side]: "5px",
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
  fontSize: "14px",
  marginTop: "8px",
  textAlign: "center",
  fontWeight: "bold"
};