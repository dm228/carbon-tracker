import express from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db/db.mjs';
import askWatsonx from '../utils/askWatsonx.mjs';
import {
  addActivityToVectorDB,
  findSimilarActivity
} from '../utils/embeddingStore.mjs';

import getEmbedding from '../utils/getEmbedding.mjs';
const router = express.Router();

// POST /track
router.post('/askwatson', async (req, res) => {
  const username = req.session.username;
  const { activity } = req.body;

  if (!username) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  if (!activity) {
    return res.status(400).json({ error: 'Missing activity input' });
  }

  const embedding = await getEmbedding(activity);

  // 🧠 Check VectorDB first
  let estimation;
  const similar = await findSimilarActivity(activity);
  const isMatch = !!similar;

  if (isMatch) {
    estimation = similar.metadata;
    console.log('💾 Found similar activity in local VectorDB');
  } else {
    try {
      estimation = await askWatsonx(activity);
      console.log('🤖 Estimated via Watsonx');

      // Add to VectorDB for future matching
      await addActivityToVectorDB(activity, estimation);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Watsonx failed to estimate' });
    }
  }

  const xpMap = { green: 5, amber: 2, red: 0 };
  const xpGained = xpMap[estimation.impact] ?? 0;
/*
  // 🏆 Award XP
  const xpMap = { green: 5, amber: 2, red: 0 };
  const xpGained = xpMap[estimation.impact] ?? 0;

  const user = db.data.users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.experience += xpGained;

  // Level up logic (e.g. badge every 10 XP)
  const newLevel = Math.floor(user.experience / 20);
  const currentLevel = user.badges.length;

  if (newLevel > currentLevel) {
    user.badges.push(`Level ${newLevel}`);
  }

  // Add log
  user.logs.push({
    id: uuid(),
    activity,
    ...estimation,
    date: new Date().toISOString()
  });

  await db.write();
*/
  res.json({
    message: isMatch ? 'Activity matched locally' : 'Estimated via Watsonx',
    activity: activity,
    category: estimation.category,
    co2e_kg: estimation.co2e_kg,
    impact: estimation.impact,
    source: estimation.source,
    xpGained,
    //newLevel: newLevel > currentLevel ? newLevel : null
  });
});

router.post('/commit', async (req, res) => {
    const username = req.session.username;
    const { activity, category, co2e_kg, impact, source, xpAwarded, quantity} = req.body;

    console.log("committing ", req.body);
    /***activity: estimation.activity,
            category: estimation.category || '',
            co2e_kg: estimation.co2e_kg,
            impact: estimation.impact,
            source: estimation.source,
            xpAwarded: estimation.xpGained,
            quantity: 1 */

    if (!username) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!activity) {
        return res.status(400).json({ error: 'Missing activity input' });
    }

    // 🏆 Award XP
  const xpMap = { green: 5, amber: 2, red: 0 };
  const xpGained = xpMap[impact] ?? 0;

  const user = db.data.users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.experience += xpGained;

  // Level up logic (e.g. badge every 10 XP)
  const newLevel = Math.floor(user.experience / 20);
  const currentLevel = user.badges.length;

  if (newLevel > currentLevel) {
    user.badges.push(`Level ${newLevel}`);
  }

  // Add log
  user.logs.push({
    id: uuid(),
    activity,
    category: category || '',
    co2e_kg: co2e_kg,
    impact: impact,
    source: source,
    xpAwarded: xpGained,
    quantity: quantity,
    date: new Date().toISOString()
  });

  await db.write();

  res.json({ message: 'Activity recorded', level: user.level, badges: user.badges });

});
router.post('/test', async (req, res) => {
  req.session.username = 'demoUser';
  const testActivity = 'Ate 100g of lentils';
    await db.read();
  // Create user if it doesn't exist

  let user = db.data.users?.find(u => u.username === req.session.username);
  
  
  if (!user) {
    user = { username: 'demoUser', password: 'test', experience: 0, badges: [] , logs: []};
    db.data.users.push(user);
    await db.write();
  }

  // Mimic a real /track request
  req.body = { activity: testActivity };

  const embedding = await getEmbedding(testActivity);

  // Instead of reusing internal logic, copy just enough here:
  const similar = await findSimilarActivity(testActivity);
  let estimation;

  if (similar) {
    estimation = similar.metadata;
  } else {
    estimation = await askWatsonx(testActivity);
    await addActivityToVectorDB(testActivity, estimation);
  }

  const xpMap = { green: 5, amber: 2, red: 0 };
  const xpGained = xpMap[estimation.impact] ?? 0;

  user.experience += xpGained;

  const newLevel = Math.floor(user.experience / 10);
  const currentLevel = user.badges.length;

  if (newLevel > currentLevel) {
    user.badges.push(`Level ${newLevel}`);
  }

  user.logs.push({
    id: 'test-id',
    activity: testActivity,
    ...estimation,
    date: new Date().toISOString()
  });

  await db.write();

  res.json({
    message: similar ? 'Matched from vector DB' : 'Estimated via Watsonx',
    ...estimation,
    xpGained,
    newLevel: newLevel > currentLevel ? newLevel : null
  });
});

//Get STats now

router.get('/stats', async (req, res) => {
  const { username } = req.session;
  if (!username) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await db.read();
  const user = db.data.users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const now = new Date();
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD in UTC
  const grouped = Array(24).fill(0); // 0–23 hours

  for (const entry of user.logs) {
    if (!entry.date) continue;

    const entryDate = new Date(entry.date);
    const entryDay = entryDate.toISOString().split('T')[0];

    if (entryDay !== today) continue;

    const hour = entryDate.getUTCHours(); // Adjust to local time if needed
    grouped[hour] += entry.co2e_kg || 0;
  }

  const stats = grouped.map((value, hour) => ({
    hour,
    value: parseFloat(value.toFixed(3))
  }));

  res.json(stats);
});


export default router;
