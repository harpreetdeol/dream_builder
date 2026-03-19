// server/utils/safetyCheck.js

const UNSAFE_WORDS = [
  'scary', 'monster', 'die', 'dead', 'blood', 'hurt',
  'danger', 'stranger', 'dark', 'nightmare', 'ghost', 'kill'
];

const validateStory = (story) => {
  const lower = story.toLowerCase();

  // Check for unsafe words
  const found = UNSAFE_WORDS.filter(word => lower.includes(word));
  if (found.length > 0) {
    return {
      safe: false,
      reason: `Contains unsafe words: ${found.join(', ')}`
    };
  }

  // Must end peacefully (sleep-related ending)
  const sleepWords = ['sleep', 'dream', 'drift', 'rest', 'close', 'eyes', 'yawn'];
  const endsWithSleep = sleepWords.some(w => lower.slice(-200).includes(w));
  if (!endsWithSleep) {
    return { safe: false, reason: 'Story does not end with sleep' };
  }

  // Minimum quality: must be at least 3 sentences
  const sentences = story.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length < 3) {
    return { safe: false, reason: 'Story too short' };
  }

  return { safe: true };
};

module.exports = { validateStory };