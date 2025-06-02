import express from 'express';
import cors from 'cors';
import session from 'express-session';
import trackRoutes from './routes/track.mjs';
import authRoutes from './routes/auth.mjs';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true // enable cookie support
}));
app.use(express.json());

// Session middleware
app.use(session({
  secret: 'supercarbonsecret', // Replace in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

app.use('/track', trackRoutes);
app.use('/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
