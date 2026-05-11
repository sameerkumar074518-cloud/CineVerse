import { allMovies } from "./components/MovieRow";
import { popularSouthMovies } from "./components/SouthMovies";
import { allSeries } from "./components/SeriesRow";
import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Top10Row from "./components/Top10Row";
import MovieRow from "./components/MovieRow";
import SeriesRow from "./components/SeriesRow";
import ContinueWatching from "./components/ContinueWatching";
import VideoPlayer from "./components/VideoPlayer";
import Footer from "./components/Footer";
import ProfileSelect from "./components/ProfileSelect";

function App() {

const [selectedVideo, setSelectedVideo] = useState(null);
const [isSouthPlayer, setIsSouthPlayer] = useState(false); // ✅ ADDED

const [user, setUser] = useState("");
const [profile, setProfile] = useState(null);
const [search, setSearch] = useState("");
const myListRef = useRef(null);
const seriesRef = useRef(null);
const [movies, setMovies] = useState([]);
const [myList, setMyList] = useState([]);
const [showIntro, setShowIntro] = useState(true);
const [showEmptyMsg, setShowEmptyMsg] = useState(false);
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const API = "https://primeclone-2e4b.onrender.com";
/* ================== LOAD ================== */
useEffect(() => {
const savedUser = localStorage.getItem("user");
const token = localStorage.getItem("token");

if (savedUser) setUser(savedUser);
const savedProfile = localStorage.getItem("profile");

if (savedProfile) {
  setProfile(JSON.parse(savedProfile));
}

setMovies(allMovies);
setMyList([]);

if (token && profile) {
  fetch(`${API}/mylist?profileId=${profile?.id}`, {
    headers: { Authorization: token }
  })
    .then(res => res.json())
    .then(data => {
  if (!data.error) {
    const unique = data.filter(
      (item, index, self) =>
        index ===
self.findIndex(
  m =>
    m.movieId === item.movieId &&
    m.profileId === item.profileId
)
    );
    setMyList(unique);
  }
})
.catch(err => {
  console.log("My List fetch error:", err);
});
}

const timer = setTimeout(() => setShowIntro(false), 2000);
return () => clearTimeout(timer);
}, [profile?.id]);

/* ================== MY LIST ================== */
const handleAddToMyList = async (movie) => {
  const token = localStorage.getItem("token");

  if (!profile) {
  alert("Select profile first");
  return;
}

const listItem = {
  ...movie,
  profileId: profile.id,
    movieId: movie.movieId || movie.video || movie.seasons?.[0]?.video,
    video: movie.video || movie.seasons?.[0]?.video
  };

if (
  myList.find(
    m =>
      m.movieId === listItem.movieId &&
      m.profileId === profile.id
  )
) return;
  setMyList(prev => [listItem, ...prev]);

  if (token) {
    await fetch(`${API}/mylist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(listItem)
    });
  }
};

const handleRemoveFromMyList = async (id) => {
  console.log("Removing:", id);

  const token = localStorage.getItem("token");

  setMyList(prev =>
    prev.filter(
      m =>
        m.video !== id &&
        m._id !== id &&
        m.movieId !== id
    )
  );

  if (token) {
    await fetch(`${API}/mylist/${encodeURIComponent(id)}?profileId=${profile?.id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });
  }
};

/* ================== AUTH ================== */
const handleRegister = async () => {
if (!username || !password) {
  alert("Enter email/username & password");
  return;
}

const res = await fetch(`${API}/register`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
  username,
  email: username.includes("@") ? username : "",
  password
})
});

const data = await res.json();
console.log("LOGIN RESPONSE:", data);

if (res.ok) {
  alert("Registered successfully!");
} else {
  alert(data.error || "Error");
}
};

