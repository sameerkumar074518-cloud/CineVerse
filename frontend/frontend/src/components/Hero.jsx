import { useState, useRef, useEffect } from "react";
import { movies } from "./MovieRow";
import { series } from "./SeriesRow";

export default function Hero({ onSelect, onAdd }) {
  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);

  const [isHover, setIsHover] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [previewEnded, setPreviewEnded] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalPreviewEnded, setModalPreviewEnded] = useState(false);

  const allContent = [...movies, ...series];

  const orderedMovies = [
    ...allContent.filter(m => m.title === "Dhurandhar: The Revenge"),
    ...allContent.filter(m => m.title === "Interstellar"),
    ...allContent.filter(m => m.title === "Paatal Lok"),
    ...allContent.filter(m => m.title === "Hereditary"),
    ...allContent.filter(m => m.title === "Lucky Baskhar"),
    ...allContent.filter(m => m.title === "Wake Up Sid"),
    ...allContent.filter(m => m.title === "Farzi"),
    ...allContent.filter(m => m.title === "Dhurandhar"),
    ...allContent.filter(m => m.title === "Por Thozil"),
    ...allContent.filter(m => m.title === "Ajab Prem Ki Ghazab Kahani"),
    ...allContent.filter(m => m.title === "The Notebook"),
    ...allContent.filter(m => m.title === "Passengers"),
    ...allContent.filter(m => m.title === "The Conjuring Last Rites"),
    ...allContent.filter(m => m.title === "Sambhavam Adhyayam Onnu"),
    ...allContent.filter(m => m.title === "Happy Raj"),

    ...allContent.filter(
      m =>
        ![
          "Dhurandhar: The Revenge",
          "Paatal Lok",
          "Hereditary",
          "Por Thozil",
          "Wake Up Sid",
          "Interstellar",
          "Farzi",
          "Dhurandhar",
          "The Notebook",
          "Ajab Prem Ki Ghazab Kahani",
          "Lucky Baskhar",
          "Passengers",
          "The Conjuring Last Rites",
          "Sambhavam Adhyayam Onnu",
          "Happy Raj"
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
    "Dhurandhar: The Revenge": {
      full: "Dhurandhar: The Revenge",
      desc: "Spy • Action • Thriller",
      preview: 4267
    },
    "Paatal Lok": {
      full: "Paatal Lok",
      desc: "Action • Crime • Thriller",
      preview: 4500
    },
    "Hereditary": {
      full: "Hereditary",
      desc: "Horror • Supernatural • Thriller",
      preview: 4500
    },
    "Wake Up Sid": {
      full: "Wake Up Sid",
      desc: "Love • Romance • Drama",
      preview: 2500
    },
    "Por Thozil": {
      full: "Por Thozil",
      desc: "Crime • Thriller • Investigation",
      preview: 3500
    },
    "Interstellar": {
      full: "Interstellar",
      desc: "Sci-Fi • Adventure • Love",
      preview: 4200
    },
    "Farzi": {
      full: "Farzi",
      desc: "Crime • Suspense • Drama",
      preview: 8500
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
      preview: 2782.7
    },
    "The Conjuring Last Rites": {
      full: "The Conjuring Last Rites",
      desc: "Horror • Supernatural • Mystery",
      preview: 3500
    },
    "Lucky Baskhar": {
      full: "Lucky Baskhar",
      desc: "Crime • Drama • Thriller",
      preview: 5810
    },
    "Passengers": {
      full: "Passengers",
      desc: "Drama • Sci-fi • Romance",
      preview: 6000
    },
    "Happy Raj": {
      full: "Happy Raj",
      desc: "Drama • Love • Comedy",
      preview: 3400
    },
    "Dhurandhar": {
      full: "Dhurandhar",
      desc: "Spy • Action • Thriller",
      preview: 5096
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
        if (previewEnded || showInfoModal) return;

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
        height: "92vh",
        position: "relative",
        color: "white",
        overflow: "hidden",
        background: "black"
      }}
    >
      {isHover && (
        <video
          autoPlay
          key={activeVideo}
          ref={videoRef}
          muted={isMuted}
          playsInline
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
            objectFit: "cover",
            transform: "scale(1.01)",
            filter: "brightness(0.9) contrast(1.08) saturate(1.08)"
          }}
        >
          <source
            src={activeVideo}
            type={
              activeVideo?.includes(".mkv")
                ? "video/x-matroska"
                : activeVideo?.includes(".m3u8")
                ? "application/x-mpegURL"
                : "video/mp4"
            }
          />
        </video>
      )}

      {!isHover && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${activeImage})`,
            backgroundSize: "cover",
            transform: "scale(1.01)",
            filter: "brightness(0.97) contrast(1.08) saturate(1.08)",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            imageRendering: "auto",
            transition: "0.5s ease"
          }}
        />
      )}

      {isHover && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          style={heroMiniBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.15)";
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(42,42,42,0.72)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      )}

      {previewEnded && (
        <button
          onClick={() => {
            setPreviewEnded(false);

            setTimeout(() => {
              setIsHover(true);

              setTimeout(() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = info.preview || 0;
                  videoRef.current.play().catch(() => {});
                }
              }, 120);
            }, 50);
          }}
          style={heroMiniBtn}
        >
          ↻
        </button>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isHover
            ? `
              linear-gradient(
                90deg,
                rgba(0,0,0,0.76) 0%,
                rgba(0,0,0,0.48) 24%,
                rgba(0,0,0,0.16) 56%,
                transparent 100%
              )
            `
            : `
              linear-gradient(
                90deg,
                rgba(0,0,0,0.82) 0%,
                rgba(0,0,0,0.62) 22%,
                rgba(0,0,0,0.30) 48%,
                rgba(0,0,0,0.12) 70%,
                transparent 100%
              )
            `
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "42%",
          background: "linear-gradient(to top, black, transparent)"
        }}
      />

      <button onClick={prev} style={arrow("left")}>❮</button>
      <button onClick={next} style={arrow("right")}>❯</button>

      <div
        style={{
          position: "absolute",
          left: "70px",
          bottom: isHover ? "150px" : "95px",
          maxWidth: isHover ? "520px" : "760px",
          zIndex: 2,
          transition: "all 0.35s ease"
        }}
      >
        <h1 style={{
          fontSize: isHover ? "52px" : "46px",
          fontWeight: "900",
          letterSpacing: "1px",
          lineHeight: "1.08",
          marginBottom: isHover ? "22px" : "14px",
          textTransform: "uppercase",
          color: "#e50914",
          textShadow: `
            0 2px 6px rgba(0,0,0,0.9),
            0 6px 18px rgba(0,0,0,0.65)
          `,
          WebkitTextStroke: "1px rgba(0,0,0,0.45)",
          fontFamily: "Impact, Haettenschweiler, 'Arial Black', sans-serif"
        }}>
          {info.full.includes(":")
            ? (
              <>
                {info.full.split(":")[0]}:
                <br />
                <span style={{ color: "#e50914" }}>
                  {info.full.split(":")[1]}
                </span>
              </>
            )
            : info.full}
        </h1>

        {!isHover && (
          <>

            <p
              style={{
                color: "rgba(255,255,255,0.78)",
                fontSize: "18px",
                lineHeight: "1.55",
                maxWidth: "760px",
                marginBottom: "26px",
                textShadow: "0 2px 8px rgba(0,0,0,0.75)"
              }}
            >
              {current.description ||
                "Watch this exciting title now on CineVerse. Enjoy premium entertainment with cinematic visuals, smooth playback, and a powerful streaming experience."}
            </p>
          </>
        )}

        {current.seasons && !isHover && (
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

        <div style={{ marginTop: isHover ? "0px" : "20px" }}>
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

          <button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }

              setIsHover(false);
              setModalPreviewEnded(false);
              setShowInfoModal(true);
            }}
            style={moreInfoBtn}
          >
            ⓘ More Info
          </button>
        </div>
      </div>

      {showInfoModal && (
        <div
          style={modalOverlayStyle}
          onClick={() => {
            setShowInfoModal(false);
            setPreviewEnded(false);
          }}
        >
          <div
            style={modalContentStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={closeButtonStyle}
              onClick={() => {
                setShowInfoModal(false);
                setPreviewEnded(false);
              }}
            >
              ✕
            </button>

            <div style={{ position: "relative", height: "400px", width: "100%", backgroundColor: "#000" }}>
              <video
                ref={modalVideoRef}
                key={activeVideo}
                muted={isMuted}
                autoPlay
                playsInline
                preload="auto"
                poster={activeImage}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "12px 12px 0 0"
                }}
                onLoadedData={(e) => {
                  const v = e.currentTarget;
                  v.currentTime = info.preview || 0;
                  v.play().catch(() => {});
                }}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  const start = info.preview || 0;

                  if (v.currentTime >= start + 45) {
                    v.pause();
                    setModalPreviewEnded(true);
                  }
                }}
              >
                <source
                  src={activeVideo}
                  type={
                    activeVideo?.includes(".mkv")
                      ? "video/x-matroska"
                      : activeVideo?.includes(".m3u8")
                      ? "application/x-mpegURL"
                      : "video/mp4"
                  }
                />
              </video>

              <button
                onClick={() => setIsMuted(!isMuted)}
                style={modalMiniBtn}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>

              {modalPreviewEnded && (
                <button
                  onClick={() => {
                    setModalPreviewEnded(false);

                    setTimeout(() => {
                      const v = modalVideoRef.current;
                      if (!v) return;

                      v.currentTime = info.preview || 0;
                      v.play().catch(() => {});
                    }, 100);
                  }}
                  style={{ ...modalMiniBtn, right: "75px" }}
                >
                  ↻
                </button>
              )}
            </div>

            <div style={{
              padding: "35px",
              backgroundColor: "#181818",
              borderRadius: "0 0 12px 12px"
            }}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                <button
                  style={smallPlayButtonStyle}
                  onClick={() => {
                    if (modalVideoRef.current) {
                      modalVideoRef.current.pause();
                    }

                    setShowInfoModal(false);

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
                >
                  ▶
                </button>

                <button
                  style={circleButtonStyle}
                  onClick={() =>
                    onAdd &&
                    onAdd(
                      current.seasons
                        ? {
                          ...current,
                          movieId: current.seasons[0].video,
                          video: current.seasons[0].video,
                          isSeries: true
                        }
                        : current
                    )
                  }
                >
                  +
                </button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                <div style={{ flex: "1.5", minWidth: "300px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "18px",
                    marginBottom: "15px"
                  }}>
                    <span style={{ color: "#46d369", fontWeight: "bold" }}>{current.title}</span>
                    <span>{current.duration}</span>
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
                    {current.description}
                  </p>
                </div>

                <div style={{
                  flex: "1",
                  fontSize: "14px",
                  borderLeft: "1px solid #333",
                  paddingLeft: "20px"
                }}>
                  <p style={{ margin: "0 0 10px 0" }}>
                    <span style={{ color: "#777" }}>Cast:</span> {current.cast}
                  </p>

                  <p style={{ margin: "0 0 10px 0" }}>
                    <span style={{ color: "#777" }}>Genres:</span> {current.genre}
                  </p>

                  <p style={{ margin: "0" }}>
                    <span style={{ color: "#777" }}>Audio:</span> Currently available in Hindi — multi-language support coming soon.
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

const badgeStyle = {
  background: "#008fa3",
  color: "#001",
  padding: "3px 8px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "900"
};

const ratingBadgeStyle = {
  border: "1px solid rgba(255,255,255,0.7)",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  color: "white"
};

const topCineStyle = {
  position: "absolute",
  bottom: "30px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 3,
  color: "rgba(255,255,255,0.78)",
  fontWeight: "800",
  fontSize: "18px",
  letterSpacing: "0.3px",
  textShadow: "0 2px 10px rgba(0,0,0,0.8)"
};

const primaryBtn = {
  width: "132px",
  height: "50px",
  background: "#fff",
  color: "#000",
  border: "none",
  borderRadius: "6px",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "16px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.35)"
};

const moreInfoBtn = {
  marginLeft: "14px",
  width: "170px",
  height: "50px",
  background: "rgba(109,109,110,0.55)",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "16px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  backdropFilter: "blur(3px)",
  boxShadow: "0 8px 25px rgba(0,0,0,0.25)"
};

const arrow = (side) => ({
  position: "absolute",
  top: "58%",
  [side]: "18px",
  transform: "translateY(-50%)",
  zIndex: 5,
  background: "rgba(0,0,0,0.42)",
  border: "none",
  color: "white",
  fontSize: "32px",
  width: "48px",
  height: "58px",
  cursor: "pointer",
  borderRadius: "8px",
  opacity: 0.72
});

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.8)",
  zIndex: 100000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const modalContentStyle = {
  width: "900px",
  maxWidth: "92vw",
  background: "#181818",
  borderRadius: "12px",
  overflow: "hidden",
  position: "relative"
};

const closeButtonStyle = {
  position: "absolute",
  top: "15px",
  right: "15px",
  background: "rgba(0,0,0,0.7)",
  color: "white",
  border: "2px solid white",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  cursor: "pointer",
  zIndex: 10
};

const modalMiniBtn = {
  position: "absolute",
  bottom: "20px",
  right: "20px",
  zIndex: 20,
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.35)",
  background: "rgba(42,42,42,0.72)",
  color: "white",
  cursor: "pointer",
  fontSize: "18px"
};

const heroMiniBtn = {
  position: "absolute",
  bottom: "90px",
  right: "40px",
  zIndex: 10,
  width: "44px",
  height: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(42,42,42,0.72)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.28)",
  borderRadius: "50%",
  color: "white",
  cursor: "pointer",
  fontSize: "17px",
  transition: "all 0.25s ease",
  boxShadow: "0 4px 20px rgba(0,0,0,0.45)"
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