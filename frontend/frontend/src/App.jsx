import { allMovies } from "./components/MovieRow";
import { popularSouthMovies } from "./components/SouthMovies";
import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Top10Row from "./components/Top10Row";
import MovieRow from "./components/MovieRow";
import ContinueWatching from "./components/ContinueWatching";
import VideoPlayer from "./components/VideoPlayer";
import Footer from "./components/Footer";

function App() {

const [selectedVideo, setSelectedVideo] = useState(null);
const [isSouthPlayer, setIsSouthPlayer] = useState(false); // ✅ ADDED

const [user, setUser] = useState("");
const [search, setSearch] = useState("");
const [movies, setMovies] = useState([]);
const [myList, setMyList] = useState([]);
const [showIntro, setShowIntro] = useState(true);
const [showEmptyMsg, setShowEmptyMsg] = useState(false);
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const myListRef = useRef(null);

/* ================== LOAD ================== */
useEffect(() => {
const savedUser = localStorage.getItem("user");
const token = localStorage.getItem("token");

if (savedUser) setUser(savedUser);

setMovies(allMovies);

if (token) {
  fetch("http://localhost:5000/mylist", {
    headers: { Authorization: token }
  })
    .then(res => res.json())
    .then(data => {
      if (!data.error) {
        const unique = data.filter(
          (item, index, self) =>
            index === self.findIndex(m => m.movieId === item.movieId)
        );
        setMyList(unique);
      }
    });
}

const timer = setTimeout(() => setShowIntro(false), 2000);
return () => clearTimeout(timer);
}, []);

/* ================== MY LIST ================== */
const handleAddToMyList = async (movie) => {
const token = localStorage.getItem("token");

if (myList.find(m => m.video === movie.video)) return;

setMyList(prev => [movie, ...prev]);

if (token) {
  await fetch("http://localhost:5000/mylist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      movieId: movie._id,
      title: movie.title,
      image: movie.image,
      video: movie.video
    })
  });
}
};

const handleRemoveFromMyList = async (video) => {
const token = localStorage.getItem("token");

const movie = myList.find(m => m.video === video);

setMyList(prev => prev.filter(m => m.video !== video));

if (token && movie) {
  await fetch(`http://localhost:5000/mylist/${movie.movieId}`, {
    method: "DELETE",
    headers: { Authorization: token }
  });
}
};

/* ================== AUTH ================== */
const handleRegister = async () => {
if (!username || !password) {
  alert("Enter username & password");
  return;
}

const res = await fetch("http://localhost:5000/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ username, password })
});

const data = await res.json();

if (res.ok) {
  alert("Registered successfully!");
} else {
  alert(data.error || "Error");
}
};

const handleLogin = async () => {
const res = await fetch("http://localhost:5000/login", {
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
};

const handleLogout = () => {
localStorage.removeItem("user");
localStorage.removeItem("token");
setUser("");
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
if (!user) {
return (
  <div style={loginStyle}>
    <h1>Login</h1>

    <input
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Username"
      style={inputStyle}
    />

    <input
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      type="password"
      placeholder="Password"
      style={inputStyle}
    />

    <button onClick={handleLogin} style={btn}>Login</button>
    <button onClick={handleRegister} style={btnSecondary}>Register</button>
  </div>
);
}

/* ================== UPDATED FILTER (Title + Genre) ================== */
const filteredMovies = movies.filter(m => {
  const searchTerm = search.toLowerCase();
  
  const matchesTitle = m.title.toLowerCase().includes(searchTerm);
  
  // Checks if the movie has a genre AND if that genre matches the search
  const matchesGenre = m.genre && m.genre.toLowerCase().includes(searchTerm);

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
    movies={movies}
    onSelect={(v) => { setSelectedVideo(v); setIsSouthPlayer(false); }}
    onMoviesClick={() => {
      document.getElementById("movies-section")?.scrollIntoView({
        behavior: "smooth"
      });
    }}
    onMyListClick={() => {
      if (myList.length === 0) {
        setShowEmptyMsg(true);
        setTimeout(() => setShowEmptyMsg(false), 2000);
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
        {/* Only the Search Result title remains here */}
        <h2 style={{ color: "white", padding: "20px 4%" }}>Search results for "{search}"</h2>
        
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
      </div>
    ) : (
      <>
        <Hero onSelect={(v) => { setSelectedVideo(v); setIsSouthPlayer(false); }} />

        <ContinueWatching
          movies={movies}
          user={user}
          onSelect={(v) => { setSelectedVideo(v); setIsSouthPlayer(false); }}
        />

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

        <div id="movies-section" style={{ scrollMarginTop: "90px" }}>
          <MovieRow
            movies={filteredMovies}
            onSelect={(v) => { setSelectedVideo(v); setIsSouthPlayer(false); }}
            onAdd={handleAddToMyList}
            title="Movies"
            showAdd={true}
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

        <Top10Row movies={movies} onSelect={(v) => { setSelectedVideo(v); setIsSouthPlayer(false); }} />
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
        video={selectedVideo}
        title={movies.find(m => m.video === selectedVideo)?.title}
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

const loginStyle = {
height: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
background: "black",
color: "white",
flexDirection: "column",
gap: "15px"
};

const inputStyle = {
padding: "10px",
width: "220px"
};

const btn = {
padding: "10px 20px",
background: "#0f79af",
border: "none",
color: "white",
cursor: "pointer",
borderRadius: "5px"
};

const btnSecondary = {
...btn,
background: "gray"
};

export default App;