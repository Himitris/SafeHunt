// src/components/auth/AuthGuard.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const AuthGuard = ({
  children,
  requireAuth = true,
  requireHunter = false,
  requireCertified = false,
  requireAdmin = false,
}) => {
  const { user, userData, loading } = useAuth();

  // Afficher un loading pendant la vérification de l'auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Vérification de l'authentification...
          </p>
        </div>
      </div>
    );
  }

  // Si l'authentification est requise mais l'utilisateur n'est pas connecté
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté mais ne devrait pas l'être (ex: page de login)
  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si le rôle admin est requis
  if (requireAdmin && userData?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Accès administrateur requis
          </h2>
          <p className="text-gray-600 mb-4">
            Cette page est réservée aux administrateurs.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  // Si le rôle chasseur est requis
  if (requireHunter && userData?.role !== "chasseur") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Accès chasseur requis
          </h2>
          <p className="text-gray-600 mb-4">
            Cette page est réservée aux utilisateurs avec un compte chasseur.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  // Si la certification est requise
  if (requireCertified && !userData?.certified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Certification en attente
          </h2>
          <p className="text-gray-600 mb-4">
            Votre compte chasseur est en attente de validation par un
            administrateur. Vous pourrez créer des zones de chasse une fois
            votre compte certifié.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return children;
};
