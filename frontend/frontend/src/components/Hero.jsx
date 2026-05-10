import { useState, useRef, useEffect } from "react";
import { movies } from "./MovieRow";
import { series } from "./SeriesRow";

export default function Hero({ onSelect }) {

  const videoRef = useRef(null);

  const [isHover, setIsHover] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [previewEnded, setPreviewEnded] = useState(false);

  // ✅ CUSTOM ORDER (YOUR REQUIREMENT)
  const allContent = [...movies, ...series];

const orderedMovies = [
  ...allContent.filter(m => m.title === "From"),
  ...allContent.filter(m => m.title === "Dhurandhar"),
  ...allContent.filter(m => m.title === "Ajab Prem Ki Ghazab Kahani"),
  ...allContent.filter(m => m.title === "The Notebook"),
  ...allContent.filter(m => m.title === "Blink"),
  ...allContent.filter(m => m.title === "Passengers"),
  ...allContent.filter(m => m.title === "Officer on Duty"),
  ...allContent.filter(m => m.title === "The Conjuring Last Rites"),
  ...allContent.filter(m => m.title === "Sambhavam Adhyayam Onnu"),
  ...allContent.filter(m => m.title === "Youth"),

  ...allContent.filter(
    m =>
      ![
        "From",
        "Dhurandhar",
        "The Notebook",
        "Ajab Prem Ki Ghazab Kahani",
        "Blink",
        "Passengers",
        "Officer on Duty",
        "The Conjuring Last Rites",
        "Sambhavam Adhyayam Onnu",
        "Youth"
      ].includes(m.title)
  )
];

  const [index, setIndex] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(null);

  const prev = () => {
    setIndex((i) => (i === 0 ? orderedMovies.length - 1 : i - 1));
  };

  const next = () => {
    setIndex((i) => (i === orderedMovies.length - 1 ? 0 : i + 1));
  };

  const current = orderedMovies[index];
  const activeSeason =
  selectedSeason ||
  (current.seasons ? current.seasons[0] : null);

const activeVideo = activeSeason?.video || current.video;
const activeImage = activeSeason?.image || current.image;

  const details = {
    "From": {
    full: "FROM",
    desc: "Mystery • Horror • Survival",
    preview: 2500
  },
    "Sambhavam Adhyayam Onnu": {
      full: "Sambhavam Adhyayam Onnu",
      desc: "Crime • Thriller • Investigation",
      preview: 2800
    },
    "Silsila": {
      full: "Silsila",
      desc: "Love • Drama • Romance",
      preview: 2190
    },
    "The Notebook": {
      full: "The Notebook",
      desc: "Love • Drama • Romance",
      preview: 2800
    },
    "Ajab Prem Ki Ghazab Kahani": {
      full: "Ajab Prem Ki Ghazab Kahani",
      desc: "Love • Drama • Comedy",
      preview: 2782.70
    },
    "The Conjuring Last Rites": {
      full: "The Conjuring Last Rites",
      desc: "Horror • Supernatural • Mystery",
      preview: 3500
    },
    "Blink": {
      full: "Blink",
      desc: "Crime • Sci-fi • Thriller",
      preview: 2800
    },
     "Passengers": {
      full: "Passengers",
      desc: "Drama • Sci-fi • Romance",
      preview: 2803
    },
    
    "Youth": {
      full: "Youth",
      desc: "Drama • College • Fun",
      preview: 3400
    },
    "Dhurandhar": {
      full: "Dhurandhar",
      desc: "Spy • Action • Thriller",
      preview: 5700
    },
    "Officer on Duty": {
      full: "Officer on Duty",
      desc: "Crime • Suspense • Thriller",
      preview: 5000
    }
  };

  const info = details[current.title] || {
    full: current.title,
    desc: "Watch now",
    preview: 0
  };

  useEffect(() => {
  setSelectedSeason(null);
  setIsHover(false);
  setIsMuted(true);
  setPreviewEnded(false);

  if (videoRef.current) {
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  }
}, [index]);


  return (
    <div
      onMouseEnter={() => {
  if (previewEnded) return;

  setIsHover(true);

  setTimeout(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = info.preview || 0;
      videoRef.current.play().catch(() => {});
    }
  }, 100);
}}
      onMouseLeave={() => {
        setIsHover(false);

        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
      style={{
        width: "100%",
        aspectRatio: "21/9",
        position: "relative",
        color: "white",
        overflow: "hidden"
      }}
    >

      {/* 🎬 VIDEO */}
      {isHover && (
  <video
    key={activeVideo}
    ref={videoRef}
    src={activeVideo}
    muted={isMuted}
    preload="auto"
    onTimeUpdate={() => {
      if (videoRef.current) {
        const start = info.preview || 0;
        const played = videoRef.current.currentTime - start;

        if (played >= 60) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
          setIsHover(false);
          setPreviewEnded(true);
        }
      }
    }}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }}
  />
)}

      {/* 🖼 IMAGE */}
      {!isHover && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${activeImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "0.5s ease"
          }}
        />
      )}

      {/* 🔇 MUTE BUTTON */}
      {isHover && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          style={{
            position: "absolute",
            bottom: "30px",
            right: "30px",
            zIndex: 10,
            background: "rgba(0,0,0,0.6)",
            border: "none",
            color: "white",
            padding: "10px",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "18px"
          }}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      )}

      {/* 🔥 LIGHTER GRADIENT */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.45) 20%, rgba(0,0,0,0.3) 45%, transparent 75%)"
        }}
      />

      {/* 🔥 BOTTOM FADE */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "30%",
          background: "linear-gradient(to top, black, transparent)"
        }}
      />

      {/* ⬅️ */}
      <button onClick={prev} style={arrow("left")}>❮</button>

      {/* ➡️ */}
      <button onClick={next} style={arrow("right")}>❯</button>

      {/* 🎬 CONTENT */}
      <div
        style={{
          position: "absolute",
          left: "60px",
          bottom: "80px",
          maxWidth: "520px",
          zIndex: 2
        }}
      >
        {/* ✅ ONLY THIS CHANGED */}
        <h1 style={{
  fontSize: "68px",
  fontWeight: "870",
  letterSpacing: "2px",
  lineHeight: "1.1",
  marginBottom: "10px",
  textTransform: "uppercase",

  /* 🔥 BRIGHT NETFLIX RED */
  color: "#e50914",

  /* 🔥 CLEAN VISIBILITY SHADOW */
  textShadow: `
    0 2px 6px rgba(0,0,0,0.8),
    0 4px 15px rgba(0,0,0,0.5)
  `,

  WebkitTextStroke: "1px rgba(0,0,0,0.5)",

  /* 🔥 STRONG FONT */
  fontFamily: "Impact, Haettenschweiler, 'Arial Black', sans-serif"
}}>
  {info.full}
