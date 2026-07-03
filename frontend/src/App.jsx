import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/global.css';

import LandingPage     from './pages/LandingPage';
import Home            from './pages/Home';
import Login           from './pages/Login';
import Signup          from './pages/Signup';
import Buy             from './pages/Buy';
import Rent            from './pages/Rent';
import PropertyDetails from './pages/PropertyDetails';
import Sell            from './pages/Sell';
import AddRent         from './pages/AddRent';
import SearchResults   from './pages/SearchResults';
import Profile         from './pages/Profile';
import MyProperties    from './pages/MyProperties';
import UpdateProperty  from './pages/UpdateProperty';
import Inbox           from './pages/Inbox';
import Chat            from './pages/Chat';
import About           from './pages/About';
import Blogs           from './pages/Blogs';
import Agents          from './pages/Agents';
import Contact         from './pages/Contact';
import Privacy         from './pages/Privacy';
import Terms           from './pages/Terms';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/home" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"        element={<LandingPage />} />
          <Route path="/login"   element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/signup"  element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
          <Route path="/about"   element={<About />} />
          <Route path="/blogs"   element={<Blogs />} />
          <Route path="/agents"  element={<Agents />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms"   element={<Terms />} />

          {/* Protected */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/buy"  element={<ProtectedRoute><Buy /></ProtectedRoute>} />
          <Route path="/rent" element={<ProtectedRoute><Rent /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
          <Route path="/property/:id" element={<ProtectedRoute><PropertyDetails /></ProtectedRoute>} />
          <Route path="/sell"     element={<ProtectedRoute><Sell /></ProtectedRoute>} />
          <Route path="/add-rent" element={<ProtectedRoute><AddRent /></ProtectedRoute>} />
          <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />
          <Route path="/update-property/:id" element={<ProtectedRoute><UpdateProperty /></ProtectedRoute>} />
          <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
          <Route path="/chat/:propertyId/:receiverId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
