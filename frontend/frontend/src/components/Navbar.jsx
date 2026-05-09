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
onMyListClick
}) {

  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
          <p style={{ cursor: "pointer" }}>Home</p>

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
                      onSelect(movie.video);
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
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                background: "#0f79af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {user.charAt(0).toUpperCase()}
            </div>

            {showMenu && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "45px",
                background: "#111",
                padding: "10px",
                borderRadius: "5px",
                zIndex: 9999
              }}>
                <p style={{ margin: "5px 0" }}>{user}</p>

                <button
                  onClick={onLogout}
                  style={{
                    padding: "5px 10px",
                    background: "red",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    borderRadius: "4px"
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}