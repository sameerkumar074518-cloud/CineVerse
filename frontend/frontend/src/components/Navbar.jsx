import { useState, useRef, useEffect } from "react";

export default function Navbar({ 
  user, 
  onLogout, 
  search, 
  setSearch, 
  movies = [], 
  onSelect,
  onMoviesClick,
onSeriesClick,
onMyListClick,
profile,
profiles = [],
onSwitchProfile,
onManageProfiles,
voiceEnabled,
isListening,
onToggleVoice
}) {

  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  // ✅ FILTER
  // ✅ UPDATED FILTER (Check Title AND Genre)
  const filtered = movies
    .filter(m => {
      const query = (search || "").toLowerCase();
      const matchesTitle = m?.title?.toLowerCase().includes(query);
      const matchesGenre = m?.genre?.toLowerCase().includes(query); // ✅ Added this
      return matchesTitle || matchesGenre;
    })
    .slice(0, 6);

  // 🔥 HIGHLIGHT
  const highlightText = (text, query) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} style={{ color: "#e50914", fontWeight: "bold" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // 🔥 CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ ABOUT SCROLL FUNCTION
  const scrollToFooter = () => {
    const footer = document.getElementById("about-section");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };
  const openHelp = () => setModalContent({
  title: "CineVerse Help Centre",
  body: (
    <div style={{ lineHeight: "1.8" }}>
      <p><b>Search Bar:</b> Use the icon in the Navbar to find movies by title or genre instantly.</p>
      <p><b>Information:</b> Click any movie/series card to view a detailed synopsis and cast info.</p>
      <p><b>Downloads:</b> Use the download icon on the player to save movies for offline viewing.</p>
      <p><b>My List:</b> Click the '+' icon to save titles to your personalized collection.</p>

      <hr style={{ border: "0.5px solid #333", margin: "15px 0" }} />

      <p style={{ color: "#fff" }}><b>Need Technical Support?</b></p>
      <p>
        If you encounter any errors, bugs, or playback issues, please contact the developer directly.
        You can message me on <b>Instagram (@sameerxcuts) or mail me</b> for a quick resolution.
      </p>
    </div>
  )
});

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 35px",
      backgroundColor: "black",
      color: "white",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      boxSizing: "border-box",
      zIndex: 9999
    }}>
      
      {/* 🔴 LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        <h2 style={{ color: "red", margin: 0 }}>CineVerse</h2>

        <div style={{ display: "flex", gap: "15px" }}>
          <p
  onClick={() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }}
  style={{ cursor: "pointer" }}
>
  Home
</p>

          <p onClick={onMoviesClick} style={{ cursor: "pointer" }}>
            Movies
          </p>

          <p onClick={onSeriesClick} style={{ cursor: "pointer" }}>
  Series
</p>

          {/* ✅ MY LIST (MOVED AFTER SERIES) */}
          <p onClick={onMyListClick} style={{ cursor: "pointer" }}>
            My List
          </p>

          {/* ✅ ABOUT (NEW) */}
          <p onClick={scrollToFooter} style={{ cursor: "pointer" }}>
            About
          </p>
        </div>
      </div>

      {/* 🔵 RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginRight: "20px" }}>

        <div
  style={{
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>

  {/* ✅ PREMIUM HOVER POPUP */}
  <div className="cineVoiceTooltip">
    <div style={{ color: "#e50914", fontWeight: "800", marginBottom: "6px" }}>
      CineVoice
    </div>

    <div style={{ color: "#ddd", fontSize: "12px", lineHeight: "1.5" }}>
      Enable CineVoice and say:
<br />

<b style={{ color: "white" }}>
  “CineVerse, play any movie title”
</b>

<br />

<span style={{ color: "#aaa" }}>
  or
</span>

<br />

<b style={{ color: "white" }}>
  “Recommend me some action movies”
</b>

<br /><br />

<span style={{ color: "#aaa", fontSize: "12px" }}>
  Then say “play that movie” to start instantly.
