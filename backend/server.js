const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
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
  movieId: String,
  title: String,
  image: String,
  video: String
});

/* 🔐 SECRET */
const JWT_SECRET = process.env.JWT_SECRET;
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
    const { movieId, title, image, video } = req.body;

    if (!movieId) {
      return res.status(400).json({ error: "Movie ID required" });
    }

    const exists = await MyList.findOne({
      username: req.user.username,
      movieId
    });

    if (exists) {
      return res.json({ message: "Already added" });
    }

    const item = new MyList({
      username: req.user.username,
      movieId,
      title,
      image,
      video
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
    const list = await MyList.find({
      username: req.user.username
    });

    res.json(list); // ✅ direct return (NO DB lookup)

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ❌ REMOVE */
app.delete("/mylist/:id", auth, async (req, res) => {
  try {
    await MyList.findOneAndDelete({
      username: req.user.username,
      movieId: req.params.id
    });

    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= */
/* START */
/* ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});