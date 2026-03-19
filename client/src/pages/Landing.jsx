import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const floatingEmojis = [
  { emoji: '⭐', x: '10%', y: '20%', delay: 0 },
  { emoji: '🌟', x: '85%', y: '15%', delay: 0.5 },
  { emoji: '🦋', x: '5%',  y: '60%', delay: 1 },
  { emoji: '🌈', x: '90%', y: '55%', delay: 1.5 },
  { emoji: '☁️', x: '20%', y: '80%', delay: 0.8 },
  { emoji: '🦄', x: '75%', y: '78%', delay: 0.3 },
  { emoji: '✨', x: '50%', y: '10%', delay: 1.2 },
  { emoji: '🌙', x: '40%', y: '85%', delay: 0.7 },
];

const features = [
  { icon: '🤖', title: 'AI Magic', desc: 'Powered by Llama AI to create unique stories every night' },
  { icon: '🎨', title: 'Personalised', desc: 'Stories with your child\'s name and favourite animal' },
  { icon: '🔊', title: 'Read Aloud', desc: 'Calming voice narration to help little ones drift off' },
  { icon: '📚', title: 'Story Archive', desc: 'Save all your favourite bedtime adventures forever' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80 }}>
      {/* Floating background emojis */}
      {floatingEmojis.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ delay: item.delay, duration: 0.5 }}
          style={{
            position: 'fixed', left: item.x, top: item.y,
            fontSize: 40, pointerEvents: 'none', zIndex: 0,
            animation: `float ${4 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Hero */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '80px 24px 60px',
      }}>
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ fontSize: 100, marginBottom: 24 }}
          className="float"
        >
          🌙
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 96px)',
            lineHeight: 1.1,
            marginBottom: 16,
            background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Dream Builder
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: 22, color: 'rgba(255,255,255,0.7)',
            maxWidth: 520, lineHeight: 1.6, marginBottom: 40,
            fontWeight: 600,
          }}
        >
          Magical AI bedtime stories personalised for your little one 🌟
          Every night is a new adventure!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button
            className="btn-primary"
            onClick={() => navigate(user ? '/create' : '/auth')}
            style={{ fontSize: 20, padding: '18px 40px' }}
          >
            ✨ Create a Story
          </button>
          {user && (
            <button
              className="btn-secondary"
              onClick={() => navigate('/archive')}
              style={{ fontSize: 18, padding: '18px 36px' }}
            >
              📚 My Stories
            </button>
          )}
        </motion.div>

        {/* Sample story preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="glass-card"
          style={{
            marginTop: 60, maxWidth: 560, padding: '32px 36px',
            textAlign: 'left', position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute', top: -16, left: 28,
            background: 'linear-gradient(135deg, var(--violet), var(--pink))',
            borderRadius: 50, padding: '6px 18px',
            fontSize: 13, fontWeight: 800, letterSpacing: 1,
          }}>
            ✨ SAMPLE STORY
          </div>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.8,
            color: 'rgba(255,255,255,0.85)', fontStyle: 'italic',
          }}>
            "Once upon a time, little <strong style={{ color: 'var(--yellow)' }}>Aanya</strong> met
            a tiny <strong style={{ color: 'var(--mint)' }}>bunny</strong> named Luna in a magical
            meadow filled with glowing flowers. Luna had the softest ears and the kindest eyes, and
            she whispered secret bedtime songs to the stars. Together they danced under the moonlight
            until Aanya felt her eyes grow heavy and warm. Luna tucked her in with a gentle nuzzle,
            and Aanya drifted off to the most beautiful dreams... 🌙"
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginTop: 20, color: 'var(--lavender)', fontWeight: 700, fontSize: 14,
          }}>
            <span>🤖</span> Generated by Llama AI on Groq • Personalised just for you
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1100, margin: '0 auto', padding: '40px 24px 100px',
      }}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontFamily: 'var(--font-display)', fontSize: 40,
            textAlign: 'center', marginBottom: 48,
            color: 'var(--lavender)',
          }}
        >
          Why Kids Love It 💜
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04, y: -4 }}
              className="glass-card"
              style={{ padding: '32px 28px', textAlign: 'center', cursor: 'default' }}
            >
              <div style={{ fontSize: 52, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 24,
                color: 'var(--lavender)', marginBottom: 10,
              }}>
                {f.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, fontSize: 16 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
