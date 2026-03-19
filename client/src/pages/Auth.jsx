import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/create');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '100px 24px 40px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: 460, padding: '48px 40px' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            style={{ fontSize: 72, marginBottom: 16 }}
          >
            {isLogin ? '🌙' : '⭐'}
          </motion.div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 36,
            background: 'linear-gradient(135deg, var(--lavender), var(--pink))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', marginBottom: 8,
          }}>
            {isLogin ? 'Welcome Back!' : 'Join the Magic!'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: 600 }}>
            {isLogin ? 'Sign in to create bedtime stories' : 'Start creating magical stories today'}
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.06)',
          borderRadius: 50, padding: 4, marginBottom: 32,
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
         {['Login', 'Register'].map((tab, i) => (
  <button
    key={tab}
    onClick={() => { setIsLogin(i === 0); setError(''); }}
    style={{
      flex: 1, padding: '12px', borderRadius: 50, border: 'none',
      fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 800,
      cursor: 'pointer',
      transition: 'all 0.3s',
      background: (isLogin ? i === 0 : i === 1)
        ? 'linear-gradient(135deg, var(--violet), var(--pink))'
        : 'transparent',
      color: (isLogin ? i === 0 : i === 1) ? 'white' : 'rgba(255,255,255,0.45)',
    }}
  >
    {tab}
  </button>
))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: 'var(--lavender)', fontSize: 14 }}>
                  Your Name 👋
                </label>
                <input
                  className="dream-input"
                  placeholder="e.g. Sarah"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: 'var(--lavender)', fontSize: 14 }}>
              Email Address 📧
            </label>
            <input
              className="dream-input"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: 'var(--lavender)', fontSize: 14 }}>
              Password 🔒
            </label>
            <input
              className="dream-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: 'rgba(244,63,94,0.15)',
                border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: 12, padding: '12px 16px',
                color: '#fb7185', fontWeight: 700, fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, fontSize: 18, padding: '18px' }}
          >
            {loading
              ? <><span style={{ animation: 'spin-slow 1s linear infinite', display: 'inline-block' }}>✨</span> Please wait...</>
              : isLogin ? '🌙 Sign In' : '⭐ Create Account'
            }
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600 }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{
              background: 'none', border: 'none', color: 'var(--lavender)',
              cursor: 'pointer', fontWeight: 800, fontSize: 14, fontFamily: 'var(--font-body)',
            }}
          >
            {isLogin ? 'Register here ✨' : 'Login here 🌙'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
