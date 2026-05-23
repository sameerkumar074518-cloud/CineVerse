import { useRef, useState } from "react";
import { allSeries } from "./SeriesRow";

/* ✅ DATA WITH GENRES AND CAST */
export const allMovies = [
  {
    _id: "18",
    title: "Dhurandhar: The Revenge",
    image: "/images/thumb18.png",
    video: "https://archive.org/download/cinefreak.-top-dhurandhar-the-revenge-2026-web-dl-hi/CINEFREAK.TOP%20-%20Dhurandhar%20The%20Revenge%20%282026%29%20WEB-DL%20%5BHi.mkv",
    genre: "Action, Spy, Crime, Thriller",
    duration: "3h 55m",
    cast: "Ranveer Singh, Arjun Rampal, R Madhavan",
    description: "Jaskirat Singh Rangi descends deeper into his alias as Hamza Ali Mazari, rising through Karachi's criminal hierarchy to claim the feared title 'Sher-e-Baloch' while balancing loyalty, betrayal, and survival in a ruthless underworld."
  },
  {
    _id: "1",
    title: "Dhurandhar",
    image: "/images/thumb4.png",
    video: "https://archive.org/download/por-thozhil-2023-uncut-1080p-hdrip-x-264-esubs-dual-audio-hindi-org/Dhurandhar.mp4",
    genre: "Action, Spy, Thriller",
    duration: "3h 26m",
    cast: "Ranveer Singh, Akshaye Khanna, R Madhavan",
    description: "A fearless spy embarks on a dangerous mission to uncover a global conspiracy."
  },
  {
    _id: "2",
    title: "Ajab Prem Ki Ghazab Kahani",
    image: "/images/thumb9.png",
    video: "https://archive.org/download/the-conjuring-last-rites_202605/Ajab%20Prem%20Ki%20Ghazab%20Kahani.mp4",
    genre: "Comedy, Drama, Love, Romance",
    duration: "2h 31m",
    cast: "Ranbir Kapoor, Katrina Kaif, Upen Patel",
    description: "A happy-go-lucky young man falls in love with a girl who is already in love with someone else."
  },
  {
    _id: "3",
    title: "The Notebook",
    image: "/images/thumb10.png",
    video: "https://archive.org/download/the-notebook-2004-1080p-blu-ray-dual-audio-hindi-or-english-x-265/_The_Notebook_2004_1080p_BluRay_Dual_Audio_Hindi_or_English_%C3%97265.mkv",
    genre: "Romance, Sci-Fi, Love",
    duration: "2h 4m",
    cast: "Ryan Gosling, Rachel McAdams, James Garner",
    description: "An epic love story told through the pages of a notebook found in a nursing home."
  },
  {
    _id: "4",
    title: "Lucky Baskhar",
    image: "/images/thumb7.png",
    video: "https://archive.org/download/lucky-bhaskar-2024-1080p-10bit-nf-webrip-hindi-ddp-5-1-x-265-hevc/Lucky_Bhaskar_2024_1080p_10bit_NF_WEBRip_Hindi_DDP5_1_x265_HEVC.mkv",
    genre: "Crime, Thriller, Drama",
    duration: "2h 28m",
    cast: "Dulquer Salmaan, Meenakshi Chaudhary, Tinnu Anand",
    description: "A cash-strapped cashier working at a bank embarks on a risky investment scheme and soon gets drawn into the murky world of money laundering."
  },
  {
    _id: "5",
    title: "Passengers",
    image: "/images/thumb8.png",
    video: "https://archive.org/download/mm-passengers-2016-1080p-10bit-bluray-x-265-hevc-org-hindi-dd/MM_Passengers_2016_1080p_10bit_Bluray_x265_HEVC_Org_Hindi_DD.mkv",
    genre: "Sci-Fi, Love, Romance",
    duration: "1h 56m",
    cast: "Jennifer Lawrence, Chris Pratt, Michael Sheen",
    description: "Two passengers on a spacecraft traveling to a distant planet are woken up 90 years early."
  },
  {
    _id: "6",
    title: "Sambhavam Adhyayam Onnu",
    image: "/images/thumb1.png",
    video: "https://archive.org/download/the-conjuring-last-rites_202605/Sambhavam%20Adhyayam%20Onnu.mp4",
    genre: "Sci-Fi, Thriller, Time Travel",
    duration: "2h 10m",
    cast: "Askar Ali, Vineeth Kumar",
    description: "A mysterious event leads to a series of thrilling investigations."
  },
  {
    _id: "7",
    title: "The Conjuring Last Rites",
    image: "/images/thumb2.png",
    video: "https://archive.org/download/the-conjuring-last-rites_202605/The%20Conjuring%20Last%20Rites.mp4",
    genre: "Horror, Supernatural, Thriller",
    duration: "2h 16m",
    cast: "Patrick Wilson, Vera Farmiga",
    description: "Paranormal investigators take on their most terrifying case yet."
  },
  {
    _id: "8",
    title: "Happy Raj",
    image: "/images/thumb3.png",
    video: "https://archive.org/download/happy-raj/Happy%20Raj.mp4",
    genre: "Drama, Comedy, Love",
    duration: "2h 39m",
    cast: "Sri Gouri Priya, G.V. Prakash Kumar, Abbas",
    description: "A romantically unlucky man meets a woman who reciprocates his feelings, but when she insists their families meet, his eccentric father clashes with hers."
  },
  {
    _id: "10",
    title: "Silsila",
    image: "/images/thumb6.png",
    video: "https://archive.org/download/silsila-1981-blu-ray-720p-hindi-aac-5-1-x-264-esub-mkv-cinemas-telly/Silsila_1981_BluRay_720p_Hindi_AAC_5_1_x264_ESub_mkvCinemas_Telly.mkv",
    genre: "Romance, Drama, Love, Comedy",
    duration: "3h 1m",
    cast: "Amitabh Bachchan, Rekha, Jaya Bachchan",
    description: "A classic tale of love, heartbreak, and difficult choices."
  },
  {
    _id: "11",
    title: "Interstellar",
    image: "/images/thumb12.png",
    video: "https://archive.org/download/interstellar-2014-dual-audio-hindi-english-full-movie_202605/Interstellar%20%282014%29%20Dual%20Audio%20%5BHindi%20%2B%20English%5D%20Full%20Movie%20.mkv",
    genre: "Sci-Fic, Adventure, Love",
    duration: "2h 50m",
    cast: "	Matthew McConaughey, Anne Hathaway, Jessica Chastain",
    description: "In the near future, humanity faces extinction due to dust storms and widespread crop blights. Cooper, a widowed former NASA test pilot, works as a farmer and raises his children, Murph and Tom, alongside his father-in-law Donald."
  },
  {
    _id: "12",
    title: "Wake Up Sid",
    image: "/images/thumb13.png",
    video: "https://archive.org/download/wake-up-sid-2009-hindi-1080p-blu-ray-x-264-aac-5.1/Wake%20Up%20Sid%20%282009%29%20Hindi%201080p%20BluRay%20x264%20AAC%205.1.mkv",
    genre: "Love, Romance, Drama",
    duration: "3h 26m",
    cast: "Ranbir Kapoor, Konkona Sen, Anupam Kher",
    description: "Wake Up Sid (2009) is a coming-of-age comedy-drama set in Mumbai, following a wealthy but aimless college student whose life changes after befriending an ambitious writer. As their worlds collide, he begins a journey of self-discovery."
  },
  {
    _id: "13",
    title: "Por Thozil",
    image: "/images/thumb15.png",
    video: "https://archive.org/download/por-thozhil-2023-uncut-1080p-hdrip-x-264-esubs-dual-audio-hindi-org/Por_Thozhil_2023_UNCUT_1080p_HDRip_x264_ESubs_Dual_Audio_Hindi_ORG.mkv",
    genre: "Crime, Pyscho, Thriller",
    duration: "2h 27m",
    cast: "R Sarathkumar, Lisha Chinnu, Ashok Selvan",
    description: "A bright but faint-hearted rookie cop has to overcome his fears in order to succeed in his first case which sees him partnered with a reclusive senior officer to catch a serial killer on the loose."
  },
  {
    _id: "14",
    title: "Hereditary",
    image: "/images/thumb16.png",
    video: "https://archive.org/download/hereditary-2018-1080p-ds-4-k-10bit-bluray-hindi-dd-2-0-english-ddp-5/Hereditary_2018_1080p_DS4K_10bit_Bluray_Hindi_DD2_0_%2B_English_DDP5.mkv",
    genre: "Psychological Horror, Supernatural",
    duration: "2h 7m",
    cast: "Toni Collete, Milly Shapiro, Gabriel Byrne",
    description: "A grieving family is haunted by tragic and disturbing occurrences."
  },
   {
    _id: "45",
    title: "Madhuvidhu",
    image: "/images/thumb19.png",
    video: "https://archive.org/download/madhuvidhu.-2026.1080p.-ds-4-k.-web-dl.-hindi.-5.1-malayalam.-5/Madhuvidhu.2026.1080p.DS4K.WEB-DL.Hindi.5.1-Malayalam.5.mkv",
    genre: "Comedy, Drama, Family, Romance",
    duration: "2h 5m",
    cast: "Sharafudheen, Jagadish, Kalyani Panicker",
    description: "A newlywed couple's dreams of happiness fade as everyday pressures mount. What began with promise turns into a test of endurance, with each day requiring more effort to bridge the growing gap between them."
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
  const [previewEnded, setPreviewEnded] = useState(false);
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
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.12)";
    e.currentTarget.style.zIndex = 50;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.zIndex = 1;
  }}
  style={{
    position: "relative",
    minWidth: "20vw",
width: "20vw",
flex: "0 0 20vw",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    cursor: "pointer",
    zIndex: 1
  }}
