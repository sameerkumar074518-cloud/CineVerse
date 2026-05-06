import { useRef } from "react";

export default function Top10Row({ movies = [], onSelect }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div style={{ color: "white", padding: "20px", position: "relative" }}>
      
      <h2 style={{ marginBottom: "10px" }}>🔥 Trending Movies </h2>

      {/* ✅ SAME ARROWS AS YOUR OTHER ROWS */}
      <button onClick={scrollLeft} style={arrowStyle("left")}>◀</button>
      <button onClick={scrollRight} style={arrowStyle("right")}>▶</button>

      <div
        ref={scrollRef}
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: "50px",
          overflowX: "auto",
          padding: "40px 20px", // 🔥 EXTRA SPACE SO NUMBERS DON'T CUT
          scrollBehavior: "smooth"
        }}
      >
        {movies.map((movie, index) => (

          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative"
            }}
          >

            {/* 🔥 BIG NUMBER (FULLY VISIBLE LEFT SIDE) */}
            <div style={{
              fontSize: "120px",
              fontWeight: "900",
              color: "#e50914",
              lineHeight: "100px",
              marginRight: "0px", // overlap like Netflix
              zIndex: 1
            }}>
              {index + 1}
            </div>

            {/* 🎬 MOVIE CARD */}
            <div style={{
              position: "relative",
              width: "200px",
              height: "120px",
              borderRadius: "8px",
              overflow: "hidden",
              zIndex: 2
            }}>
              
              <img
                src={movie.image}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "pointer"
                }}
                onClick={() => onSelect && onSelect(movie.video)}
              />

              {/* ▶️ SAME PLAY BUTTON */}
              <button
                  style={{
                    position: "absolute",
                    top: "40%",
                    left: "40%",
                    background: "white",
                    border: "none",
                    borderRadius: "50%",
                    padding: "8px 12px",
                    cursor: "pointer"
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect && onSelect(movie.video);
                  }}
                >
                  ▶
                </button>

              {/* 🔴 TAG */}
              <div style={{
                position: "absolute",
                bottom: "5px",
                left: "5px",
                background: "red",
                padding: "2px 6px",
                fontSize: "10px",
                borderRadius: "3px"
              }}>
                Trending
              </div>

            </div>

          </div>

        ))}
      </div>
    </div>
  );
}

/* ✅ EXACT SAME ARROW STYLE */
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
})