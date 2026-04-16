import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SkillsList from './pages/SkillsList';
import SkillDetail from './pages/SkillDetail';
import SkillForm from './pages/SkillForm';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const InstructorRoute = ({ children }) => {
  const { user } = useAuth();
  return user && (user.role === 'instructor' || user.role === 'admin') ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/skills" element={<SkillsList />} />
        <Route path="/skills/new" element={<InstructorRoute><SkillForm /></InstructorRoute>} />
        <Route path="/skills/:id" element={<SkillDetail />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: "'Outfit', 'Segoe UI', sans-serif" }}>
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}
