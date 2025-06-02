import express from 'express';
import db from '../db/db.mjs';
import bcrypt from 'bcryptjs';

const router = express.Router();

//
// ─── REGISTER ───────────────────────────────────────────────────
//
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });

  await db.read();
  db.data.users ||= {};

  if (db.data.users[username])
    return res.status(409).json({ error: 'Username already exists' });

  const hashed = await bcrypt.hash(password, 10);

  db.data.users.push ({
    username: username,
    password: hashed,
    xp: 0,
    level: 1,
    badges: [],
    logs: []
  });

  await db.write();
  console.log("user registered")
  res.status(201).json({ message: 'User registered successfully' });
});

//
// ─── LOGIN ──────────────────────────────────────────────────────
//
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });

  await db.read();
  const user = db.data.users?.find(u => u.username === username);
  if (!user)
    return res.status(404).json({ error: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(401).json({ error: 'Invalid password' });

  req.session.username = username;
  res.json({ message: 'Login successful', username });
});

// GET /auth/status
router.get('/status', (req, res) => {
  if (req.session.username) {
    res.json({ loggedIn: true, username: req.session.username });
  } else {
    res.json({ loggedIn: false });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

//GET SESSION
router.get('/session', (req, res) => {
  if (req.session.username) {
    res.json({ loggedIn: true, username: req.session.username });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

router.get('/profile', async (req, res) => {
  const { username } = req.session;
  if (!username) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await db.read();
  const user = db.data.users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
console.log(user);
  const {  experience = 0, badges = [] } = user;

  // Example: every level requires 20 XP
  const xpForNext = 20;
  const currentXP = experience % xpForNext;
  let level = Math.floor(experience / 20);
  res.json({
    username,
    level,
    xp: currentXP,
    xpNeeded: xpForNext,
    badges
  });
});

export default router;
