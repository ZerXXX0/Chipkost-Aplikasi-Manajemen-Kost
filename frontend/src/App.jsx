import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Fitur from './pages/Fitur';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import PenyewaDashboard from './pages/penyewa/PenyewaDashboard';
import DesignSystemExample from './components/DesignSystemExample';
import UsersPage from './pages/admin/UsersPage';
import RoomsPage from './pages/admin/RoomsPage';
import KosDetailPage from './pages/admin/KosDetailPage';
import ComplaintsPage from './pages/admin/ComplaintsPage';
import FinancialPage from './pages/admin/FinancialPage';
import PenyewaComplaintsPage from './pages/penyewa/ComplaintsPage';
import PaymentsPage from './pages/penyewa/PaymentsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/fitur" element={<Fitur />} />
          <Route path="/design-system" element={<DesignSystemExample />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/fitur"
            element={
              <PrivateRoute requiredRole="admin">
                <Fitur />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/fitur/register"
            element={
              <PrivateRoute requiredRole="admin">
                <UsersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/fitur/users"
            element={
              <PrivateRoute requiredRole="admin">
                <UsersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/fitur/rooms"
            element={
              <PrivateRoute requiredRole="admin">
                <RoomsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/fitur/rooms/:kosId"
            element={
              <PrivateRoute requiredRole="admin">
                <KosDetailPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/fitur/complaints"
            element={
              <PrivateRoute requiredRole="admin">
                <ComplaintsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/fitur/financial"
            element={
              <PrivateRoute requiredRole="admin">
                <FinancialPage />
              </PrivateRoute>
            }
          />

          {/* Penyewa Routes */}
          <Route
            path="/penyewa"
            element={
              <PrivateRoute requiredRole="penyewa">
                <PenyewaDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/penyewa/fitur"
            element={
              <PrivateRoute requiredRole="penyewa">
                <Fitur />
              </PrivateRoute>
            }
          />

          <Route
            path="/penyewa/fitur/complaints"
            element={
              <PrivateRoute requiredRole="penyewa">
                <PenyewaComplaintsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/penyewa/fitur/payments"
            element={
              <PrivateRoute requiredRole="penyewa">
                <PaymentsPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