</span>
    </div>
  </div>

  {/* PULSE EFFECT */}
  {voiceEnabled && isListening && (
    <div
      style={{
        position: "absolute",
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        background: "rgba(229,9,20,0.35)",
        animation: "cinePulse 1.5s infinite"
      }}
    />
  )}

  <button
    onClick={onToggleVoice}
    style={{
      position: "relative",
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      border: voiceEnabled
        ? "1px solid rgba(229,9,20,0.9)"
        : "1px solid rgba(255,255,255,0.15)",
      background: voiceEnabled
        ? "linear-gradient(135deg,#e50914,#b20710)"
        : "rgba(20,20,20,0.9)",
      color: "white",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "17px",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
      boxShadow: voiceEnabled
        ? "0 0 18px rgba(229,9,20,0.65)"
        : "0 4px 12px rgba(0,0,0,0.35)"
    }}
  >
    {voiceEnabled && isListening ? "🎙" : "🎤"}
  </button>

  <style>{`
    .cineVoiceTooltip {
      position: absolute;
      top: 48px;
      right: -15px;
      width: 240px;
      background: rgba(10,10,10,0.96);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 14px;
      opacity: 0;
      transform: translateY(-8px) scale(0.96);
      pointer-events: none;
      transition: all 0.25s ease;
      box-shadow: 0 18px 45px rgba(0,0,0,0.85);
      z-index: 999999;
    }

    div:hover > .cineVoiceTooltip {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    .cineVoiceTooltip::before {
      content: "";
      position: absolute;
      top: -7px;
      right: 28px;
      width: 12px;
      height: 12px;
      background: rgba(10,10,10,0.96);
      transform: rotate(45deg);
      border-left: 1px solid rgba(255,255,255,0.12);
      border-top: 1px solid rgba(255,255,255,0.12);
    }

    @keyframes cinePulse {
      0% {
        transform: scale(1);
        opacity: 0.7;
      }

      70% {
        transform: scale(1.7);
        opacity: 0;
      }

      100% {
        opacity: 0;
      }
    }
  `}</style>
</div>

        {/* 🔍 SEARCH */}
        <div ref={searchRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
          
          <span
            onClick={() => setShowSearch(!showSearch)}
            style={{ cursor: "pointer", fontSize: "18px", zIndex: 2 }}
          >
            🔍
          </span>

          <input
  value={search || ""}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Titles, genres"
  style={{
    width: showSearch ? "220px" : "0px",
    opacity: showSearch ? 1 : 0,
    marginLeft: showSearch ? "10px" : "0px",
    padding: showSearch ? "6px" : "0px",
    borderRadius: "4px",
    border: "none",
    outline: "none",
    background: "#111",
    color: "white",
    transition: "all 0.3s ease",
    overflow: "hidden"
  }}
/>

          {/* 🎯 DROPDOWN */}
          {showSearch && search && (
            <div style={{
              position: "absolute",
              top: "40px",
              right: 0,
              width: "240px",
              background: "#111",
              borderRadius: "6px",
              overflow: "hidden",
              boxShadow: "0 8px 20px rgba(0,0,0,0.8)",
              zIndex: 9999
            }}>
              {filtered.length > 0 ? (
                filtered.map((movie, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #222"
                    }}
                    onClick={() => {
  if (movie.seasons) {
    onSelect({
      video: movie.seasons[0].video,
      title: `${movie.title} - Season 1`,
      seasons: movie.seasons,
      currentSeason: 1,
      isSeries: true
    });
  } else {
    onSelect(movie.video);
  }

  setShowSearch(false);
}}
                  >
                    {highlightText(movie.title, search)}
                  </div>
                ))
              ) : (
                <div style={{ padding: "10px", color: "#aaa" }}>
                  No results found
                </div>
              )}
            </div>
          )}
        </div>

        {/* 👤 USER */}
        {user && (
          <div ref={menuRef} style={{ position: "relative" }}>
            
            <div
  onClick={() => setShowMenu(!showMenu)}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer"
  }}
>
  <div
    style={{
      width: "36px",
      height: "36px",
      borderRadius: "4px",
      background: "#0f79af",
      overflow: "hidden"
    }}
  >
    {profile?.avatar ? (
      <img
        src={profile.avatar}
        alt={profile.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />
    ) : (
      user.charAt(0).toUpperCase()
    )}
  </div>

  <span
    style={{
      color: "white",
      fontSize: "12px",
      transform: showMenu ? "rotate(180deg)" : "rotate(0deg)",
      transition: "0.2s"
    }}
  >
    ▼
  </span>
</div>

            {showMenu && (
  <div
    style={{
      position: "absolute",
      right: 0,
      top: "50px",
      width: "260px",
      background: "rgba(0,0,0,0.92)",
      border: "1px solid rgba(255,255,255,0.2)",
      color: "white",
      zIndex: 99999,
      boxShadow: "0 8px 25px rgba(0,0,0,0.8)"
    }}
  >

    <div
      style={{
        position: "absolute",
        top: "-10px",
        right: "18px",
        width: 0,
        height: 0,
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
        borderBottom: "10px solid rgba(0,0,0,0.92)"
      }}
    />

    {profiles.map((p) => (
      <div
        key={p.id}
        onClick={() => {
          onSwitchProfile(p);
          setShowMenu(false);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 15px",
          cursor: "pointer"
        }}
      >
        <img
          src={p.avatar}
          alt={p.name}
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "4px",
            objectFit: "cover"
          }}
        />

        <span>{p.name}</span>
      </div>
    ))}

    <div
      style={{
        height: "1px",
        background: "rgba(255,255,255,0.2)",
        margin: "8px 0"
      }}
    />

    <div
      onClick={() => {
  setShowMenu(false);
  onManageProfiles();
}}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 15px",
        cursor: "pointer"
      }}
    >
      <span style={{ fontSize: "20px" }}>✎</span>
      <span>Manage Profiles</span>
    </div>

    <div
  onClick={() => {
    setShowMenu(false);
    setShowAccount(true);
  }}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 15px",
    cursor: "pointer"
  }}
