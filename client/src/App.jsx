import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import StoryForm from './pages/StoryForm';
import StoryViewer from './pages/StoryViewer';
import Archive from './pages/Archive';
import Navbar from './components/Navbar';

// Logged-in users get redirected AWAY from /auth to /create
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/create" replace /> : children;
}

// Guests get redirected AWAY from protected pages to /auth
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={
            <PublicRoute><Auth /></PublicRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute><StoryForm /></ProtectedRoute>
          } />
          <Route path="/story" element={
            <ProtectedRoute><StoryViewer /></ProtectedRoute>
          } />
          <Route path="/archive" element={
            <ProtectedRoute><Archive /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}