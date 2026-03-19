import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import StoryForm from './pages/StoryForm';
import StoryViewer from './pages/StoryViewer';
import Archive from './pages/Archive';
import Navbar from './components/Navbar';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"        element={<Landing />} />
          <Route path="/auth"    element={<Auth />} />
          <Route path="/create"  element={<ProtectedRoute><StoryForm /></ProtectedRoute>} />
          <Route path="/story"   element={<ProtectedRoute><StoryViewer /></ProtectedRoute>} />
          <Route path="/archive" element={<ProtectedRoute><Archive /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
