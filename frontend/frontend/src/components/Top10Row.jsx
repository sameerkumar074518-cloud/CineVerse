import { useRef } from "react";

export default function Top10Row({ movies = [], onSelect }) {
  const scrollRef = useRef(null);

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

      {/* ✅ Premium Arrows */}
      <button onClick={scrollLeft} style={arrowStyle("left")}>❮</button>
      <button onClick={scrollRight} style={arrowStyle("right")}>❯</button>

      <div
        ref={scrollRef}
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: "4vw", // 🔥 Increased global gap for a cleaner look
          overflowX: "auto",
          padding: "20px 4%",
          scrollBehavior: "smooth"
        }}
      >
        {movies.slice(0, 10).map((movie, index) => (
          <div
            key={index}
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
            onClick={() => onSelect && onSelect(movie.video)}
          >

            {/* 🔥 ICONIC HOLLOW NUMBER */}
            <div style={{
              fontSize: "15vw", 
              fontFamily: "'Bebas Neue', sans-serif",
              fontWeight: "900",
              lineHeight: "0.8",
              color: "#141414", 
              WebkitTextStroke: "2px #555", 
              position: "absolute",
              // 🔥 FIX FOR 10: Shifted further left so both digits show
              left: index === 9 ? "-5vw" : "-1vw", 
              bottom: "-1vw",
              zIndex: 1,
              userSelect: "none",
              // 🔥 FIX FOR 10: Tightened letter spacing so the 1 and 0 stay together
              letterSpacing: index === 9 ? "-1.8vw" : "normal" 
            }}>
              {index + 1}
            </div>

            {/* 🎬 MOVIE CARD (The Poster) */}
            <div style={{
              position: "relative",
              width: "10vw", 
              height: "100%",
              // 🔥 FIX FOR 10: More margin so the poster doesn't hide the 0
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

              {/* 🔴 TOP 10 BADGE */}
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