const handleLogin = async () => {
const res = await fetch(`${API}/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ username, password })
});

const data = await res.json();

if (!res.ok) {
  alert(data.error);
  return;
}

localStorage.setItem("token", data.token);
localStorage.setItem("user", data.username);

setUser(data.username);
setProfile(null);
localStorage.removeItem("profile");
};

const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("profile");

  setUser("");
  setProfile(null);
  setMyList([]);
};

/* ================== INTRO ================== */
/* ================== INTRO ================== */
if (showIntro) {
  return (
    <div style={introStyle}>
      <div style={introContainer}>
        <h1 className="netflix-text-anim" style={brandName}>Welcome to CineVerse</h1>
      </div>
      <style>{`
        @keyframes netflix-intro {
          0% { transform: scale(0.9); opacity: 0; letter-spacing: 10px; }
          100% { transform: scale(1); opacity: 1; letter-spacing: 2px; }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .netflix-text-anim {
          animation: netflix-intro 1.2s ease-out forwards;
          text-shadow: 0 0 20px rgba(229, 9, 20, 0.8);
        }
        .fade-in-text {
          animation: fade-up 1s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

/* ================== LOGIN ================== */
/* ================== LOGIN ================== */
/* ================== LOGIN ================== */
/* ================== LOGIN ================== */
if (!user) {
  return (
    <div className="login-wrapper" style={loginWrapperStyle}>
      <video autoPlay muted loop playsInline style={videoBackgroundStyle}>
        <source src="/movies/intro.mp4" type="video/mp4" />
      </video>

      <div style={overlayStyle}></div>
      
      <div style={logoContainerStyle}>
        <h1 style={{ color: '#E50914', fontSize: '45px', fontWeight: '900', margin: 0, fontFamily: 'Helvetica, Arial, sans-serif' }}>CINEVERSE</h1>
      </div>

      <div className="login-card" style={loginCardStyle}>
        <h1 style={{ alignSelf: 'flex-start', marginBottom: '28px', fontSize: '32px', fontFamily: 'Helvetica, Arial, sans-serif' }}>Sign In</h1>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Email or username"
          style={newInputStyle}
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          style={newInputStyle}
        />

        <button onClick={handleLogin} style={loginBtnStyle}>Sign In</button>
        
        <div style={helpRowStyle}>
          {/* Remember me removed as requested */}
          <span 
            onClick={() => alert("Sign In is for existing users. Sign Up is for new users.")} 
            style={{ fontSize: '13px', color: '#b3b3b3', cursor: 'pointer', marginLeft: 'auto' }}
          >
            Need help?
          </span>
        </div>

        <div style={footerSignupStyle}>
          <span style={{ color: '#737373' }}>New to CineVerse? </span>
          <span onClick={handleRegister} style={{ color: 'white', cursor: 'pointer', fontWeight: '500' }}>
             Sign up now
          </span>
        </div>
      </div>
    </div>
  );
}
if (user && !profile) {
  return (
    <ProfileSelect
      user={user}
      onSelectProfile={(selectedProfile) => {
  setMyList([]);

  localStorage.setItem(
    "profile",
    JSON.stringify(selectedProfile)
  );

  setProfile(selectedProfile);
}}
      onLogout={handleLogout}
    />
  );
}
/* ================== UPDATED FILTER (Title + Genre) ================== */
const searchTerm = search.toLowerCase();

/* ✅ COMBINED MOVIES + SERIES */
const filteredMovies = [...movies, ...allSeries].filter((m) => {
  const matchesTitle =
    m.title?.toLowerCase().includes(searchTerm);

  const matchesGenre =
    m.genre?.toLowerCase().includes(searchTerm);

  return matchesTitle || matchesGenre;
});

/* ================== MAIN ================== */
/* ================== MAIN ================== */
/* ================== MAIN ================== */
return (
<div style={{ background: "black", minHeight: "100vh" }}>

  <Navbar
  user={user}
  onLogout={handleLogout}
  search={search}
  setSearch={setSearch}
  movies={[...movies, ...allSeries]}

  onSelect={(v) => {
    setSelectedVideo(v);
    setIsSouthPlayer(false);
  }}

  profile={profile}

  profiles={
    JSON.parse(
      localStorage.getItem(`profiles_${user}`)
    ) || []
  }

  onSwitchProfile={(selectedProfile) => {
    setMyList([]);

    localStorage.setItem(
      "profile",
      JSON.stringify(selectedProfile)
    );

    setProfile(selectedProfile);
  }}

  onManageProfiles={() => {
  localStorage.removeItem("profile");
  setSelectedVideo(null);
  setSearch("");
  setMyList([]);
  setProfile(null);
}}

  onMoviesClick={() => {
    document.getElementById("movies-section")?.scrollIntoView({
      behavior: "smooth"
    });
  }}

  onSeriesClick={() =>
    seriesRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }

  onMyListClick={() => {
    if (myList.length === 0) {
      setShowEmptyMsg(true);

      setTimeout(() => {
        setShowEmptyMsg(false);
      }, 2000);

      return;
    }

    myListRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }}
/>

  <div style={{ paddingTop: "70px" }}>

    {/* 🔥 CONDITIONAL RENDERING: SEARCH MODE VS HOME MODE */}
    {search.length > 0 ? (
  <div className="search-mode-grid">
    <h2 style={{ color: "white", padding: "20px 4%" }}>
      Search results for "{search}"
    </h2>

    <MovieRow
      movies={filteredMovies}
      onSelect={(v) => {
        setSelectedVideo(v);
        setIsSouthPlayer(false);
      }}
      onAdd={handleAddToMyList}
      title=""
      showAdd={true}
    />

        <div
  ref={seriesRef}
  id="series-section"
  style={{
    scrollMarginTop: "120px",
    paddingTop: "10px"
  }}
>
</div>
      </div>
    ) : (
      <>
        <Hero onSelect={(v) => { setSelectedVideo(v); setIsSouthPlayer(false); }} />

        <ContinueWatching
  movies={[...movies, ...allSeries]}
  user={user}
  profile={profile}
  onSelect={(v) => {
    setSelectedVideo(v);
    setIsSouthPlayer(false);
  }}
/>

<div id="movies-section" style={{ scrollMarginTop: "90px" }}>
          <MovieRow
            movies={movies.filter((m) => {
  const searchTerm = search.toLowerCase();

  const matchesTitle =
    m.title?.toLowerCase().includes(searchTerm);

  const matchesGenre =
    m.genre?.toLowerCase().includes(searchTerm);

  return matchesTitle || matchesGenre;
})}
            onSelect={(v) => { setSelectedVideo(v); setIsSouthPlayer(false); }}
            onAdd={handleAddToMyList}
            title="Movies"
            showAdd={true}
          />
        </div>

        {/* ✅ SOUTH MOVIES */}
        <MovieRow
          movies={popularSouthMovies}
          onSelect={(v) => {
            setSelectedVideo(v);
            setIsSouthPlayer(true);
          }}
          title="🔥 Popular South Movies"
          showAdd={false}
        />

        <div
  ref={seriesRef}
  id="series-section"
  style={{ scrollMarginTop: "90px" }}
>
  <SeriesRow
    series={allSeries}
    onSelect={(videoData) => {
      setSelectedVideo(videoData);
      setIsSouthPlayer(false);
    }}
    onAdd={handleAddToMyList}
    title="Series"
  />
</div>

        {myList.length > 0 && (
          <div ref={myListRef} style={{ scrollMarginTop: "80px" }}>
            <MovieRow
  movies={myList}
  onSelect={(v) => { setSelectedVideo(v); setIsSouthPlayer(false); }}
  title="⭐️ My List"
  showAdd={false}
  isMyList={true}
  onRemove={handleRemoveFromMyList}
/>
          </div>
        )}

        <Top10Row
  movies={movies}
  onSelect={(v) => {
    setSelectedVideo(v);
    setIsSouthPlayer(false);
  }}
  onAdd={handleAddToMyList}
/>
      </>
    )}

  </div>

  {showEmptyMsg && (
    <div style={popupStyle}>
      ⚠️ My List is empty
    </div>
  )}

  <Footer />

  {selectedVideo && (
    isSouthPlayer ? (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "black",
        zIndex: 99999
      }}>
        <iframe
          width="100%"
          height="100%"
          src={selectedVideo}
          title="YouTube player"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        <div
          onClick={() => setSelectedVideo(null)}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "white",
            fontSize: "30px",
            cursor: "pointer",
            zIndex: 10
          }}
        >
          ✕
        </div>
      </div>
    ) : (
      <VideoPlayer
  video={
    typeof selectedVideo === "object"
      ? selectedVideo.video
      : selectedVideo
  }

  title={
    typeof selectedVideo === "object"
      ? selectedVideo.title
      : movies.find(m => m.video === selectedVideo)?.title
  }

  seasons={
    typeof selectedVideo === "object"
      ? selectedVideo.seasons
      : null
  }

  currentSeason={
    typeof selectedVideo === "object"
      ? selectedVideo.currentSeason
      : null
  }

  isSeries={
    typeof selectedVideo === "object"
      ? selectedVideo.isSeries
      : false
  }
  user={user}
profile={profile}

  onSeasonChange={(seasonObj) => {
    setSelectedVideo(prev => ({
      ...prev,
      video: seasonObj.video,
      currentSeason: seasonObj.season,
      title: `${prev.title.split(" - Season")[0]} - Season ${seasonObj.season}`
    }));
  }}

  onClose={() => setSelectedVideo(null)}
/>
    )
  )}

</div>
);
}

