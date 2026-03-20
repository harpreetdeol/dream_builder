const express = require('express');
const router = express.Router();
const { generateStory } = require('../utils/groq');
const Story = require('../models/Story');
const protect = require('../middleware/authMiddleware');
const { validateStory } = require('../utils/safetyCheck');
const { generateSpeech } = require('../utils/textToSpeech');


router.post('/generate', protect, async (req, res) => {
  const { childName, animal, mood } = req.body;
  let content, attempts = 0;

  // Retry up to 3 times if story fails safety check
  do {
    content = await generateStory(childName, animal, mood);
    const check = validateStory(content);
    if (check.safe) break;
    console.warn(`Safety check failed (attempt ${attempts + 1}): ${check.reason}`);
    attempts++;
  } while (attempts < 3);

  res.json({ content });
});
router.post('/generate-stream', protect, async (req, res) => {
  const { childName, animal, mood } = req.body;

  // Set headers for streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: buildMessages(childName, animal, mood),
    temperature: 0.85,
    max_tokens: 350,
    stream: true,  // ← this is the key change
  });

  for await (const chunk of stream) {
    const word = chunk.choices[0]?.delta?.content || '';
    if (word) {
      res.write(`data: ${JSON.stringify({ word })}\n\n`);
    }
  }

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});
router.post('/save', protect, async (req, res) => {
  try {
    const { childName, animal, mood, content } = req.body;
    const story = await Story.create({
      userId: req.user._id, childName, animal, mood, content
    });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save story' });
  }
});

router.get('/list', protect, async (req, res) => {
  try {
    const stories = await Story.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

router.patch('/:id/favourite', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    story.isFavourite = !story.isFavourite;
    await story.save();
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update story' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: 'Story deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete story' });
  }
});
// Generate audio for a story
router.post('/speak', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: 'Text is required' });

    const audioBuffer = await generateSpeech(text);

    // Send audio back as mp3
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
    });

    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('TTS error:', err.message);
    res.status(500).json({ error: 'Could not generate speech' });
  }
});
module.exports = router;
