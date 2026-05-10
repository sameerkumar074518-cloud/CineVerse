const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* ✅ STATIC FILES */
app.use(
  "/images",
  express.static(path.join(__dirname, "../frontend/frontend/public/images"))
);

app.use(
  "/movies",
  express.static(path.join(__dirname, "../frontend/frontend/public/movies"))
);

/* ✅ CONNECT DB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("DB Error:", err));

/* ✅ MODELS */
const Movie = mongoose.model("Movie", {
  title: String,
  fullTitle: String,
  description: String,
  image: String,
  video: String,
});

const User = mongoose.model("User", {
  username: String,
  password: String,
});

/* 🔥 UPDATED MY LIST MODEL */
const MyList = mongoose.model("MyList", {
  username: String,
  profileId: String,
  movieId: String,
  title: String,
  image: String,
  video: String,

  seasons: Array,
  genre: String,
  cast: String,
  description: String,
  isSeries: Boolean
});

/* 🔐 SECRET */
const JWT_SECRET = "mysecretkey";

/* 🔐 AUTH */
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "No token" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

/* ================= */
/* AUTH ROUTES */
/* ================= */

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      username: user.username,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= */
/* MOVIES */
/* ================= */

app.get("/movies", auth, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= */
/* 🔥 MY LIST (FIXED) */
/* ================= */

/* ➕ ADD */
app.post("/mylist", auth, async (req, res) => {
  try {
    const {
  profileId,
  movieId,
  title,
  image,
  video,
  seasons,
  genre,
  cast,
  description,
  isSeries
} = req.body;
console.log("PROFILE ID:", profileId);
console.log("MOVIE:", title);

    if (!profileId || !movieId) {
  return res.status(400).json({ error: "Profile ID and Movie ID required" });
}

    const exists = await MyList.findOne({
  username: req.user.username,
  profileId,
  movieId
});

    if (exists) {
      return res.json({ message: "Already added" });
    }

    const item = new MyList({
  username: req.user.username,
  profileId,
  movieId,
  title,
  image,
  video,
  seasons,
  genre,
  cast,
  description,
  isSeries
});

    await item.save();

    res.json({ message: "Added to My List", movie: item });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 📥 GET */
app.get("/mylist", auth, async (req, res) => {
  try {
    const profileId = req.query.profileId;

if (!profileId) {
  return res.status(400).json({ error: "Profile ID required" });
}

const list = await MyList.find({
  username: req.user.username,
  profileId
});

    res.json(list); // ✅ direct return (NO DB lookup)

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ❌ REMOVE */
/* ❌ REMOVE */
app.delete("/mylist/:id", auth, async (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id);
    const profileId = req.query.profileId;

    if (!profileId) {
      return res.status(400).json({ error: "Profile ID required" });
    }

    const result = await MyList.findOneAndDelete({
      username: req.user.username,
      profileId,
      movieId: id
    });

    if (!result) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Removed" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= */
/* START */
/* ================= */

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});