const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateStory = async (childName, animal, mood, language = 'english', previousStory = null) => {

  const systemPrompt = `You are a world-class children's bedtime story writer specialising in toddlers aged 1-4.

STRICT RULES:
- Maximum 6 short sentences
- Only use words a 3-year-old understands (no words longer than 2 syllables where possible)
- NEVER include: scary themes, darkness, strangers, danger, death, or conflict
- ALWAYS end with the child falling asleep peacefully
- Use the child's name at least 3 times
- Make the animal a warm, friendly, named character
- Include one gentle sound effect (e.g. "swoosh", "flutter", "hmmm")
- Story must feel warm, safe, and dreamy

MOOD GUIDELINES:
- Happy: upbeat adventure, lots of smiling
- Sleepy: very slow pace, yawning, soft descriptions  
- Excited: gentle surprise, wonder, discovery
- Cozy: warmth, blankets, soft light, home
- Calm: nature, breeze, slow movement
- Brave: gentle encouragement, small victories

OUTPUT FORMAT: Plain story text only. No titles, no labels, no quotation marks.`;

  const messages = [
    { role: 'system', content: systemPrompt },
  ];

  // Few-shot example — shows the AI exactly what good output looks like
  messages.push({
    role: 'user',
    content: `Write a bedtime story. Child: Aanya. Animal: bunny. Mood: Sleepy.`
  });
  messages.push({
    role: 'assistant',
    content: `Little Aanya yawned a big, soft yawn as her friend Biscuit the bunny hopped slowly to her side. Biscuit's ears drooped gently, and he made a tiny "hmmm" sound as he curled up next to her. Aanya stroked his fluffy fur and felt her eyes growing heavier and heavier. Biscuit whispered, "Rest now, Aanya, the stars are watching over us." Aanya smiled the softest smile, and together, she and Biscuit drifted into the warmest, most peaceful dream.`
  });

  // Continuity — pass previous story so characters persist
  if (previousStory) {
    messages.push({
      role: 'user',
      content: `Here was last night's story for context — use the same animal character name if mentioned: "${previousStory}"`
    });
    messages.push({
      role: 'assistant',
      content: `Understood, I will continue with the same character.`
    });
  }

  // Actual request
  messages.push({
    role: 'user',
    content: `Write a bedtime story. Child: ${childName}. Animal: ${animal}. Mood: ${mood}. Language: ${language}.`
  });

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages,
    temperature: 0.85,   // slightly creative but not wild
    max_tokens: 350,
    top_p: 0.9,          // nucleus sampling — more natural output
    frequency_penalty: 0.3, // reduces repetitive phrases
  });

  return completion.choices[0].message.content.trim();
};

module.exports = { generateStory };
