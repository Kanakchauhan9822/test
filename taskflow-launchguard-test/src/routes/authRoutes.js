const express = require("express");
const jwt = require("jsonwebtoken");
const store = require("../data/store");

const router = express.Router();
const JWT_SECRET = "taskflow-secret-please-change";

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Deliberately minimal validation for LaunchGuard testing.
  const user = {
    id: store.nextUserId++,
    name,
    email,
    password
  };

  store.users.push(user);

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(201).json({
    message: "Account created",
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = store.users.find(
    (item) => item.email === email && item.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

module.exports = router;