>
              <div style={{
  width: "100%",
  height: "10.5vw",
borderRadius: "10px",
  overflow: "hidden",
  background: "#111",
  boxShadow: "0 8px 25px rgba(0,0,0,0.6)"
}}>
                <img
  src={movie.image || "/images/thumb1.png"}
  alt={movie.title}
  style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
  onClick={() => {
    if (isSouthMovies) {
      onSelect && onSelect(movie.video);
    } else {
      setPreviewEnded(false);
      setSelectedMovie(movie);

      if (movie.seasons) {
        setSelectedSeason(movie.seasons[0]);
      }
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
        const fullMovieData =
  allMovies.find(
    m =>
      m.video === selectedMovie.video ||
      m.video === selectedMovie.movieId ||
      m._id === selectedMovie.movieId ||
      m.title === selectedMovie.title
  ) ||
  allSeries.find(
    s =>
      s.title === selectedMovie.title ||
      s.video === selectedMovie.video ||
      s.video === selectedMovie.movieId
  ) ||
  selectedMovie;
        return (
          <div 
            style={modalOverlayStyle} 
            onClick={() => setSelectedMovie(null)} 
          >
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              
              <button style={closeButtonStyle} onClick={() => setSelectedMovie(null)}>✕</button>

              <div style={{ position: "relative", height: "58%", width: "100%", backgroundColor: "#000" }}>
                {previewEnded ? (
  <img
    src={fullMovieData.image}
    alt={fullMovieData.title}
   onClick={() => {
  setPreviewEnded(false);

  setTimeout(() => {
    const v = videoRef.current;
    if (!v) return;

    const startTime = v.duration * 0.35;

    const handleSeeked = () => {
      v.play().catch(() => {});
      v.removeEventListener("seeked", handleSeeked);
    };

    v.addEventListener("seeked", handleSeeked);
    v.currentTime = startTime;
  }, 300);
}}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "12px 12px 0 0",
      cursor: "pointer"
    }}
  />
) : (
  <video
    key={
      fullMovieData.seasons
        ? selectedSeason?.video
        : fullMovieData.video
    }
    ref={videoRef}
    muted={isMuted}
    playsInline
    preload="auto"
    poster={fullMovieData.image}
    src={
  fullMovieData.seasons
    ? selectedSeason?.video || fullMovieData.seasons?.[0]?.video
    : fullMovieData.video || fullMovieData.movieId
}
    onLoadedData={() => {
  const v = videoRef.current;
  if (!v) return;

  const startTime = v.duration * 0.35;

  const handleSeeked = () => {
    v.play().catch(() => {});
    v.removeEventListener("seeked", handleSeeked);
  };

  v.addEventListener("seeked", handleSeeked);
  v.currentTime = startTime;
}}
    onClick={() => {
  const v = videoRef.current;
  if (!v) return;

  if (Number.isFinite(v.duration)) {
    v.currentTime = v.duration * 0.35;
  }

  v.play().catch(() => {});
}}
    onTimeUpdate={() => {
      const v = videoRef.current;
      if (!v) return;

      const startTime = v.duration * 0.35;
      const stopTime = startTime + 45;

      if (v.currentTime >= stopTime) {
        v.pause();
        setPreviewEnded(true);
      }
    }}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "12px 12px 0 0",
      cursor: "pointer"
    }}
  />
)}
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                  style={muteButtonStyle}
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
              </div>

              <div style={{
  padding: "22px",
  backgroundColor: "#181818",
  borderRadius: "0 0 12px 12px",
  flex: 1,
  overflow: "hidden"
}}>
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
        video:
          selectedSeason?.video ||
          fullMovieData.seasons?.[0]?.video,

        title: `${fullMovieData.title} - Season ${
          selectedSeason?.season ||
          fullMovieData.seasons?.[0]?.season ||
          1
        }`,

        seasons: fullMovieData.seasons,

        currentSeason:
          selectedSeason?.season ||
          fullMovieData.seasons?.[0]?.season ||
          1,

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
fullMovieData.video ||
fullMovieData.seasons?.[0]?.video ||
fullMovieData._id
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
        movieId:
  fullMovieData._id ||
  fullMovieData.title,
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
                    <p style={{ fontSize: "14px", color: "#d2d2d2", lineHeight: "1.4" }}>
                      {fullMovieData.description}
                    </p>
                  </div>

                  <div style={{
  flex: "1",
  fontSize: "13px",
  borderLeft: "1px solid #333",
  paddingLeft: "16px"
}}>
                    <p style={{ margin: "0 0 10px 0" }}><span style={{ color: "#777" }}>Cast:</span> {fullMovieData.cast}</p>
                    <p style={{ margin: "0 0 10px 0" }}><span style={{ color: "#777" }}>Genres:</span> {fullMovieData.genre}</p>
                    <p style={{ margin: "0" }}>
  <span style={{ color: "#777" }}>Audio:</span> Currently available in Hindi — multi-language support coming soon.
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
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.88)",
  backdropFilter: "blur(6px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10000,
  padding: "20px"
};
const modalContentStyle = {
  width: "900px",
  maxWidth: "92vw",
  height: "88vh",
  backgroundColor: "#141414",
  borderRadius: "14px",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 30px 100px rgba(0,0,0,0.95)",
  animation: "modalPop 0.25s ease",
  display: "flex",
  flexDirection: "column"
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
  background: "rgba(35,35,35,0.95)",
  border: "2px solid rgba(255,255,255,0.55)",
  color: "white",
  borderRadius: "50%",
  width: "42px",
  height: "42px",
  cursor: "pointer",
  fontSize: "22px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const titleStyle = {
  fontSize: "13px",
  marginTop: "6px",
  textAlign: "center",
  fontWeight: "600",
  color: "#ddd"
};