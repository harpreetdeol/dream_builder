import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { generateStory } from '../api/storyApi';
import { AuthProvider, useAuth } from '../context/AuthContext';
const moods = [
  { label: 'Happy',   emoji: '😊', color: '#fbbf24' },
  { label: 'Sleepy',  emoji: '😴', color: '#a78bfa' },
  { label: 'Excited', emoji: '🤩', color: '#f472b6' },
  { label: 'Cozy',    emoji: '🥰', color: '#fb923c' },
  { label: 'Calm',    emoji: '😌', color: '#34d399' },
  { label: 'Brave',   emoji: '🦁', color: '#60a5fa' },
];

const animalSuggestions = ['🐰 Bunny', '🐘 Elephant', '🦁 Lion', '🐬 Dolphin', '🦄 Unicorn', '🐶 Puppy', '🐱 Kitten', '🦊 Fox'];

const steps = ['Child\'s Name', 'Favourite Animal', 'Tonight\'s Mood'];

export default function StoryForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ childName: '', animal: '', mood: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const canNext = () => {
    if (step === 0) return form.childName.trim().length > 0;
    if (step === 1) return form.animal.trim().length > 0;
    if (step === 2) return form.mood.length > 0;
    return false;
  };

  const handleNext = () => { if (canNext() && step < 2) setStep(s => s + 1); };


 const handleGenerate = async () => {
  setLoading(true);
  setError('');
  
  console.log('user:', user);           // 👈 check if user exists
  console.log('user.language:', user?.language); // 👈 check language value
  
  try {
    const language = user?.language || 'en';
    const { data } = await generateStory({ ...form, language });
    navigate('/story', { state: { story: data.content, form, language } });
  } catch (err) {
    console.log('Full error:', err);         // 👈 see full error
    console.log('Response:', err.response?.data); // 👈 see backend error
    setError('Could not create your story. Please try again! 🌙');
    setLoading(false);
  }
};

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '100px 24px 40px',
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
               <motion.div
  animate={{ scale: i === step ? 1.1 : 1 }}
  style={{
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: 14, color: 'white',
    transition: 'background 0.3s',
    background: i <= step
      ? 'linear-gradient(135deg, #6c3fc5, #f472b6)'
      : 'rgba(255,255,255,0.1)',
    border: i <= step ? 'none' : '2px solid rgba(255,255,255,0.2)',
  }}
>
                </motion.div>
                {i < 2 && (
                  <motion.div
                    animate={{ background: i < step ? 'var(--violet)' : 'rgba(255,255,255,0.1)' }}
                    style={{ width: 60, height: 3, borderRadius: 2 }}
                  />
                )}
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
            Step {step + 1} of 3 — {steps[step]}
          </p>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="glass-card"
          style={{ padding: '48px 40px' }}
        >
          {/* Step 1 - Child Name */}
          {step === 0 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: 80, marginBottom: 16 }} className="float">👶</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--lavender)', marginBottom: 8 }}>
                  Who is the story for?
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                  Enter your little one's name
                </p>
              </div>
              <input
                className="dream-input"
                placeholder="e.g. Aanya, Riya, Arjun..."
                value={form.childName}
                onChange={e => setForm({ ...form, childName: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                autoFocus
                style={{ fontSize: 22, textAlign: 'center', padding: '20px' }}
              />
            </div>
          )}

          {/* Step 2 - Animal */}
          {step === 1 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 80, marginBottom: 16 }} className="float">🐾</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--lavender)', marginBottom: 8 }}>
                  Favourite Animal?
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                  This animal will be in {form.childName}'s story!
                </p>
              </div>
              <input
                className="dream-input"
                placeholder="Type any animal..."
                value={form.animal}
                onChange={e => setForm({ ...form, animal: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                autoFocus
                style={{ textAlign: 'center', fontSize: 20, marginBottom: 20 }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                {animalSuggestions.map(a => (
                  <motion.button
                    key={a}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setForm({ ...form, animal: a.split(' ')[1] })}
                    style={{
                      background: form.animal === a.split(' ')[1]
                        ? 'linear-gradient(135deg, var(--violet), var(--pink))'
                        : 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 50, padding: '10px 18px',
                      color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)',
                      fontWeight: 700, fontSize: 15, transition: 'all 0.2s',
                    }}
                  >
                    {a}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 - Mood */}
          {step === 2 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 80, marginBottom: 16 }} className="float">🌙</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--lavender)', marginBottom: 8 }}>
                  Tonight's Mood?
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                  How is {form.childName} feeling right now?
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {moods.map(m => (
                  <motion.button
                    key={m.label}
                    whileHover={{ scale: 1.06, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setForm({ ...form, mood: m.label })}
                    style={{
                      background: form.mood === m.label
                        ? `${m.color}25`
                        : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${form.mood === m.label ? m.color : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 20, padding: '20px 12px',
                      cursor: 'pointer', display: 'flex',
                      flexDirection: 'column', alignItems: 'center', gap: 8,
                      transition: 'all 0.2s',
                      boxShadow: form.mood === m.label ? `0 0 20px ${m.color}40` : 'none',
                    }}
                  >
                    <span style={{ fontSize: 36 }}>{m.emoji}</span>
                    <span style={{
                      color: form.mood === m.label ? m.color : 'rgba(255,255,255,0.7)',
                      fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 15,
                    }}>
                      {m.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                marginTop: 20,
                background: 'rgba(244,63,94,0.15)',
                border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: 12, padding: '12px 16px',
                color: '#fb7185', fontWeight: 700, fontSize: 14,
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            {step > 0 && (
              <button
                className="btn-secondary"
                onClick={() => setStep(s => s - 1)}
                style={{ flex: 1, padding: '16px' }}
              >
                ← Back
              </button>
            )}
            {step < 2 ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                onClick={handleNext}
                disabled={!canNext()}
                style={{
                  flex: 2, justifyContent: 'center', padding: '16px',
                  opacity: canNext() ? 1 : 0.4,
                }}
              >
                Next Step →
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                onClick={handleGenerate}
                disabled={loading || !canNext()}
                style={{
                  flex: 2, justifyContent: 'center', padding: '16px',
                  fontSize: 18, opacity: canNext() ? 1 : 0.4,
                }}
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      style={{ display: 'inline-block' }}
                    >
                      ✨
                    </motion.span>
                    Creating magic...
                  </>
                ) : '🌙 Create My Story!'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
