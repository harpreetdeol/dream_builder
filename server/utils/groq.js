const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateStory = async (childName, animal, mood, language = 'english') => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `You are a world-class children's bedtime story writer for toddlers aged 1-4.
STRICT RULES:
- Maximum 6 short sentences
- Only simple words a 3-year-old understands
- NEVER include: scary themes, danger, death, strangers, darkness
- ALWAYS end with the child falling asleep peacefully
- Use the child's name at least 3 times
- Make the animal a warm friendly named character
- Include one gentle sound effect like swoosh or flutter
OUTPUT FORMAT: Plain story text only. No titles, no labels.`
      },
      {
        role: 'user',
        content: `Write a bedtime story. Child: Aanya. Animal: bunny. Mood: Sleepy.`
      },
      {
        role: 'assistant',
        content: `Little Aanya yawned a big soft yawn as her friend Biscuit the bunny hopped slowly to her side. Biscuit made a tiny flutter sound as he curled up next to Aanya. Aanya stroked his fluffy fur and felt her eyes growing heavier. Biscuit whispered, "Rest now Aanya, the stars are watching." Aanya smiled the softest smile, and together she and Biscuit drifted into the warmest most peaceful dream.`
      },
      {
        role: 'user',
        content: `Write a bedtime story. Child: ${childName}. Animal: ${animal}. Mood: ${mood}. Language: ${language}.`
      }
    ],
    temperature: 0.85,
    max_tokens: 350,
    top_p: 0.9,
    frequency_penalty: 0.3,
  });

  return completion.choices[0].message.content.trim();
};

module.exports = { generateStory };
