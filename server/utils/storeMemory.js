// server/utils/storyMemory.js
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
client.connect();

// Save last story per user
const saveLastStory = async (userId, story) => {
  await client.setEx(`story:last:${userId}`, 60 * 60 * 24 * 7, story); // 7 days
};

// Get last story for continuity
const getLastStory = async (userId) => {
  return await client.get(`story:last:${userId}`);
};

module.exports = { saveLastStory, getLastStory };