const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateStory = async (childName, animal, mood) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `You are a magical bedtime story teller for toddlers aged 1-4 years old.
Always write short, calming, and sweet bedtime stories.
Use very simple words that a toddler can understand.
Every story must end with the child falling peacefully asleep.
Keep stories to exactly 5-6 short sentences. Use warm, safe, magical tone.
Never use scary words or themes. Always positive and dreamy.`
      },
      {
        role: 'user',
        content: `Write a bedtime story for a toddler with these details:
Child's name: ${childName}
Favourite animal: ${animal}
Tonight's mood: ${mood}
Make the animal a friendly, cute character and include the child's name in the story.`
      }
    ],
    temperature: 0.85,
    max_tokens: 300,
  });

  return completion.choices[0].message.content;
};

module.exports = { generateStory };
