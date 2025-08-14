import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './components/user/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root path goes to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Common login/signup routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Catch-all → redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
