import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getStories, toggleFav, deleteStory } from '../api/storyApi';

const ANIMAL_EMOJIS = {
  bunny: '🐰', elephant: '🐘', lion: '🦁', dolphin: '🐬',
  unicorn: '🦄', puppy: '🐶', kitten: '🐱', fox: '🦊',
  bear: '🐻', tiger: '🐯', penguin: '🐧', owl: '🦉',
  dragon: '🐉', cat: '🐱', dog: '🐶', rabbit: '🐰',
};
const getAnimalEmoji = (a) => ANIMAL_EMOJIS[a?.toLowerCase()] || '🐾';

const MOOD_COLORS = {
  Happy: '#fbbf24', Sleepy: '#a78bfa', Excited: '#f472b6',
  Cozy: '#fb923c', Calm: '#34d399', Brave: '#60a5fa',
};

export default function Archive() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data } = await getStories();
      setStories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFav = async (id) => {
    try {
      const { data } = await toggleFav(id);
      setStories(prev => prev.map(s => s._id === id ? data : s));
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this story? 🌙')) return;
    try {
      await deleteStory(id);
      setStories(prev => prev.filter(s => s._id !== id));
    } catch {}
  };

  const handleReadStory = (story) => {
    navigate('/story', {
      state: {
        story: story.content,
        form: { childName: story.childName, animal: story.animal, mood: story.mood }
      }
    });
  };

  const filtered = filter === 'favourites'
    ? stories.filter(s => s.isFavourite)
    : stories;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ minHeight: '100vh', padding: '100px 24px 60px', maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <div style={{ fontSize: 72, marginBottom: 12 }} className="float">📚</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 48,
          background: 'linear-gradient(135deg, var(--lavender), var(--pink))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: 8,
        }}>
          Story Archive
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 17 }}>
          {stories.length} magical {stories.length === 1 ? 'adventure' : 'adventures'} saved
        </p>
      </motion.div>

      {/* Filter + New Story */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}
      >
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.06)',
          borderRadius: 50, padding: 4,
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {[['all', '📖 All Stories'], ['favourites', '⭐ Favourites']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{
                padding: '10px 22px', borderRadius: 50, border: 'none',
                fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.3s',
                background: filter === val
                  ? 'linear-gradient(135deg, var(--violet), var(--pink))'
                  : 'transparent',
                color: filter === val ? 'white' : 'rgba(255,255,255,0.45)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate('/create')}
          style={{ padding: '12px 24px', fontSize: 15 }}
        >
          ✨ New Story
        </button>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.5)' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            style={{ fontSize: 48, display: 'inline-block' }}
          >
            🌙
          </motion.div>
          <p style={{ marginTop: 16, fontWeight: 700 }}>Loading your stories...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card"
          style={{ textAlign: 'center', padding: '80px 40px' }}
        >
          <div style={{ fontSize: 80, marginBottom: 20 }}>🌙</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--lavender)', marginBottom: 12 }}>
            {filter === 'favourites' ? 'No favourites yet!' : 'No stories yet!'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 28, fontWeight: 600 }}>
            {filter === 'favourites' ? 'Save your favourite stories by tapping ⭐' : 'Create your first magical bedtime story!'}
          </p>
          <button className="btn-primary" onClick={() => navigate('/create')}>
            ✨ Create First Story
          </button>
        </motion.div>
      )}

      {/* Story Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
        <AnimatePresence>
          {filtered.map((story, i) => (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.06 }}
              layout
            >
              <div
                className="glass-card"
                style={{
                  padding: '28px', cursor: 'pointer',
                  border: story.isFavourite
                    ? '1px solid rgba(251,191,36,0.4)'
                    : '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {story.isFavourite && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                    padding: '4px 14px 4px 20px',
                    clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)',
                    fontSize: 12, fontWeight: 800, color: '#1a0533',
                  }}>
                    ⭐ FAV
                  </div>
                )}

                {/* Story card header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{
                    fontSize: 48,
                    animation: 'float 4s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                  }}>
                    {getAnimalEmoji(story.animal)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)', fontSize: 22,
                      color: 'white', marginBottom: 4,
                    }}>
                      {story.childName}'s Story
                    </h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{
                        background: 'rgba(167,139,250,0.15)',
                        border: '1px solid rgba(167,139,250,0.25)',
                        borderRadius: 50, padding: '3px 12px',
                        fontSize: 12, fontWeight: 700, color: 'var(--lavender)',
                      }}>
                        🐾 {story.animal}
                      </span>
                      <span style={{
                        background: `${MOOD_COLORS[story.mood] || '#888'}20`,
                        border: `1px solid ${MOOD_COLORS[story.mood] || '#888'}40`,
                        borderRadius: 50, padding: '3px 12px',
                        fontSize: 12, fontWeight: 700,
                        color: MOOD_COLORS[story.mood] || '#aaa',
                      }}>
                        {story.mood}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Story preview */}
                <p
                  onClick={() => setExpanded(expanded === story._id ? null : story._id)}
                  style={{
                    color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.7,
                    fontWeight: 600, marginBottom: 16, cursor: 'pointer',
                    display: '-webkit-box',
                    WebkitLineClamp: expanded === story._id ? 'unset' : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: expanded === story._id ? 'visible' : 'hidden',
                  }}
                >
                  {story.content}
                </p>
                {expanded !== story._id && (
                  <span
                    onClick={() => setExpanded(story._id)}
                    style={{ color: 'var(--lavender)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Read more ↓
                  </span>
                )}

                <div style={{
                  color: 'rgba(255,255,255,0.3)', fontSize: 12,
                  fontWeight: 600, marginBottom: 16,
                }}>
                  📅 {formatDate(story.createdAt)}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleReadStory(story)}
                    style={{
                      flex: 2, padding: '12px', borderRadius: 50, border: 'none',
                      background: 'linear-gradient(135deg, var(--violet), var(--pink))',
                      color: 'white', cursor: 'pointer',
                      fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 14,
                    }}
                  >
                    🔊 Read Story
                  </button>
                  <button
                    onClick={() => handleToggleFav(story._id)}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 50,
                      border: '1px solid rgba(251,191,36,0.3)',
                      background: story.isFavourite ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)',
                      color: story.isFavourite ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 14,
                      transition: 'all 0.2s',
                    }}
                  >
                    {story.isFavourite ? '⭐' : '☆'}
                  </button>
                  <button
                    onClick={() => handleDelete(story._id)}
                    style={{
                      padding: '12px 14px', borderRadius: 50,
                      border: '1px solid rgba(244,63,94,0.2)',
                      background: 'rgba(244,63,94,0.08)',
                      color: 'rgba(251,113,133,0.6)',
                      cursor: 'pointer', fontSize: 16,
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
