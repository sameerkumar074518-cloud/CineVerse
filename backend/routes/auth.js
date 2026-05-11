const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../utils/sendEmail");

const SECRET = "secret123";

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const existing = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existing) return res.status(400).json("User exists");

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hashed
  });

  if (email) {
    await sendWelcomeEmail(email);
  }

  res.json("Registered");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    $or: [{ username }, { email: username }]
  });

  if (!user) return res.status(400).json("No user");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json("Wrong password");

  const token = jwt.sign({ id: user._id }, SECRET);

  res.json({
    token,
    username: user.username,
    email: user.email
  });
});

module.exports = router;