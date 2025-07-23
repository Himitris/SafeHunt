// src/components/layout/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, MapPin, Settings, Shield } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../services/auth";
import { Button } from "../ui/Button";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, userData, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
    setIsProfileOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <header className="bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 shadow-2xl border-b border-emerald-700 sticky top-0 z-[9998] backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo avec animation */}
          <div className="flex items-center group">
            <Link
              to="/"
              className="flex items-center space-x-3 transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:rotate-6 group-hover:shadow-emerald-500/25">
                  <MapPin className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-white tracking-tight">
                  Safe
                </span>
                <span className="font-light text-emerald-200 ml-1">Hunt</span>
              </div>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/map"
              className="relative px-4 py-2 text-emerald-100 hover:text-white rounded-xl font-medium transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm group"
            >
              <span className="relative z-10">Carte</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 rounded-xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="relative px-4 py-2 text-emerald-100 hover:text-white rounded-xl font-medium transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm group"
                >
                  <span className="relative z-10">Tableau de bord</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 rounded-xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Link>

                {/* Lien Admin avec badge spécial */}
                {userData?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="relative px-4 py-2 text-red-200 hover:text-red-100 rounded-xl font-medium transition-all duration-300 hover:bg-red-500/20 hover:backdrop-blur-sm group"
                  >
                    <span className="relative z-10 flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      Admin
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 rounded-xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </Link>
                )}

                {/* Menu profil avec avatar */}
                <div className="relative ml-4">
                  <button
                    onClick={toggleProfile}
                    className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                      {(userData?.displayName ||
                        user?.email)?.[0]?.toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-white text-sm font-medium">
                        {userData?.displayName || user?.email?.split("@")[0]}
                      </div>
                      {userData?.role === "chasseur" && (
                        <div
                          className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                            userData?.certified
                              ? "bg-emerald-400/20 text-emerald-200"
                              : "bg-orange-400/20 text-orange-200"
                          }`}
                        >
                          {userData?.certified ? "✓ Certifié" : "⏳ En attente"}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Dropdown menu amélioré */}
                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                              {(userData?.displayName ||
                                user?.email)?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {userData?.displayName || "Utilisateur"}
                              </div>
                              <div className="text-sm text-gray-600">
                                {user?.email}
                              </div>
                              {userData?.role === "chasseur" && (
                                <div
                                  className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                                    userData?.certified
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-orange-100 text-orange-800"
                                  }`}
                                >
                                  {userData?.certified
                                    ? "✓ Chasseur certifié"
                                    : "⏳ Certification en attente"}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="w-5 h-5 mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                            <span className="font-medium">
                              Paramètres du compte
                            </span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 group"
                          >
                            <LogOut className="w-5 h-5 mr-3 text-gray-400 group-hover:text-red-500 transition-colors" />
                            <span className="font-medium">Se déconnecter</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-300 text-emerald-100 hover:bg-emerald-400 hover:text-white hover:border-emerald-400 transition-all duration-300"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Créer un compte
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Menu burger mobile amélioré */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-emerald-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 transform transition-all duration-300 ${
                    isMenuOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
                  }`}
                />
                <X
                  className={`absolute inset-0 transform transition-all duration-300 ${
                    isMenuOpen
                      ? "rotate-0 opacity-100"
                      : "-rotate-180 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Menu mobile amélioré */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2 border-t border-emerald-700 mt-4">
            <Link
              to="/map"
              className="block px-4 py-3 text-emerald-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              📍 Voir la carte
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-3 text-emerald-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📊 Tableau de bord
                </Link>

                {userData?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-3 text-red-200 hover:text-red-100 hover:bg-red-500/20 rounded-xl transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🛡️ Administration
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="block px-4 py-3 text-emerald-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ⚙️ Paramètres
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-emerald-100 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-300 font-medium"
                >
                  🚪 Se déconnecter
                </button>

                {/* Info utilisateur mobile */}
                <div className="px-4 py-3 text-sm bg-white/5 rounded-xl mt-4 border border-emerald-700">
                  <div className="text-emerald-200">Connecté en tant que:</div>
                  <div className="font-medium text-white">
                    {userData?.displayName || user?.email}
                  </div>
                  {userData?.role === "chasseur" && (
                    <div
                      className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                        userData?.certified
                          ? "bg-emerald-400/20 text-emerald-200"
                          : "bg-orange-400/20 text-orange-200"
                      }`}
                    >
                      {userData?.certified
                        ? "✓ Chasseur certifié"
                        : "⏳ Certification en attente"}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="px-4 py-2 space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center py-3 bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white rounded-xl transition-all duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Créer un compte
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