</h1>

        <p style={{ color: "#ccc", fontSize: "16px", marginBottom: "12px" }}>
          {info.desc}
        </p>

        <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.5" }}>
          Watch this exciting movie now on your CineVerse.
        </p>

        {/* ✅ SERIES SEASON SWITCH */}
{current.seasons && (
  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "15px",
      marginBottom: "15px",
      flexWrap: "wrap"
    }}
  >
    {current.seasons.map((season) => (
      <button
        key={season.season}
        onClick={() => {
  setSelectedSeason(season);
  setIsHover(false);
  setPreviewEnded(false);

  if (videoRef.current) {
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  }
}}
        style={{
          padding: "8px 18px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          background:
            activeSeason?.season === season.season
              ? "#e50914"
              : "rgba(255,255,255,0.2)",
          color: "white"
        }}
      >
        Season {season.season}
      </button>
    ))}
  </div>
)}
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => {

  if (current.seasons) {

    onSelect({
      ...current,
      video: activeVideo,
      currentSeason: activeSeason?.season,
      isSeries: true,
      seasons: current.seasons
    });

  } else {
    onSelect(current.video);
  }
}}
            style={primaryBtn}
          >
            ▶ Play
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🔥 NEW PREMIUM TITLE */
const heroTitle = {
  fontSize: "64px",
  fontWeight: "800",
  letterSpacing: "1px",
  lineHeight: "1.1",
  marginBottom: "10px",

  background: "linear-gradient(180deg, #ffffff, #d6d6d6)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",

  textShadow: `
    0 2px 10px rgba(0,0,0,0.8),
    0 4px 25px rgba(0,0,0,0.6)
  `
};

/* 🔥 BUTTON */
const primaryBtn = {
  padding: "12px 26px",
  background: "white",
  color: "black",
  border: "none",
  borderRadius: "4px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px"
};

/* 🔥 ARROWS */
const arrow = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: "20px",
  transform: "translateY(-50%)",
  zIndex: 5,
  background: "rgba(0,0,0,0.5)",
  border: "none",
  color: "white",
  fontSize: "28px",
  padding: "12px",
  cursor: "pointer",
  borderRadius: "50%",
  opacity: 0.7
});