import { useRef, useState, useEffect, useCallback } from "react";

export default function NetflixPremiumPlayer({
  video,
  title,
  onClose,
  seasons,
  currentSeason,
  onSeasonChange,
  isSeries
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  // States
  const [isInitialLoading, setIsInitialLoading] = useState(true); 
  const [showLoadingText, setShowLoadingText] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true); 
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);

  // Initial Logic & Timer
  useEffect(() => {
    // 6 second limit for the download text
    const textTimer = setTimeout(() => {
      setShowLoadingText(false);
    }, 6000);

    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      
      setTimeout(() => {
        if (videoRef.current) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch((error) => {
                console.log("Autoplay prevented:", error);
                setIsPlaying(false);
              });
          }
        }
      }, 100);
    }, 3500); // Slightly longer to appreciate the "Senior Words" intro

    return () => {
      clearTimeout(timer);
      clearTimeout(textTimer);
    };
  }, []);

  // Fullscreen & Activity logic
  useEffect(() => {
    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    let timeout;
    const handleActivity = () => {
      setShowControls(true);
      clearTimeout(timeout);
      if (isFullScreen && isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000);
      }
    };
    window.addEventListener("mousemove", handleActivity);
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      clearTimeout(timeout);
    };
  }, [isFullScreen, isPlaying]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return "00:00";
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    const parts = [m, s].map(v => v.toString().padStart(2, "0"));
    if (h > 0) parts.unshift(h.toString().padStart(2, "0"));
    return parts.join(":");
  };

  const handleProgressHover = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(Math.max(x / rect.width, 0), 1);
    setHoverTime(pct * duration);
    setHoverX(x);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = video;
    a.download = `${title || "video"}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // GRAPHICS ORIENTED INTRO SCREEN
  if (isInitialLoading) {
    return (
      <div style={initialLoadingWrapper}>
        <div style={introContainer}>
          <h1 className="netflix-text-anim" style={brandName}>CineVerse</h1>
          {showLoadingText && (
            <p className="fade-in-text" style={oneLinePopup}>
              Download the movies to view in multiple language with subtitles
            </p>
          )}
        </div>
        <style>{`
          @keyframes netflix-intro {
            0% { transform: scale(0.9); opacity: 0; letter-spacing: 5px; }
            100% { transform: scale(1); opacity: 1; letter-spacing: 2px; }
          }
          @keyframes fade-up {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .netflix-text-anim {
            animation: netflix-intro 1.5s ease-out forwards;
            text-shadow: 0 0 20px rgba(229, 9, 20, 0.6);
          }
          .fade-in-text {
            animation: fade-up 1s ease-out 0.5s forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ ...playerWrapper, cursor: showControls ? "default" : "none" }}>
      {isBuffering && (
        <div style={loaderOverlay}>
           <div className="mini-spinner"></div>
        </div>
      )}

      <video
  key={video}
  ref={videoRef}
  src={video}
        playsInline
        style={mainVideo}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => { setIsBuffering(false); setIsPlaying(true); }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
  const v = videoRef.current;

  setCurrentTime(v.currentTime);
  setProgress((v.currentTime / v.duration) * 100);

  const user = localStorage.getItem("user");
  if (!user) return;

  const saveId = isSeries
    ? `${title.split(" - ")[0]}_season_${currentSeason}`
    : video;

  const key = `progress_${user}_${saveId}`;

  // ✅ PER SEASON SAVE
  localStorage.setItem(
    key,
    JSON.stringify({
      currentTime: v.currentTime,
      duration: v.duration,

      isSeries,
      seasons,
      currentSeason,
      title,

      currentVideo: video,

      lastUpdated: Date.now()
    })
  );

  // ✅ MASTER CONTINUE WATCHING KEY
  if (isSeries) {
    const seriesKey = `continue_${user}_${title.split(" - ")[0]}`;

    localStorage.setItem(
      seriesKey,
      JSON.stringify({
        title: title.split(" - ")[0],
        currentSeason,
        currentVideo: video,
        currentTime: v.currentTime,
        duration: v.duration,
        lastUpdated: Date.now(),
        isSeries: true
      })
    );
  }
}}
        onLoadedMetadata={() => {
          const v = videoRef.current;
          setDuration(v.duration);
          const user = localStorage.getItem("user");
          if (!user) return;
          const key = isSeries
  ? `progress_${user}_${title.split(" - ")[0]}_season_${currentSeason}`
  : `progress_${user}_${video}`;
          const saved = localStorage.getItem(key);
          if (saved) {
            try {
              const data = JSON.parse(saved);
              if (data?.currentTime && data.currentTime < v.duration - 5) v.currentTime = data.currentTime;
            } catch {}
          }
        }}
        onClick={togglePlay}
      />

      <div style={{ ...topUI, opacity: showControls ? 1 : 0 }}>
        <div style={backAction} onClick={onClose}>←</div>
        <div style={reportIcon}>🏳</div>
      </div>
      <div style={progressArea}></div>
      <div style={{ ...bottomUI, opacity: showControls ? 1 : 0 }}>
        {/* ✅ SEASON SWITCHER */}
{isSeries && seasons && (
  <div
    style={{
      display: "flex",
      gap: "10px",
      marginBottom: "15px",
      flexWrap: "wrap"
    }}
  >
    {seasons.map((seasonObj) => (
      <button
        key={seasonObj.season}
        onClick={() => onSeasonChange(seasonObj)}
        style={{
          padding: "8px 16px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          background:
            currentSeason === seasonObj.season
              ? "#E50914"
              : "rgba(255,255,255,0.2)",
          color: "white"
        }}
      >
        Season {seasonObj.season}
      </button>
    ))}
  </div>
)}
        <div style={progressArea}>
          <div 
            ref={progressBarRef}
            style={barContainer} 
            onMouseMove={handleProgressHover}
            onMouseLeave={() => setHoverTime(null)}
            onClick={(e) => {
               const rect = progressBarRef.current.getBoundingClientRect();
               videoRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
            }}
          >
            {hoverTime !== null && (
              <div style={{ ...previewBubble, left: `${hoverX}px` }}>
                <div style={previewBox}>{formatTime(hoverTime)}</div>
                <div style={previewArrow} />
              </div>
            )}
            <div style={barBase}>
              <div style={{ ...barFill, width: `${progress}%` }}>
                <div style={scrubberCircle} />
              </div>
            </div>
          </div>
          <div style={timeStamp}>{formatTime(duration - currentTime)}</div>
        </div>

        <div style={controlsRow}>
          <div style={flexGroup}>
            <button style={largeBtn} onClick={togglePlay}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
            <button style={largeBtn} onClick={() => videoRef.current.currentTime -= 10}><div style={skipWrap}>↺<span style={skipNum}>10</span></div></button>
            <button style={largeBtn} onClick={() => videoRef.current.currentTime += 10}><div style={skipWrap}>↻<span style={skipNum}>10</span></div></button>
            <div className="vol-group" style={volumeWrapper}>
               <button style={mediumLargeBtn} onClick={() => {
                 const newVol = volume === 0 ? 1 : 0;
                 setVolume(newVol);
                 videoRef.current.volume = newVol;
               }}>{volume === 0 ? "🔇" : "🔊"}</button>
               <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => { setVolume(e.target.value); videoRef.current.volume = e.target.value; }} className="vol-slider" style={volumeSlider} />
            </div>
          </div>

          <div style={centerTitle}>
  {title
    ?.replace(/ - Season \d+/i, "")
    .toLowerCase()
    .split(" ")
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ")}

  {isSeries && currentSeason
    ? ` - Season ${currentSeason}`
    : ""}
</div>

          <div style={flexGroup}>
            <button style={largeBtn} onClick={handleDownload}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="white"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg>
            </button>
            <button style={syncedSpeedBox} onClick={() => {
              const speeds = [1, 1.25, 1.5, 2];
              const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
              videoRef.current.playbackRate = next;
              setPlaybackSpeed(next);
            }}>{playbackSpeed}x</button>
            <button style={largeBtn} onClick={() => !document.fullscreenElement ? containerRef.current.requestFullscreen() : document.exitFullscreen()}>
               <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .vol-group:hover .vol-slider { width: 100px !important; opacity: 1 !important; margin-left: 15px; }
        .vol-slider { width: 0; opacity: 0; transition: all 0.3s ease; accent-color: #E50914; cursor: pointer; }
        button { transition: transform 0.2s ease, opacity 0.2s !important; background: none; border: none; color: white; cursor: pointer; }
        button:hover { opacity: 0.8; transform: scale(1.1); }
        .mini-spinner { width: 50px; height: 50px; border: 5px solid rgba(229,9,20,0.2); border-top-color: #E50914; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* 🎨 NEW INTRO STYLES */
const introContainer = { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const brandName = { color: '#E50914', fontSize: '70px', fontWeight: '900', margin: '0', letterSpacing: '2px', fontFamily: 'Helvetica, Arial, sans-serif' };
const oneLinePopup = { color: 'white', marginTop: '15px', fontSize: '18px', fontWeight: '400', whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.1)', padding: '10px 30px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)' };

/* 🎨 REST OF STYLES */
const initialLoadingWrapper = { position: "fixed", inset: 0, backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100000 };
const loaderOverlay = { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)", zIndex: 50, pointerEvents: "none" };
const playerWrapper = { position: "fixed", inset: 0, background: "#000", zIndex: 99999, color: "white", fontFamily: "sans-serif", overflow: "hidden" };
const mainVideo = { width: "100%", height: "100%", objectFit: "contain" };
const topUI = { position: "absolute", top: 0, width: "100%", padding: "40px 60px", display: "flex", justifyContent: "space-between", background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)", transition: "0.4s" };
const backAction = { fontSize: "45px", cursor: "pointer" };
const reportIcon = { fontSize: "30px", cursor: "pointer" };
const bottomUI = { position: "absolute", bottom: 0, width: "100%", padding: "0 60px 40px 60px", background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)", transition: "0.4s", boxSizing: "border-box" };
const progressArea = { display: "flex", alignItems: "center", gap: "30px", marginBottom: "15px" };
const barContainer = { flex: 1, height: "24px", display: "flex", alignItems: "center", cursor: "pointer", position: "relative" };
const barBase = { width: "100%", height: "6px", background: "rgba(255,255,255,0.25)", borderRadius: "3px" };
const barFill = { height: "100%", background: "#E50914", position: "relative", borderRadius: "3px" };
const scrubberCircle = { position: "absolute", right: "-10px", top: "-7px", width: "20px", height: "20px", background: "#E50914", borderRadius: "50%" };
const timeStamp = { fontSize: "20px", minWidth: "100px", textAlign: "right", fontWeight: "bold" };
const previewBubble = { position: "absolute", bottom: "35px", transform: "translateX(-50%)", pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "center" };
const previewBox = { background: "#141414", padding: "8px 15px", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", border: "1px solid #444" };
const previewArrow = { width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid #141414" };
const controlsRow = { display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", height: "80px" };
const flexGroup = { display: "flex", alignItems: "center", gap: "5px" };
const centerTitle = { position: "absolute", left: "50%", transform: "translateX(-50%)", fontSize: "22px", fontWeight: "600", color: "#fff", pointerEvents: "none" };
const largeBtn = { width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center" };
const mediumLargeBtn = { ...largeBtn, width: "60px", height: "60px", fontSize: "32px" };
const syncedSpeedBox = { border: "1.5px solid rgba(255,255,255,0.9)", fontSize: "15px", fontWeight: "bold", width: "55px", height: "36px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10px" };
const volumeWrapper = { display: "flex", alignItems: "center" };
const volumeSlider = { height: "5px" };
const skipWrap = { position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "45px" };
const skipNum = { position: "absolute", fontSize: "12px", fontWeight: "900", paddingTop: "8px" };
const PlayIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>;
const PauseIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;