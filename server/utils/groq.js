const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const LANG_CONFIG = {
  en: {
    instruction: 'You MUST write ONLY in English.',
    userMsg: 'Write a bedtime story in ENGLISH ONLY.',
    example: `Little Aanya yawned a big soft yawn as her friend Biscuit the bunny hopped slowly to her side. Biscuit made a tiny flutter sound as he curled up next to Aanya. Aanya stroked his fluffy fur and felt her eyes growing heavier. Biscuit whispered, "Rest now Aanya, the stars are watching." Aanya smiled the softest smile, and together she and Biscuit drifted into the warmest most peaceful dream.`
  },
  hi: {
    instruction: `आपको केवल बहुत सरल और प्यारी हिंदी में लिखना है।
IMPORTANT:
- Maximum 4 sentences
- Use simple child-friendly words
- Make it sound like a bedtime story`,
    userMsg: 'केवल हिंदी में बेडटाइम कहानी लिखो।',
    example: `आन्या ने एक बड़ी सी जम्हाई ली जब उसका दोस्त बिस्किट खरगोश धीरे-धीरे उसके पास आया। बिस्किट ने फुर्र की आवाज़ की और आन्या के पास बैठ गया। आन्या ने उसका नरम फर सहलाया और उसकी आँखें भारी होने लगीं। बिस्किट ने फुसफुसाया, "सो जाओ आन्या, तारे तुम्हें देख रहे हैं।" आन्या ने मुस्कुराते हुए आँखें बंद कीं और बिस्किट के साथ गहरी नींद में चली गई।`
  },
pa: {
  instruction: `ਤੁਸੀਂ ਸਿਰਫ ਪੰਜਾਬੀ ਵਿੱਚ ਬਹੁਤ ਹੀ ਸੌਖੀ ਅਤੇ ਪਿਆਰੀ ਬੱਚਿਆਂ ਵਾਲੀ ਭਾਸ਼ਾ ਵਿੱਚ ਲਿਖੋ।
IMPORTANT:
- Maximum 4 sentences only
- Use very simple, cute words (like: "ਛੋਟਾ", "ਮਿੱਠਾ", "ਪਿਆਰਾ")
- Make it sound like a mother telling a bedtime story
- Add soft sound words like "ਫੁਰਰ", "ਸ਼ਸ਼ਸ਼", "ਟਪ ਟਪ"
- Never leave a sentence incomplete`,
  
  userMsg: 'ਕੇਵਲ ਬਹੁਤ ਸੌਖੀ ਪੰਜਾਬੀ ਵਿੱਚ ਇੱਕ ਪਿਆਰੀ ਬੇਡਟਾਈਮ ਕਹਾਣੀ ਲਿਖੋ।',

  example: `ਛੋਟੀ ਆਨਿਆ ਨੇ ਹੌਲੀ ਜਿਹੀ ਉਬਾਸੀ ਲਈ। ਉਸਦਾ ਪਿਆਰਾ ਦੋਸਤ ਬਿਸਕੁਟ ਖਰਗੋਸ਼ ਫੁਰਰ ਕਰਦਾ ਉਸਦੇ ਕੋਲ ਆ ਗਿਆ। ਆਨਿਆ ਨੇ ਉਸਦਾ ਨਰਮ ਫਰ ਸਹਿਲਾਇਆ ਅਤੇ ਅੱਖਾਂ ਹੌਲੀ-ਹੌਲੀ ਬੰਦ ਹੋਣ ਲੱਗੀਆਂ। ਬਿਸਕੁਟ ਨੇ ਕਿਹਾ, "ਸੌਂ ਜਾ ਆਨਿਆ," ਅਤੇ ਦੋਵੇਂ ਮਿੱਠੀ ਨੀਂਦ ਵਿੱਚ ਚਲੇ ਗਏ।`
}
};

const generateStory = async (childName, animal, mood, language = 'en') => {
  const lang = LANG_CONFIG[language] || LANG_CONFIG.en;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `You are a children's bedtime story writer.
${lang.instruction}
STRICT RULES:
- Maximum 6 short sentences
- Only simple words a 3-year-old understands
- NEVER include: scary themes, danger, death, strangers, darkness
- ALWAYS end with the child falling asleep peacefully
- Use the child's name at least 3 times
- Make the animal a warm friendly named character
- Include one gentle sound effect like swoosh or flutter
- OUTPUT: Plain story text only. No titles, no labels. No English if language is not English.`
      },
      {
        role: 'user',
        // ✅ user message also in target language
        content: `${lang.userMsg} Child: Aanya. Animal: bunny. Mood: Sleepy.`
      },
      {
        role: 'assistant',
        // ✅ example response in target language — LLaMA mirrors this
        content: lang.example
      },
      {
        role: 'user',
        // ✅ final request also in target language
        content: `${lang.userMsg} Child: ${childName}. Animal: ${animal}. Mood: ${mood}.`
      }
    ],
    temperature: 0.85,
    max_tokens: 800,
    top_p: 0.9,
    frequency_penalty: 0.3,
  });

  return completion.choices[0].message.content.trim();
};

module.exports = { generateStory };


