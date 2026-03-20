const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Step 1 — Convert Punjabi/Hindi text to English phonetics using LLaMA
const transliterateToEnglish = async (text, language) => {
  if (language === 'en') return text;

  const langName = language === 'pa' ? 'Punjabi' : 'Hindi';

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `You are a transliterator. Convert ${langName} text to English phonetics so an English TTS can pronounce it correctly and naturally. 
RULES:
- Write ONLY the romanized/phonetic version
- Make it sound exactly like the original when read aloud in English
- No explanations, no original text, just the phonetic English version
- Keep the same sentence structure and flow`,
      },
      {
        role: 'user',
        content: text,
      }
    ],
    temperature: 0.3,
    max_tokens: 500,
  });

  return completion.choices[0].message.content.trim();
};

// Step 2 — Speak the transliterated text with warm voice
const generateSpeech = async (text, language = 'en') => {
  // Convert Punjabi/Hindi to English phonetics first
  const speakableText = await transliterateToEnglish(text, language);

  console.log('Speaking:', speakableText); // debug

  const response = await groq.audio.speech.create({
    model: 'canopylabs/orpheus-v1-english',
    voice: 'hannah',               // 🌙 warm, motherly
    input: `[soft] ${speakableText}`,
    response_format: 'wav',
  });

  return Buffer.from(await response.arrayBuffer());
};

module.exports = { generateSpeech };

