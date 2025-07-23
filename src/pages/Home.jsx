// src/pages/Home.jsx
import { Link } from "react-router-dom";
import {
  MapPin,
  Shield,
  Users,
  Clock,
  ArrowRight,
  Zap,
  Eye,
  Target,
} from "lucide-react";
import { Button } from "../components/ui/Button";

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      {/* Animations de fond */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in">
              <Zap className="w-4 h-4 mr-2" />
              Plateforme temps réel
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight animate-fade-in-up">
              <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent">
                Zones de Chasse
              </span>
              <br />
              <span className="text-3xl md:text-5xl font-normal text-gray-300">
                Sécurité partagée
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              La première plateforme collaborative qui révolutionne la
              cohabitation entre chasseurs et randonneurs grâce au partage temps
              réel des zones de chasse actives.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-300">
              <Link to="/map">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Eye className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  Explorer la carte
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  Rejoindre maintenant
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  24/7
                </div>
                <div className="text-gray-300">Surveillance temps réel</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  100%
                </div>
                <div className="text-gray-300">Gratuit et libre</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  🇫🇷
                </div>
                <div className="text-gray-300">Couverture nationale</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-gradient-to-b from-transparent to-slate-900/50 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comment ça{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                fonctionne
              </span>{" "}
              ?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Trois profils, une mission : partager l'espace naturel en toute
              sécurité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pour les chasseurs */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-8 rounded-3xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Pour les chasseurs
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Signalez vos zones de chasse en quelques clics. Interface
                  intuitive, géolocalisation précise, gestion complète de vos
                  sessions.
                </p>
                <ul className="space-y-3 text-emerald-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    Création rapide par dessin ou clic
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    Gestion automatique des horaires
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    Certification sécurisée
                  </li>
                </ul>
              </div>
            </div>

            {/* Pour les randonneurs */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-8 rounded-3xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Pour les randonneurs
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Consultez la carte interactive pour planifier vos sorties.
                  Évitez les zones actives, randonnez l'esprit tranquille.
                </p>
                <ul className="space-y-3 text-blue-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Informations temps réel
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Interface mobile optimisée
                  </li>
                </ul>
              </div>
            </div>

            {/* Temps réel */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-8 rounded-3xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Technologie avancée
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Synchronisation instantanée, géolocalisation précise, gestion
                  automatique des zones expirées.
                </p>
                <ul className="space-y-3 text-orange-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Mise à jour automatique
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Suppression auto des zones expirées
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Notifications intelligentes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-12 border border-emerald-500/20 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à révolutionner vos{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                sorties nature
              </span>{" "}
              ?
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Rejoignez des milliers d'utilisateurs qui ont déjà adopté la
              sécurité collaborative. Gratuit, simple, efficace.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Link to="/register">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Shield className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  Créer mon compte chasseur
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Button>
              </Link>
              <Link to="/map">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white px-10 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <MapPin className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  Explorer d'abord
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-400">
              ✨ Aucune carte de crédit requise • 🔒 100% sécurisé • 🇫🇷 Données
              françaises
            </p>
          </div>
        </div>
      </div>

      {/* Footer futuriste */}
      <footer className="relative z-10 bg-gradient-to-t from-slate-900 to-transparent border-t border-emerald-500/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl text-white">Zones</span>
                  <span className="font-light text-emerald-200 ml-1">
                    de Chasse
                  </span>
                </div>
              </div>
              <p className="text-gray-300 max-w-md leading-relaxed mb-6">
                La plateforme collaborative qui réunit chasseurs et randonneurs
                pour une cohabitation sécurisée dans nos espaces naturels.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer">
                  <span className="text-emerald-400">📧</span>
                </div>
                <div className="w-10 h-10 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer">
                  <span className="text-emerald-400">🐦</span>
                </div>
                <div className="w-10 h-10 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer">
                  <span className="text-emerald-400">📘</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6">Navigation</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                  >
                    🏠 Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/map"
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                  >
                    🗺️ Carte interactive
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                  >
                    ✨ S'inscrire
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                  >
                    🔐 Se connecter
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6">Légal & Support</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                  >
                    📞 Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                  >
                    📋 CGU
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                  >
                    🔒 Confidentialité
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                  >
                    ❓ FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-emerald-500/20 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025{" "}
              <span className="text-emerald-400 font-medium">
                Zones de Chasse
              </span>
              . Made with <span className="text-red-400">❤️</span> in France.
              Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        .delay-300 {
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};
