import {
  auth,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "./firebase";
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
import NetflixPremiumPlayer from "./components/VideoPlayer";
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
const [topMovies, setTopMovies] = useState([]);
const [myList, setMyList] = useState([]);
const [recommended, setRecommended] = useState([]);
const [becauseWatched, setBecauseWatched] = useState([]);
const [becauseTitle, setBecauseTitle] = useState("");
const [selectedGenre, setSelectedGenre] = useState("All");
const [showIntro, setShowIntro] = useState(true);
const [showEmptyMsg, setShowEmptyMsg] = useState(false);
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [phone, setPhone] = useState("");
const [otp, setOtp] = useState("");
const [confirmationResult, setConfirmationResult] = useState(null);
const [showPhoneNotice, setShowPhoneNotice] = useState(true);
const [showForgot, setShowForgot] = useState(false);
const [resetLogin, setResetLogin] = useState("");
const [resetCode, setResetCode] = useState("");
const [newPassword, setNewPassword] = useState("");
const [voiceEnabled, setVoiceEnabled] = useState(false);
const [isListening, setIsListening] = useState(false);
const [lastRecommendedMovie, setLastRecommendedMovie] = useState(null);
const recognitionRef = useRef(null);
const hasWelcomedRef = useRef(false);

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
fetch(`${API}/top10`)
  .then(res => res.json())
  .then(data => {
    const merged = data
      .map(item => {
        const fullMovie = allMovies.find(
          m =>
            m.video === item.video ||
            m._id === item.movieId
        );

        return fullMovie
          ? {
              ...fullMovie,
              watchCount: item.watchCount
            }
          : null;
      })
      .filter(Boolean);
      const uniqueTopMovies = merged.filter(
  (movie, index, self) =>
    index === self.findIndex(m => m.video === movie.video)
);

    setTopMovies(
  uniqueTopMovies.length > 0
    ? uniqueTopMovies
    : allMovies
);
  })
  .catch(() => {
    setTopMovies(allMovies);
  });
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

  const itemToRemove = myList.find(
    m =>
      m.movieId === id ||
      m.video === id ||
      m._id === id
  );

  if (!itemToRemove) {
    console.log("Item not found in state");
    return;
  }

  setMyList(prev =>
    prev.filter(m => m._id !== itemToRemove._id)
  );

  if (token) {
    await fetch(`${API}/mylist/${itemToRemove._id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });
  }
};

/* ================== AUTH ================== */
const handleRegister = async () => {
if (!username.includes("@") || !password) {
  alert("Enter valid email & password");
  return;
}

const res = await fetch(`${API}/register`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
  email: username,
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

const handleForgotPassword = async () => {
  try {
    if (!resetLogin) {
      alert("Enter registered email");
      return;
    }

    console.log("Sending reset request to:", `${API}/forgot-password`);
    console.log("Email:", resetLogin);

    const res = await fetch(`${API}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ login: resetLogin })
    });

    const data = await res.json();
    console.log("Forgot password response:", data);

    if (res.ok) {
      alert("Reset code sent to your email");
    } else {
      alert(data.error || "Error sending reset code");
    }
  } catch (err) {
    console.log("Forgot password frontend error:", err);
    alert("Something went wrong. Check console.");
  }
};

