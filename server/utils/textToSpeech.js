const gtts = require('gtts');

const generateSpeech = (text) => {
  return new Promise((resolve, reject) => {
    const speech = new gtts(text, 'en');
    const chunks = [];

    const stream = speech.stream();

    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', (err) => reject(new Error(err.message || 'TTS failed')));
  });
};

module.exports = { generateSpeech };