>
  <span style={{ fontSize: "20px" }}>👤</span>
  <span>Account</span>
</div>

   <div
  onClick={() => {
  setShowMenu(false);
  openHelp();
}}

  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 15px",
    cursor: "pointer"
  }}
>
  <span style={{ fontSize: "20px" }}>?</span>
  <span>Help Centre</span>
</div>

    <div
      style={{
        height: "1px",
        background: "rgba(255,255,255,0.2)",
        margin: "8px 0"
      }}
    />

    <div
      onClick={onLogout}
      style={{
        textAlign: "center",
        padding: "12px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Sign out of CineVerse
    </div>
  </div>
)}
          </div>
        )}

      </div>
      {modalContent && (
  <div style={modalOverlay} onClick={() => setModalContent(null)}>
    <div style={modalBox} onClick={(e) => e.stopPropagation()}>
      <h3 style={{ color: "#E50914", marginBottom: "15px" }}>
        {modalContent.title}
      </h3>

      <div style={{ color: "#ccc", fontSize: "13px" }}>
        {modalContent.body}
      </div>

      <button style={modalCloseBtn} onClick={() => setModalContent(null)}>
        Close
      </button>
    </div>
  </div>
)}
          {showAccount && (
        <div style={accountOverlayStyle}>
          <div style={accountBoxStyle}>
            <button
              onClick={() => setShowAccount(false)}
              style={accountCloseStyle}
            >
              ✕
            </button>

            <h1 style={accountTitleStyle}>Account</h1>

            <div style={accountInfoStyle}>
              <p><b>Email:</b> {user}</p>

<p><b>Plan:</b> CineVerse Premium</p>

<p><b>Profiles:</b> {profiles.length}/5</p>

<p><b>Current Profile:</b> {profile?.name}</p>

<p><b>Streaming:</b> Full HD • Ad-Free</p>

<p><b>Status:</b> Active</p>
            </div>

            <h2 style={profileSectionTitleStyle}>
  Profiles
</h2>

<div style={accountProfilesStyle}>
  {profiles.map((p) => (
    <div key={p.id} style={accountProfileCardStyle}>
      
      <img
        src={p.avatar}
        alt={p.name}
        style={accountAvatarStyle}
      />

      <div>
        <h3 style={{ margin: "0 0 5px" }}>
          {p.name}
        </h3>

        <p
          style={{
            margin: 0,
            color: "#aaa",
            fontSize: "13px"
          }}
        >
          Personal Profile
        </p>
      </div>
    </div>
  ))}

  <p
    style={{
      color: "#888",
      fontSize: "13px",
      marginTop: "10px",
      textAlign: "center"
    }}
  >
    Profiles keep watch history and recommendations separate.
  </p>
</div>
          </div>
        </div>
      )}
    </div>
  );
}
const accountOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  zIndex: 100000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const accountBoxStyle = {
  width: "480px",
  maxWidth: "92vw",
  background: "#181818",
  color: "white",
  borderRadius: "10px",
  padding: "22px",
  position: "relative",
  boxShadow: "0 20px 60px rgba(0,0,0,0.9)"
};

const accountCloseStyle = {
  position: "absolute",
  top: "18px",
  right: "18px",
  background: "#333",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "34px",
  height: "34px",
  cursor: "pointer",
  fontSize: "18px"
};

const accountTitleStyle = {
  margin: "0 0 20px",
  fontSize: "26px"
};

const accountInfoStyle = {
  background: "#222",
  padding: "14px",
  borderRadius: "8px",
  lineHeight: "1.7",
  marginBottom: "25px"
};

const profileSectionTitleStyle = {
  fontSize: "24px",
  marginBottom: "15px"
};

const accountProfilesStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "14px"
};

const accountProfileCardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  background: "#242424",
  padding: "10px",
  borderRadius: "8px"
};

const accountAvatarStyle = {
  width: "44px",
height: "44px",
  borderRadius: "6px",
  objectFit: "cover"
};

const accountDeleteStyle = {
  marginLeft: "auto",
  padding: "8px 12px",
  background: "#e50914",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold"
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.95)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100000,
  pointerEvents: "auto"
};

const modalBox = {
  background: "#111",
  padding: "40px",
  borderRadius: "4px",
  maxWidth: "500px",
  width: "90%",
  textAlign: "left",
  border: "1px solid #222",
  maxHeight: "80vh",
  overflowY: "auto"
};

const modalCloseBtn = {
  marginTop: "25px",
  background: "#E50914",
  color: "#fff",
  border: "none",
  padding: "12px 25px",
  borderRadius: "2px",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%"
};