const handleResetPassword = async () => {
  const res = await fetch(`${API}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      login: resetLogin,
      code: resetCode,
      newPassword
    })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Password reset successfully!");
    setShowForgot(false);
    setResetLogin("");
    setResetCode("");
    setNewPassword("");
  } else {
    alert(data.error || "Error resetting password");
  }
};

const sendOTP = async () => {
  try {
    if (!phone) {
      alert("Enter phone number");
      return;
    }

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }

    const result = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );

    setConfirmationResult(result);
    alert("OTP sent!");
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

const verifyOTP = async () => {
  try {
    if (!confirmationResult) {
      alert("Send OTP first");
      return;
    }

    await confirmationResult.confirm(otp);

    localStorage.setItem("user", phone);
    localStorage.setItem("token", "phone-login");

    setUser(phone);
    setProfile(null);
    localStorage.removeItem("profile");

    alert("Phone login successful!");
  } catch (err) {
    console.log(err);
    alert("Wrong OTP");
  }
};

const handleLogout = () => {

  // ✅ STOP CINEVOICE
  if (recognitionRef.current) {
  recognitionRef.current.stop();
  recognitionRef.current = null;
}

  setVoiceEnabled(false);
  setIsListening(false);

  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("profile");

  setUser("");
  setProfile(null);
  setMyList([]);
};



const speakAndPlay = (movie) => {
  const speak = new SpeechSynthesisUtterance(`Playing ${movie.title}`);
  speak.lang = "en-IN";
  const voices = window.speechSynthesis.getVoices();

const premiumVoice =
  voices.find(v =>
    v.name.includes("Google UK English Female")
  ) ||
  voices.find(v =>
    v.name.includes("Microsoft Natasha")
  ) ||
  voices.find(v =>
    v.name.includes("Samantha")
  ) ||
  voices[0];

speak.voice = premiumVoice;
  speak.rate = 0.95;
  speak.pitch = 1;
  speak.volume = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speak);

  const movieGenres =
  movie.genre ||
  [...movies, ...allSeries].find(
    m => m.title === movie.title
  )?.genre;

localStorage.setItem(
  `last_watched_${user}_${profile?.id}`,
  JSON.stringify({
    ...movie,
    genre: movieGenres,
    video:
      movie.video ||
      movie.movieId ||
      movie.seasons?.[0]?.video
  })
);

setBecauseTitle(movie.title);

const similarMovies =
  [...movies, ...allSeries]
    .filter(m => m.title !== movie.title)
    .filter(m =>
      m.genre
        ?.toLowerCase()
        .includes(
          movieGenres
            ?.split(",")[0]
            ?.trim()
            ?.toLowerCase()
        )
    )
    .slice(0, 12);

setBecauseWatched(similarMovies);
const recKey = `recommend_${user}_${profile.id}`;

const oldHistory =
  JSON.parse(localStorage.getItem(recKey)) || [];

const updatedHistory = [
  movie,
  ...oldHistory.filter(
    m => m.title !== movie.title
  )
].slice(0, 20);

localStorage.setItem(
  recKey,
  JSON.stringify(updatedHistory)
);

  setTimeout(() => {
    // STOP LISTENING DURING MOVIE
if (recognitionRef.current) {
  recognitionRef.current.stop();
  recognitionRef.current = null;
}

setIsListening(false);
    setSelectedVideo({
      ...movie,
      video: movie.video || movie.movieId || movie.seasons?.[0]?.video,
      currentSeason: movie.currentSeason || movie.seasons?.[0]?.season || 1,
      isSeries: !!movie.seasons
    });

    setIsSouthPlayer(false);
  }, 900);
};

const speakCineVoiceWelcome = () => {
  const welcomeVoice = new SpeechSynthesisUtterance(
`Hello, I am your CineVerse AI assistant. Welcome back to CineVerse. Relax, enjoy your entertainment, and simply say any movie you would like to watch.`  );

  welcomeVoice.lang = "en-IN";

  const voices = window.speechSynthesis.getVoices();

  const premiumVoice =
    voices.find(v => v.name.includes("Google UK English Female")) ||
    voices.find(v => v.name.includes("Microsoft Natasha")) ||
    voices.find(v => v.name.includes("Samantha")) ||
    voices[0];

  welcomeVoice.voice = premiumVoice;
  welcomeVoice.rate = 0.9;
welcomeVoice.pitch = 1.08;
welcomeVoice.volume = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(welcomeVoice);
};

const startCineVoice = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("CineVoice works best in Chrome or Edge.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-IN";

  recognitionRef.current = recognition;
  setVoiceEnabled(true);
  setIsListening(true);

  recognition.start();

  recognition.onresult = (event) => {
    const lastResult = event.results[event.results.length - 1];
    const command = lastResult[0].transcript.toLowerCase();

    console.log("FREE CINEVOICE HEARD:", command);

    handleVoiceCommand(command);
  };

  recognition.onend = () => {

  setIsListening(false);

  // SOFT RESTART
  if (voiceEnabled && !selectedVideo) {

    recognitionRef.current = null;

    setTimeout(() => {

      if (voiceEnabled) {
        startCineVoice();
      }

    }, 1200);
  }
};

  recognition.onerror = (err) => {
    console.log("CineVoice error:", err);

    if (err.error === "not-allowed") {
      alert("Microphone permission blocked.");
      setVoiceEnabled(false);
      recognitionRef.current = null;
    }
  };
};

const handleVoiceCommand = (command) => {

  const cleanText = (text) =>
    text
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/cineverse/g, "")
      .replace(/alexa/g, "")
      .replace(/hey/g, "")
      .replace(/play/g, "")
      .replace(/movie/g, "")
      .replace(/film/g, "")
      .replace(/the/g, "")
      .replace(/ki/g, "")
.replace(/ka/g, "")
.replace(/last/g, "")
.replace(/rites/g, "")
.replace(/ghazab/g, "")
.replace(/kahani/g, "")
      .replace(/[^a-zA-Z0-9\u0900-\u097F ]/g, "")
      .trim();

  const cleanedCommand = cleanText(command);
  const genres = [
  "action",
  "love",
  "romance",
  "thriller",
  "horror",
  "comedy",
  "drama",
  "crime",
  "sci-fi",
  "adventure",
  "mystery",
  "fantasy",
  "family",
  "animation"
];

// 🎬 AI RECOMMENDATIONS
const askedForRecommendation =
  cleanedCommand.includes("recommend") ||
  cleanedCommand.includes("suggest");

if (askedForRecommendation) {

  const detectedGenre = genres.find((genre) =>
    cleanedCommand.includes(genre)
  );

  if (detectedGenre) {

    const genreMovies = [
      ...movies,
      ...allSeries
    ].filter((item) =>
      item.genre
        ?.toLowerCase()
        .includes(detectedGenre)
    );

    if (genreMovies.length > 0) {

      const shuffled = [...genreMovies]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const firstMovie = shuffled[0];

      setLastRecommendedMovie(firstMovie);

      const movieNames = shuffled
        .map((m) => m.title)
        .join(", ");

      const aiVoice =
        new SpeechSynthesisUtterance(
          `I recommend ${movieNames}. Say play ${firstMovie.title} to start watching.`
        );

      aiVoice.lang = "en-IN";
      const voices = window.speechSynthesis.getVoices();

const premiumVoice =
  voices.find(v =>
    v.name.includes("Google UK English Female")
  ) ||
  voices.find(v =>
    v.name.includes("Microsoft Natasha")
  ) ||
  voices.find(v =>
    v.name.includes("Samantha")
  ) ||
  voices[0];

aiVoice.voice = premiumVoice;
      aiVoice.rate = 1;
      aiVoice.pitch = 1;

      window.speechSynthesis.cancel();

      aiVoice.onend = () => {

        if (voiceEnabled && !selectedVideo) {

          setTimeout(() => {
            startCineVoice();
          }, 300);
        }
      };

      window.speechSynthesis.speak(aiVoice);

      return;
    }
  }

  const noGenreVoice =
    new SpeechSynthesisUtterance(
      "Please mention a genre like action, comedy, horror, romance, or thriller."
    );

  noGenreVoice.lang = "en-IN";

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(noGenreVoice);

  return;
}

  const allContent = [
    ...movies,
    ...allMovies,
    ...allSeries,
    ...topMovies,
    ...popularSouthMovies,
    ...myList,
    ...recommended
  ];

  const uniqueContent = allContent.filter(
    (item, index, self) =>
      item?.title &&
      index ===
        self.findIndex(
          (m) => m?.title === item.title
        )
  );

  const getSimilarity = (a, b) => {
    const wordsA = cleanText(a)
      .split(" ")
      .filter(Boolean);

    const wordsB = cleanText(b)
      .split(" ")
      .filter(Boolean);

    let matched = 0;

    wordsA.forEach((word) => {
      if (
        wordsB.some(
          (w) =>
            w.includes(word) ||
            word.includes(w)
        )
      ) {
        matched++;
      }
    });

    return (
      matched /
      Math.max(
        wordsA.length,
        wordsB.length
      )
    );
  };

  if (
  cleanedCommand.includes("play that") ||
  cleanedCommand.includes("play this") ||
  cleanedCommand.includes("play recommended")
) {

  if (lastRecommendedMovie) {
    speakAndPlay(lastRecommendedMovie);
    return;
  }
}

  let bestMatch = null;
  let bestScore = 0;

  uniqueContent.forEach((movie) => {
    const score = getSimilarity(
      cleanedCommand,
      movie.title
    );

    if (score > bestScore) {
      bestScore = score;
      bestMatch = movie;
    }
  });

  console.log(
  "BEST CINEVOICE MATCH:",
  bestMatch,
  bestScore
);

  if (bestMatch && bestScore > 0.25) {
    speakAndPlay(bestMatch);

  } else {

    const notFoundVoice =
  new SpeechSynthesisUtterance(
    "Sorry, I could not recognize that movie. Please say it again."
  );

notFoundVoice.lang = "en-IN";
const voices = window.speechSynthesis.getVoices();

const premiumVoice =
  voices.find(v =>
    v.name.includes("Google UK English Female")
  ) ||
  voices.find(v =>
    v.name.includes("Microsoft Natasha")
  ) ||
  voices.find(v =>
    v.name.includes("Samantha")
  ) ||
  voices[0];

notFoundVoice.voice = premiumVoice;
notFoundVoice.rate = 1.05;
notFoundVoice.pitch = 1;

window.speechSynthesis.cancel();

notFoundVoice.onend = () => {

  // QUICK RESTART
  if (voiceEnabled && !selectedVideo) {

    setTimeout(() => {
      startCineVoice();
    }, 250);
  }
};

window.speechSynthesis.speak(
  notFoundVoice
);
  }
};

useEffect(() => {
  if (!user || !profile) return;

  const recKey = `recommend_${user}_${profile?.id}`;
  const history = JSON.parse(localStorage.getItem(recKey)) || [];

  const genres = history
    .flatMap(item => item.genre?.split(",") || [])
    .map(g => g.trim().toLowerCase())
    .filter(Boolean);

  const recommendedContent = [...movies, ...allSeries]
    .filter(item => {
      const itemGenres = item.genre
        ?.split(",")
        .map(g => g.trim().toLowerCase()) || [];

      return itemGenres.some(g => genres.includes(g));
    })
    .filter(item => !history.some(h => h.video === item.video));

  setRecommended(recommendedContent.slice(0, 12));
}, [user, profile, movies, selectedVideo]);

useEffect(() => {
  if (!user || !profile) return;

  const saved = localStorage.getItem(`last_watched_${user}_${profile.id}`);
  if (!saved) return;

  const lastMovie = JSON.parse(saved);

  setBecauseTitle(lastMovie.title);

  const lastGenres =
    lastMovie.genre
      ?.split(",")
      .map(g => g.trim().toLowerCase()) || [];

  const similar = [...movies, ...allSeries]
    .filter(item => item.title !== lastMovie.title)
    .filter(item => {

      const itemGenres =
        item.genre
          ?.split(",")
          .map(g => g.trim().toLowerCase()) || [];

      return itemGenres.some(g =>
        lastGenres.includes(g)
      );
    })
    .slice(0, 12);

  setBecauseWatched(similar);

}, [user, profile, movies, selectedVideo]);

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

      {showPhoneNotice && (
  <div style={phoneNoticeStyle}>
    <button
      onClick={() => setShowPhoneNotice(false)}
      style={phoneNoticeCloseStyle}
    >
      ✕
    </button>

    <h3 style={{ color: "#e50914", marginTop: 0 }}>
      Phone OTP Login Coming Soon
    </h3>

    <p style={{ color: "#ddd", fontSize: "14px", lineHeight: "1.6" }}>
      For now, please sign in using your <b>Email and Password</b>.
      Phone number OTP login is currently not enabled because the SMS billing
      process is not active yet.
    </p>

    <p style={{ color: "#aaa", fontSize: "13px", lineHeight: "1.6" }}>
      Once phone login is enabled, CineVerse will notify users by email.
    </p>
  </div>
)}
{showForgot && (
  <div style={forgotOverlayStyle}>
    <div style={forgotBoxStyle}>
      <button
        onClick={() => setShowForgot(false)}
        style={forgotCloseStyle}
      >
        ✕
      </button>

      <h2 style={{ color: "#e50914", marginTop: 0 }}>
        Reset Password
      </h2>

      <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.5" }}>
        Enter your email. CineVerse will send a reset code to your registered email.
      </p>
      <input
        value={resetLogin}
        onChange={(e) => setResetLogin(e.target.value)}
        placeholder="Registered email"
        style={newInputStyle}
      />

      <button onClick={handleForgotPassword} style={loginBtnStyle}>
        Send Reset Code
      </button>

      <input
        value={resetCode}
        onChange={(e) => setResetCode(e.target.value)}
        placeholder="Enter reset code"
        style={{ ...newInputStyle, marginTop: "18px" }}
      />

      <input
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        type="password"
        placeholder="New password"
        style={newInputStyle}
      />

      <button onClick={handleResetPassword} style={loginBtnStyle}>
        Reset Password
      </button>
    </div>
  </div>
)}

      <div className="login-card" style={loginCardStyle}>
        <h1 style={{ alignSelf: 'flex-start', marginBottom: '28px', fontSize: '32px', fontFamily: 'Helvetica, Arial, sans-serif' }}>Sign In</h1>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Email address"
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
        <div style={orStyle}>OR</div>

<input
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="Phone number with country code"
  style={newInputStyle}
/>

<button
  onClick={sendOTP}
  style={{
    ...loginBtnStyle,
    background: "#E50914"
  }}
>
  Send OTP
</button>

{confirmationResult && (
  <>
    <input
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      placeholder="Enter OTP"
      style={newInputStyle}
    />

    <button onClick={verifyOTP} style={loginBtnStyle}>
      Verify OTP
    </button>
  </>
)}

<div id="recaptcha-container"></div>
        
        <div style={helpRowStyle}>
          {/* Remember me removed as requested */}
          <span 
            onClick={() => setShowForgot(true)}
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

const genreFilteredMovies =
  selectedGenre === "All"
    ? movies
    : movies.filter(movie =>
        movie.genre
          ?.toLowerCase()
          .includes(selectedGenre.toLowerCase())
      );

const genreFilteredSeries =
  selectedGenre === "All"
    ? allSeries
    : allSeries.filter(series =>
        series.genre
          ?.toLowerCase()
          .includes(selectedGenre.toLowerCase())
      );

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

{voiceEnabled && (
  <div style={cineVoiceBadgeStyle}>
    {isListening ? "🎙 CineVoice Listening" : "CineVoice Paused"}
  </div>
)}
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

voiceEnabled={voiceEnabled}
isListening={isListening}

onToggleVoice={() => {

  // TURN OFF
  if (voiceEnabled) {

    setVoiceEnabled(false);
    setIsListening(false);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    window.speechSynthesis.cancel();

    return;
  }

 // TURN ON
if (!hasWelcomedRef.current) {

  hasWelcomedRef.current = true;

  speakCineVoiceWelcome();

  setTimeout(() => {
    startCineVoice();
  }, 4500);

} else {

  startCineVoice();
}
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
        <Hero
  onSelect={(v) => {
    setSelectedVideo(v);
    setIsSouthPlayer(false);
  }}
  onAdd={handleAddToMyList}
/>

<div
  style={{
    display: "flex",
    gap: "12px",
    padding: "18px 4%",
    overflowX: "auto"
  }}
>
  {[
    "All",
    "Action",
    "Romance",
    "Thriller",
    "Horror",
    "Sci-Fi",
    "Comedy",
    "Drama"
  ].map((genre) => (
    <button
      key={genre}
      onClick={() => setSelectedGenre(genre)}
      style={{
        padding: "10px 18px",
        borderRadius: "30px",
        border: "none",
        cursor: "pointer",
        whiteSpace: "nowrap",
        background:
          selectedGenre === genre
            ? "#e50914"
            : "rgba(255,255,255,0.1)",
        color: "white",
        fontWeight: "600",
        fontSize: "14px",
        transition: "0.25s ease"
      }}
    >
      {genre}
    </button>
  ))}
</div>

<div id="movies-section" style={{ scrollMarginTop: "90px" }}>
          <MovieRow
            movies={genreFilteredMovies.filter((m) => {
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

        <div
  ref={seriesRef}
  id="series-section"
  style={{ scrollMarginTop: "90px" }}
>
  <SeriesRow
    series={genreFilteredSeries}
    onSelect={(videoData) => {
      setSelectedVideo(videoData);
      setIsSouthPlayer(false);
    }}
    onAdd={handleAddToMyList}
    title="Series"
  />
</div>


        <ContinueWatching
  movies={[...movies, ...allSeries]}
  user={user}
  profile={profile}
  onSelect={(v) => {
    setSelectedVideo(v);
    setIsSouthPlayer(false);
  }}
/>

{becauseWatched.length > 0 && (
  <MovieRow
    movies={becauseWatched}
    onSelect={(v) => {
      setSelectedVideo(v);
      setIsSouthPlayer(false);
    }}
    onAdd={handleAddToMyList}
    title={`Because you watched ${becauseTitle}`}
    showAdd={true}
  />
)}

{recommended.length > 0 && (
  <MovieRow
    movies={recommended}
    onSelect={(v) => {
      setSelectedVideo(v);
      setIsSouthPlayer(false);
    }}
    onAdd={handleAddToMyList}
    title="Recommended For You"
    showAdd={true}
  />
)}

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

        {myList.length > 0 && (
          <div ref={myListRef} style={{ scrollMarginTop: "80px" }}>
            <MovieRow
  movies={myList}
  onSelect={(v) => {
  const fixedVideo = {
    ...v,
    video: v.video || v.movieId || v.seasons?.[0]?.video
  };

  setSelectedVideo(fixedVideo);
  setIsSouthPlayer(false);
}}
  title="⭐️ My List"
  showAdd={false}
  isMyList={true}
  onRemove={handleRemoveFromMyList}
/>
          </div>
        )}

        <Top10Row
  movies={topMovies.length > 0 ? topMovies : movies}
  onSelect={(v) => {
  setSelectedVideo(v);
  setIsSouthPlayer(false);

  const movieObj =
    typeof v === "object"
      ? v
      : movies.find(m => m.video === v);

  if (movieObj) {
    fetch(`${API}/watch-count`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        movieId: movieObj._id,
        title: movieObj.title,
        video: movieObj.video
      })
    });
  }
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
      <NetflixPremiumPlayer
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
genre={
  typeof selectedVideo === "object"
    ? selectedVideo.genre
    : [...movies, ...allSeries].find(m => m.video === selectedVideo)?.genre
}

  onSeasonChange={(seasonObj) => {
    setSelectedVideo(prev => ({
      ...prev,
      video: seasonObj.video,
      currentSeason: seasonObj.season,
      title: `${prev.title.split(" - Season")[0]} - Season ${seasonObj.season}`
    }));
  }}

  onClose={() => {

  setSelectedVideo(null);

  // RESUME CINEVOICE
  if (voiceEnabled && !recognitionRef.current) {
  setTimeout(() => {
    startCineVoice();
  }, 1200);
}
}}
/>
    )
  )}

</div>
);
}
const cineVoiceBadgeStyle = {
  position: "fixed",
  bottom: "25px",
  right: "25px",
  background: "rgba(0,0,0,0.85)",
  color: "white",
  padding: "10px 16px",
  borderRadius: "30px",
  zIndex: 99999,
  border: "1px solid #333",
  fontSize: "14px"
};

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
const orStyle = {
  textAlign: "center",
  color: "#aaa",
  fontSize: "13px",
  margin: "18px 0"
};

const phoneBtnStyle = {
  width: "100%",
  padding: "10px",
  background: "#333",
  color: "white",
  border: "1px solid #555",
  borderRadius: "4px",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer",
  boxSizing: "border-box"
};
const phoneNoticeStyle = {
  position: "absolute",
  top: "90px",
  right: "50px",
  zIndex: 20,
  width: "330px",
  background: "rgba(0,0,0,0.88)",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "22px",
  color: "white",
  boxShadow: "0 10px 35px rgba(0,0,0,0.8)"
};

const phoneNoticeCloseStyle = {
  position: "absolute",
  top: "10px",
  right: "12px",
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: "18px",
  cursor: "pointer"
};
const forgotOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  zIndex: 99999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const forgotBoxStyle = {
  width: "420px",
  maxWidth: "90vw",
  background: "rgba(0,0,0,0.92)",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "28px",
  position: "relative",
  boxShadow: "0 15px 50px rgba(0,0,0,0.9)"
};

const forgotCloseStyle = {
  position: "absolute",
  top: "12px",
  right: "14px",
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: "20px",
  cursor: "pointer"
};
export default App;