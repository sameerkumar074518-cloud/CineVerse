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
  const [showFilters, setShowFilters] = useState(false);

const genres = [
  "Action",
  "Romance",
  "Supernatural",
  "Crime",
  "Thriller",
  "Horror",
  "Sci-Fi",
  "Comedy",
  "Drama"
];
  const [showMenu, setShowMenu] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const navMenuRef = useRef(null);

  const filtered = movies
    .filter((m) => {
      const query = (search || "").toLowerCase();
      const matchesTitle = m?.title?.toLowerCase().includes(query);
      const matchesGenre = m?.genre?.toLowerCase().includes(query);
      return matchesTitle || matchesGenre;
    })
    .slice(0, 6);

  const highlightText = (text, query) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} style={{ color: "#E50914", fontWeight: "bold" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }

      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }

      if (navMenuRef.current && !navMenuRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToFooter = () => {
    const footer = document.getElementById("about-section");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openHelp = () =>
    setModalContent({
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

  const menuItemStyle = {
    padding: "12px 22px",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "800",
    transition: "0.25s ease"
  };

  return (
    <div style={navbarStyle}>

      {/* LEFT MENU + LOGO */}
      <div ref={navMenuRef} style={leftAreaStyle}>
        <button
          onClick={() => setShowSearch(false) || setShowMenu(false)}
          onMouseDown={(e) => {
            e.preventDefault();
            const nextState = !document.body.dataset.cineMenuOpen;
            document.body.dataset.cineMenuOpen = nextState ? "true" : "";
          }}
          className="cineHamburger"
style={hamburgerBtnStyle}
        >
          <span style={hamburgerLineStyle}></span>
          <span style={hamburgerLineStyle}></span>
          <span style={hamburgerLineStyle}></span>
        </button>

        <div style={logoBoxStyle}>
          <span style={logoTextStyle}>CineVerse</span>
        </div>

        <div
          className="cineSideMenu"
          style={sideMenuStyle}
        >
          <div
            style={menuItemStyle}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              document.body.dataset.cineMenuOpen = "";
            }}
          >
            Home
          </div>

          <div
            style={menuItemStyle}
            onClick={() => {
              onMoviesClick && onMoviesClick();
              document.body.dataset.cineMenuOpen = "";
            }}
          >
            Movies
          </div>

          <div
            style={menuItemStyle}
            onClick={() => {
              onSeriesClick && onSeriesClick();
              document.body.dataset.cineMenuOpen = "";
            }}
          >
            Series
          </div>

          <div
            style={menuItemStyle}
            onClick={() => {
              onMyListClick && onMyListClick();
              document.body.dataset.cineMenuOpen = "";
            }}
          >
            My List
          </div>

          <div
            style={menuItemStyle}
            onClick={() => {
              scrollToFooter();
              document.body.dataset.cineMenuOpen = "";
            }}
          >
            About
          </div>
        </div>
      </div>

      {/* CENTER SEARCH */}
      <div ref={searchRef} style={centerSearchWrapperStyle}>
        <div style={searchBarStyle}>
          <button
  onClick={() => setShowFilters(!showFilters)}
  style={filterBtnStyle}
>
  ⛛ Filter
</button>

          <input
            value={search || ""}
            onFocus={() => setShowSearch(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSearch(true);
            }}
            placeholder="Search..."
            style={searchInputStyle}
          />

          <span
  style={{
    ...searchIconStyle,
    cursor: "pointer"
  }}
  onClick={() => {
    setShowSearch(true);
  }}
>
  ⌕
</span>
        </div>

        {showFilters && (
  <div
    style={{
      position: "absolute",
      top: "56px",
      left: 0,
      width: "220px",
      background: "rgba(10,10,10,0.96)",
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 18px 45px rgba(0,0,0,0.85)",
      border: "1px solid rgba(255,255,255,0.08)",
      zIndex: 999999
    }}
  >

    <div
  onClick={() => {
    setSearch("");
    setShowSearch(false);
    setShowFilters(false);
  }}
  style={{
    padding: "14px 18px",
    cursor: "pointer",
    color: "#E50914",
    fontWeight: "bold",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  }}
>
  Reset Filter
</div>
    {genres.map((genre, i) => (
      <div
        key={i}
        onClick={() => {
          setSearch(genre);
          setShowSearch(true);
          setShowFilters(false);
        }}
        style={{
          padding: "14px 18px",
          cursor: "pointer",
          color: "white",
          borderBottom:
            i !== genres.length - 1
              ? "1px solid rgba(255,255,255,0.06)"
              : "none",
          transition: "0.2s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "rgba(255,255,255,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            "transparent";
        }}
      >
        {genre}
      </div>
    ))}
  </div>
)}

        {showSearch && search && (
          <div style={searchDropdownStyle}>
            {filtered.length > 0 ? (
              filtered.map((movie, i) => (
                <div
                  key={i}
                  style={searchResultStyle}
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
              <div style={{ padding: "12px", color: "#aaa" }}>
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div style={rightAreaStyle}>

        {/* CINEVOICE */}
        <div
          className="cineVoiceWrapper"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div className="cineVoiceTooltip">
            <div style={{ color: "#E50914",fontWeight: "900", marginBottom: "6px" }}>
              CineVoice
            </div>

            <div style={{ color: "#ddd", fontSize: "12px", lineHeight: "1.5" }}>
              Enable CineVoice and say:
              <br />

              <b style={{ color: "white" }}>
                “CineVerse, play any movie title”
              </b>

              <br />

              <span style={{ color: "#aaa" }}>or</span>

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

          {voiceEnabled && isListening && (
            <div
              style={{
                position: "absolute",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(229,9,20,0.28)",
                animation: "cinePulse 1.5s infinite"
              }}
            />
          )}

          <button
            onClick={onToggleVoice}
            style={{
              position: "relative",
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              border: voiceEnabled
  ? "1px solid rgba(229,9,20,0.9)"
                : "1px solid rgba(255,255,255,0.15)",
              background: voiceEnabled
  ? "linear-gradient(135deg,#E50914,#7a0000)"
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
        </div>

        {/* USER */}
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
              <div style={avatarBoxStyle}>
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
              <div style={profileDropdownStyle}>
                <div style={profileArrowStyle} />

                {profiles.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSwitchProfile(p);
                      setShowMenu(false);
                    }}
                    style={profileRowStyle}
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

                <div style={dividerStyle} />

                <div
                  onClick={() => {
                    setShowMenu(false);
                    onManageProfiles();
                  }}
                  style={profileRowStyle}
                >
                  <span style={{ fontSize: "20px" }}>✎</span>
                  <span>Manage Profiles</span>
                </div>

                <div
                  onClick={() => {
                    setShowMenu(false);
                    setShowAccount(true);
                  }}
                  style={profileRowStyle}
                >
                  <span style={{ fontSize: "20px" }}>👤</span>
                  <span>Account</span>
                </div>

                <div
                  onClick={() => {
                    setShowMenu(false);
                    openHelp();
                  }}
                  style={profileRowStyle}
                >
                  <span style={{ fontSize: "20px" }}>?</span>
                  <span>Help Centre</span>
                </div>

                <div style={dividerStyle} />

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

      <style>{`
      .cineHamburger:hover span {
  background: #E50914 !important;
  box-shadow:
    0 0 8px rgba(229,9,20,0.8),
    0 0 18px rgba(229,9,20,0.6);
}
        body[data-cine-menu-open="true"] .cineSideMenu {
          opacity: 1 !important;
          transform: translateY(0) !important;
          pointer-events: auto !important;
        }

        .cineSideMenu div:hover {
          background: rgba(255,255,255,0.12);
        }

        .cineVoiceTooltip {
          position: absolute;
          top: 52px;
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

        .cineVoiceWrapper:hover .cineVoiceTooltip {
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
  );
}

const navbarStyle = {
  height: "86px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 28px",
  backgroundColor: "rgba(0,0,0,0.96)",
  color: "white",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  boxSizing: "border-box",
  zIndex: 9999
};

const leftAreaStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  position: "relative",
  minWidth: "230px"
};

const hamburgerBtnStyle = {
  width: "36px",
  height: "32px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  padding: "4px"
};

const hamburgerLineStyle = {
  height: "2.5px",
  width: "22px",
  background: "white",
  borderRadius: "4px",
  display: "block",
  transition: "0.3s ease"
};

const logoBoxStyle = {
  background: "transparent",
  padding: "0",
  boxShadow: "none",
  border: "none"
};

const logoTextStyle = {
  color: "#E50914",
  fontSize: "24px",
  fontWeight: "900",
  fontFamily: "'Arial Black', sans-serif",
  letterSpacing: "-1px",
  transform: "scaleY(1.1)",
  display: "inline-block",
  lineHeight: 1
};

const sideMenuStyle = {
  position: "absolute",
  top: "58px",
  left: "0",
  width: "165px",
  background: "linear-gradient(180deg, rgba(229,9,20,0.96), rgba(120,0,0,0.96))",
  borderRadius: "6px",
  padding: "6px 0",
  opacity: 0,
  transform: "translateY(-10px)",
  pointerEvents: "none",
  transition: "0.25s ease",
  boxShadow: "0 18px 45px rgba(0,0,0,0.8)",
  overflow: "hidden"
};

const centerSearchWrapperStyle = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(560px, 42vw)"
};

const searchBarStyle = {
  height: "48px",
  width: "100%",
  background: "rgba(255,255,255,0.13)",
  borderRadius: "28px",
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  boxSizing: "border-box",
  border: "1px solid rgba(255,255,255,0.04)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)"
};

const filterBtnStyle = {
  height: "30px",
  padding: "0 16px",
  borderRadius: "18px",
  border: "none",
  background: "rgba(0,0,0,0.55)",
  color: "#bbb",
  fontSize: "13px",
  cursor: "pointer"
};

const searchInputStyle = {
  flex: 1,
  background: "transparent",
  border: "none",
  outline: "none",
  color: "white",
  fontSize: "15px",
  textAlign: "left",
paddingLeft: "150px",
paddingRight: "40px"
};

const searchIconStyle = {
  color: "white",
  fontSize: "25px",
  paddingRight: "6px"
};

const searchDropdownStyle = {
  position: "absolute",
  top: "56px",
  left: 0,
  right: 0,
  background: "rgba(10,10,10,0.96)",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 18px 45px rgba(0,0,0,0.85)",
  zIndex: 99999,
  border: "1px solid rgba(255,255,255,0.08)"
};

const searchResultStyle = {
  padding: "12px 16px",
  cursor: "pointer",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  color: "white"
};

const rightAreaStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  marginRight: "10px"
};

const avatarBoxStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "6px",
  background: "#d58a58",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900"
};

const profileDropdownStyle = {
  position: "absolute",
  right: 0,
  top: "58px",
  width: "260px",
  background: "rgba(0,0,0,0.92)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "white",
  zIndex: 99999,
  boxShadow: "0 8px 25px rgba(0,0,0,0.8)"
};

const profileArrowStyle = {
  position: "absolute",
  top: "-10px",
  right: "18px",
  width: 0,
  height: 0,
  borderLeft: "8px solid transparent",
  borderRight: "8px solid transparent",
  borderBottom: "10px solid rgba(0,0,0,0.92)"
};

const profileRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 15px",
  cursor: "pointer"
};

const dividerStyle = {
  height: "1px",
  background: "rgba(255,255,255,0.2)",
  margin: "8px 0"
};

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
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%"
};