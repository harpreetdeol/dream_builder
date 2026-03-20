const axios = require('axios');

// Rachel voice — warm, soft, perfect for bedtime stories
const VOICE_ID = 'MF3mGyEYCl7XYWbV9V6O';

const generateSpeech = async (text) => {
  const response = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.85,        // very stable, calm voice
        similarity_boost: 0.75, // warm and natural
        style: 0.35,            // gentle storytelling style
        use_speaker_boost: true,
      }
    },
    {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',

      },
      responseType: 'arraybuffer', // returns audio binary
    }
  );

  return response.data; // audio buffer
};

module.exports = { generateSpeech };