/* STYLES unchanged */
const popupStyle = {
position: "fixed",
top: "80px",
right: "20px",
background: "#111",
color: "white",
padding: "12px 20px",
borderRadius: "6px",
boxShadow: "0 5px 20px rgba(0,0,0,0.7)",
zIndex: 9999
};

const introStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "black",
  color: "white",
  overflow: "hidden"
};

const introContainer = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const brandName = {
  color: '#E50914', // Netflix Red
  fontSize: '80px',
  fontWeight: '900',
  margin: '0',
  textTransform: 'uppercase',
  fontFamily: 'Helvetica, Arial, sans-serif'
};

const brandQuote = {
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '20px',
  marginTop: '20px',
  fontStyle: 'italic',
  fontWeight: '300',
  letterSpacing: '1px'
};

const loginWrapperStyle = {
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  color: "white",
  overflow: "hidden" // Keeps video from creating scrollbars
};

const videoBackgroundStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transform: "translate(-50%, -50%)",
  zIndex: 0
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
  background: "rgba(0, 0, 0, 0.6)", // Slightly darker for better contrast with video
  zIndex: 1
};

// ... keep logoContainerStyle, loginCardStyle, newInputStyle, etc. exactly the same as before ...

const logoContainerStyle = {
  position: "absolute",
  top: "20px",
  left: "50px",
  zIndex: 10
};

const loginCardStyle = {
  position: "relative",
  zIndex: 10,
  background: "rgba(0, 0, 0, 0.75)",
  padding: "30px 40px", // Lowered top/bottom padding
  borderRadius: "4px",
  width: "100%",
  maxWidth: "360px", // Narrowed the card further
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box"
};

const newInputStyle = {
  width: "100%",
  height: "42px", // Slimmer inputs
  background: "#333",
  border: "none",
  borderRadius: "4px",
  color: "white",
  padding: "0 15px",
  marginBottom: "12px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box"
};

const loginBtnStyle = {
  width: "100%",
  padding: "10px", // Thinner button
  background: "#E50914",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "20px",
  boxSizing: "border-box"
};

const helpRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px",
  width: "100%"
};

const footerSignupStyle = {
  marginTop: "40px",
  fontSize: "16px",
  fontFamily: 'Helvetica, Arial, sans-serif'
};

export default App;