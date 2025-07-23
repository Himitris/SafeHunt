// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AuthGuard } from "./components/auth/AuthGuard";
import { Header } from "./components/layout/Header";
import { Home } from "./pages/Home";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Profile } from "./pages/Profile";
import { AdminPanel } from "./pages/AdminPanel";
import { Dashboard } from "./pages/Dashboard";
import { MapView } from "./pages/MapView";
// Import des autres pages à venir
// import { MapView } from './pages/MapView';
// import { Dashboard } from './pages/Dashboard';

// Composant pour gérer l'affichage avec loading
const AppContent = () => {
  const { loading } = useAuth();

  // Afficher le loading pendant la vérification de l'auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <AuthGuard requireAuth={false}>
              <Login />
            </AuthGuard>
          }
        />
        <Route
          path="/register"
          element={
            <AuthGuard requireAuth={false}>
              <Register />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard requireAuth={true}>
              <Profile />
            </AuthGuard>
          }
        />
        <Route path="/map" element={<MapView />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard requireAuth={true}>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthGuard requireAuth={true} requireAdmin={true}>
              <AdminPanel />
            </AuthGuard>
          }
        />
        {/* Routes à ajouter plus tard */}
        {/* <Route path="/map" element={<MapView />} /> */}
        {/* <Route 
          path="/dashboard" 
          element={
            <AuthGuard requireAuth={true}>
              <Dashboard />
            </AuthGuard>
          } 
        /> */}
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
