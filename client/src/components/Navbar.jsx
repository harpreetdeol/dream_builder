import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px',
        background: 'rgba(15,5,38,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 28 }}>🌙</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--lavender)', letterSpacing: 1 }}>
          Dream Builder
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <>
            <Link to="/create" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: 14 }}>
                ✨ New Story
              </button>
            </Link>
            <Link to="/archive" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: 14 }}>
                📚 Archive
              </button>
            </Link>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 50, padding: '8px 16px',
            }}>
              <span style={{ fontSize: 20 }}>🦸</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--lavender)' }}>
                {user.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)',
                color: 'var(--pink)', borderRadius: 50, padding: '10px 18px',
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '10px 24px', fontSize: 15 }}>
              🌟 Get Started
            </button>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
