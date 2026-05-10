import { useRef, useState } from "react";

export default function Top10Row({ movies = [], onSelect, onAdd }) {
  const scrollRef = useRef(null);
  const videoRef = useRef(null);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -500, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 500, behavior: "smooth" });
  };

  return (
    <div style={{ color: "white", padding: "40px 0 20px 0", position: "relative" }}>
      <h2 style={{
        marginLeft: "4%",
        fontSize: "1.5vw",
        fontWeight: "bold",
        marginBottom: "10px"
      }}>
        Top 10 Movies in India Today
      </h2>

      <button onClick={scrollLeft} style={arrowStyle("left")}>❮</button>
      <button onClick={scrollRight} style={arrowStyle("right")}>❯</button>

      <div
        ref={scrollRef}
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: "4vw",
          overflowX: "auto",
          padding: "20px 4%",
          scrollBehavior: "smooth"
        }}
      >
        {movies.slice(0, 10).map((movie, index) => (
          <div
            key={movie.video || index}
            style={{
              display: "flex",
              alignItems: "flex-end",
              position: "relative",
              minWidth: "18vw",
              height: "14vw",
              cursor: "pointer",
              transition: "transform 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            onClick={() => setSelectedMovie(movie)}
          >
            <div style={{
              fontSize: "15vw",
              fontFamily: "'Bebas Neue', sans-serif",
              fontWeight: "900",
              lineHeight: "0.8",
              color: "#141414",
              WebkitTextStroke: "2px #555",
              position: "absolute",
              left: index === 9 ? "-5vw" : "-1vw",
              bottom: "-1vw",
              zIndex: 1,
              userSelect: "none",
              letterSpacing: index === 9 ? "-1.8vw" : "normal"
            }}>
              {index + 1}
            </div>

            <div style={{
              position: "relative",
              width: "10vw",
              height: "100%",
              marginLeft: index === 9 ? "8vw" : "6vw",
              borderRadius: "4px",
              overflow: "hidden",
              zIndex: 2,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.5)"
            }}>
              <img
                src={movie.image}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />

              <div style={{
                position: "absolute",
                top: "0",
                right: "0",
                background: "#e50914",
                color: "white",
                padding: "2px 5px",
                fontSize: "0.7vw",
                fontWeight: "bold",
                borderBottomLeftRadius: "4px"
              }}>
                TOP 10
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div
          style={modalOverlayStyle}
          onClick={() => setSelectedMovie(null)}
        >
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <button
              style={closeButtonStyle}
              onClick={() => setSelectedMovie(null)}
            >
              ✕
            </button>

            <div style={{ position: "relative", height: "400px", width: "100%", backgroundColor: "#000" }}>
              <video
                key={selectedMovie.video}
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
                <source src={selectedMovie.video} type="video/mp4" />
              </video>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                style={muteButtonStyle}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            </div>

            <div style={{
              padding: "35px",
              backgroundColor: "#181818",
              borderRadius: "0 0 12px 12px"
            }}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                <button
                  style={smallPlayButtonStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMovie(null);
                    onSelect && onSelect(selectedMovie.video);
                  }}
                >
                  ▶
                </button>

                <button
                  style={circleButtonStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd && onAdd(selectedMovie);
                  }}
                  title="Add to My List"
                >
                  +
                </button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                <div style={{ flex: "1.5", minWidth: "300px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    fontSize: "18px",
                    marginBottom: "15px"
                  }}>
                    <span style={{ color: "#46d369", fontWeight: "bold" }}>
                      {selectedMovie.title}
                    </span>
                    <span>{selectedMovie.duration}</span>
                    <span style={{
                      border: "1px solid #808080",
                      padding: "0 6px",
                      fontSize: "12px"
                    }}>
                      HD
                    </span>
                  </div>

                  <p style={{
                    fontSize: "16px",
                    color: "#d2d2d2",
                    lineHeight: "1.5"
                  }}>
                    {selectedMovie.description}
                  </p>
                </div>

                <div style={{
                  flex: "1",
                  fontSize: "14px",
                  borderLeft: "1px solid #333",
                  paddingLeft: "20px"
                }}>
                  <p style={{ margin: "0 0 10px 0" }}>
                    <span style={{ color: "#777" }}>Cast:</span> {selectedMovie.cast}
                  </p>
                  <p style={{ margin: "0 0 10px 0" }}>
                    <span style={{ color: "#777" }}>Genres:</span> {selectedMovie.genre}
                  </p>
                  <p style={{ margin: "0" }}>
                    <span style={{ color: "#777" }}>Audio:</span> Hindi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const arrowStyle = (side) => ({
  position: "absolute",
  top: "55%",
  [side]: "1%",
  transform: "translateY(-50%)",
  zIndex: 10,
  background: "rgba(0,0,0,0.5)",
  border: "none",
  color: "white",
  fontSize: "2.5vw",
  height: "14vw",
  width: "40px",
  cursor: "pointer",
  transition: "background 0.3s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

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