const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();
const PORT = 3030;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(bodyParser.json());

// Middleware for token validation
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Sign up
app.post("/auth/sign-up", async (req, res) => {
  const { email, password } = req.body;

  // Validate incoming data
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  // Encrypt the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store the user in the database
  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
      [email, hashedPassword]
    );
    const userId = result.rows[0].id;

    // Generate JWT token
    const accessToken = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
      expiresIn: "60s",
    });
    const refreshToken = jwt.sign({ userId, email }, process.env.JWT_SECRET);

    res.json({
      success: true,
      data: { id: userId, accessToken, refreshToken },
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ success: false, error: "Email is taken." });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Sign in
app.post("/auth/sign-in", async (req, res) => {
  const { email, password } = req.body;

  // Validate incoming data
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  // Retrieve user from the database
  try {
    const result = await pool.query(
      "SELECT id, password FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { userId: user.id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, email },
      process.env.JWT_SECRET
    );

    res.json({
      success: true,
      data: { id: user.id, accessToken, refreshToken },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Protected endpoint example
app.get("/me", authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Assuming userId is stored in the token payload

  // Retrieve user from the database
  try {
    const result = await pool.query(
      "SELECT id, email FROM users WHERE id = $1",
      [userId]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.json({
      success: true,
      data: { id: user.id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
