import { Navigate, Route, Routes } from 'react-router-dom';
import { useStore } from './store';
import LoginPage from './components/LoginPage';
import AppLayout from './components/AppLayout';

export default function App() {
  const user = useStore(s => s.user);
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/app" /> : <LoginPage />} />
      <Route path="/app" element={user ? <AppLayout /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={user ? '/app' : '/login'} />} />
    </Routes>
  );
}
