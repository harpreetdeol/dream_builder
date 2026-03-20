import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { saveStory, speakStory } from '../api/storyApi';

const ANIMAL_EMOJIS = {
  bunny: '🐰', elephant: '🐘', lion: '🦁', dolphin: '🐬',
  unicorn: '🦄', puppy: '🐶', kitten: '🐱', fox: '🦊',
  bear: '🐻', tiger: '🐯', penguin: '🐧', owl: '🦉',
  dragon: '🐉', cat: '🐱', dog: '🐶', rabbit: '🐰',
};

const getAnimalEmoji = (animal) => {
  const key = animal?.toLowerCase();
  return ANIMAL_EMOJIS[key] || '🐾';
};

const floatingElements = ['⭐', '🌟', '✨', '💫', '🌙', '☁️'];

export default function StoryViewer() {
  const { state } = useLocation();

  const navigate = useNavigate();
  const [speaking, setSpeaking] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const utteranceRef = useRef(null);
  const audioRef = useRef(new Audio());
  const bgMusicRef = useRef(new Audio('/bg-music.mp3'));
  const keepAliveRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  const story = state?.story || '';
  const form = state?.form || {};
  const language = state?.language || 'en';
  const animalEmoji = getAnimalEmoji(form.animal);
  // 🌙 Magical bedtime music for kids
  const BG_MUSIC_URL = 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1fca.mp3';
  const sentences = story.split(/(?<=[.!?])\s+/).filter(s => s.trim());

  // Unlock audio context on first user click (Chrome headphone fix)

  // Pre-load voices as soon as component mounts

  // Cleanup speech on unmount

  // Chrome bug: stops speaking after ~15s — keep alive with pause/resume
  useEffect(() => {
    if (speaking) {
      keepAliveRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
    } else {
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
    }
    return () => {
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
    };
  }, [speaking]);
  // ✅ KEEP only this one
  useEffect(() => {
    return () => {
      window.responsiveVoice?.cancel();
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
    };
  }, []);


const readAloud = async () => {
  if (speaking) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    bgMusicRef.current.pause();
    bgMusicRef.current.currentTime = 0;
    setSpeaking(false);
    setAudioUrl(null);
    return;
  }

  // Already generated — just replay
  if (audioUrl) {
    audioRef.current.src = audioUrl;
    audioRef.current.play();
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.12;
    bgMusicRef.current.play().catch(() => {});
    setSpeaking(true);
    return;
  }

  setAudioLoading(true);
  try {
    const { data } = await speakStory(story, language || 'en');

    // ✅ HERE — wav because Groq PlayAI returns wav
    const url = URL.createObjectURL(
      new Blob([data], { type: 'audio/wav' })
    );
    setAudioUrl(url);

    audioRef.current.src = url;
    audioRef.current.onended = () => {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
      setSpeaking(false);
    };

    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.12;

    setTimeout(async () => {
      await bgMusicRef.current.play().catch(() => {});
      await audioRef.current.play();
      setSpeaking(true);
    }, 100);

  } catch (err) {
    console.error('TTS error:', err);
    bgMusicRef.current.pause();
    alert('Could not generate voice. Try again!');
  } finally {
    setAudioLoading(false);
  }
};
  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      bgMusicRef.current?.pause();
    };
  }, []);

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      await saveStory({ ...form, content: story });
      setSaved(true);
    } catch (err) {
      alert('Could not save the story. Try again!');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleTap = () => setTapCount(c => c + 1);

  return (
    <div style={{
      minHeight: '100vh', padding: '100px 24px 60px',
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 680 }}>

        {/* Floating decorations */}
        {floatingElements.map((el, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ delay: i * 0.15 }}
            style={{
              position: 'fixed',
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 20}%`,
              fontSize: 28,
              pointerEvents: 'none',
              animation: `float ${3 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              zIndex: 0,
            }}
          >
            {el}
          </motion.div>
        ))}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{
            padding: '32px', textAlign: 'center',
            marginBottom: 24, position: 'relative', zIndex: 1,
          }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            style={{ fontSize: 80, marginBottom: 12 }}
            onClick={handleTap}
          >
            {animalEmoji}
          </motion.div>

          {tapCount > 0 && (
            <motion.div
              key={tapCount}
              initial={{ scale: 0, y: -20, opacity: 1 }}
              animate={{ scale: 1.5, y: -60, opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'absolute', top: 80, left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 28, pointerEvents: 'none',
              }}
            >
              ✨
            </motion.div>
          )}

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 32,
            background: 'linear-gradient(135deg, var(--lavender), var(--pink))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', marginBottom: 8,
          }}>
            {form.childName}'s Bedtime Story
          </h1>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
              borderRadius: 50, padding: '6px 16px', fontSize: 14, fontWeight: 700,
              color: 'var(--lavender)',
            }}>
              🐾 Starring a {form.animal}
            </span>
            <span style={{
              background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)',
              borderRadius: 50, padding: '6px 16px', fontSize: 14, fontWeight: 700,
              color: 'var(--pink)',
            }}>
              🌙 Mood: {form.mood}
            </span>
          </div>
        </motion.div>

        {/* Story Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
          style={{ padding: '40px', marginBottom: 24, position: 'relative', zIndex: 1 }}
        >
          <div style={{ position: 'absolute', top: 20, right: 24, fontSize: 24, opacity: 0.3 }}>
            📖
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sentences.map((sentence, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                style={{
                  fontSize: 20, lineHeight: 1.85,
                  color: i === sentences.length - 1
                    ? 'rgba(167,139,250,0.9)'
                    : 'rgba(255,255,255,0.88)',
                  fontWeight: 600,
                  borderLeft: i === sentences.length - 1 ? '3px solid var(--violet)' : 'none',
                  paddingLeft: i === sentences.length - 1 ? 16 : 0,
                }}
              >
                {sentence}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{
              textAlign: 'center', marginTop: 28, fontSize: 40,
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            🌙 ⭐ 💤
          </motion.div>
        </motion.div>

        {/* Tap hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          style={{
            textAlign: 'center', color: 'rgba(255,255,255,0.3)',
            fontSize: 13, fontWeight: 600, marginBottom: 20,
          }}
        >
          Tap the {animalEmoji} for magic!
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}
        >
          {/* Audio is handled via background Audio Object */}

          {/* Read Aloud Button — replace existing one */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={readAloud}
            disabled={audioLoading}
            style={{
              flex: 1, minWidth: 140, padding: '18px',
              borderRadius: 50, border: 'none', cursor: audioLoading ? 'wait' : 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 17,
              background: speaking
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : audioLoading
                  ? 'linear-gradient(135deg, #6c3fc5, #4c1d95)'
                  : 'linear-gradient(135deg, #34d399, #059669)',
              color: 'white',
              boxShadow: speaking
                ? '0 8px 25px rgba(239,68,68,0.4)'
                : '0 8px 25px rgba(52,211,153,0.4)',
              transition: 'all 0.3s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
            }}
          >
            {audioLoading
              ? '🎵 Creating voice...'
              : speaking
                ? '⏹ Stop'
                : audioUrl
                  ? '🎵 Play Again'
                  : '🎙️ Read Aloud'
            }
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saved || saveLoading}
            style={{
              flex: 1, minWidth: 140, padding: '18px',
              borderRadius: 50, border: 'none', cursor: saved ? 'default' : 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 17,
              background: saved
                ? 'linear-gradient(135deg, #6c3fc5, #4c1d95)'
                : 'linear-gradient(135deg, #fbbf24, #d97706)',
              color: 'white',
              boxShadow: '0 8px 25px rgba(251,191,36,0.35)',
              opacity: saved ? 0.8 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {saved ? '✅ Saved!' : saveLoading ? '💾 Saving...' : '⭐ Save Story'}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ display: 'flex', gap: 12, marginTop: 12, position: 'relative', zIndex: 1 }}
        >
          <button
            className="btn-secondary"
            onClick={() => navigate('/create')}
            style={{ flex: 1, padding: '16px', fontSize: 16 }}
          >
            ✨ New Story
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/archive')}
            style={{ flex: 1, padding: '16px', fontSize: 16 }}
          >
            📚 My Archive
          </button>
        </motion.div>
      </div>
    </div>
  );
}