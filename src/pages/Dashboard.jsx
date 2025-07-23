// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Target,
  Users,
  Shield,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useZones } from "../hooks/useZones";
import {
  deleteZone,
  isZoneActive,
  getZoneTimeRemaining,
} from "../services/zones";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export const Dashboard = () => {
  const { user, userData, isHunter, isCertified, isAdmin, canCreateZones } =
    useAuth();
  const { zones, loading, error } = useZones(isHunter ? user?.uid : null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleDeleteZone = async (zoneId) => {
    const { error } = await deleteZone(zoneId);

    if (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de la suppression de la zone",
      });
    } else {
      setMessage({ type: "success", text: "Zone supprimée avec succès !" });
    }

    setShowDeleteConfirm(null);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getZoneStatusColor = (zone) => {
    if (!isZoneActive(zone)) {
      return "text-gray-500 bg-gray-50";
    }

    switch (zone.type?.toLowerCase()) {
      case "battue":
        return "text-red-700 bg-red-50";
      case "approche":
        return "text-orange-700 bg-orange-50";
      case "affût":
        return "text-purple-700 bg-purple-50";
      default:
        return "text-green-700 bg-green-50";
    }
  };

  const getActiveZones = () => zones.filter((zone) => isZoneActive(zone));
  const getUpcomingZones = () =>
    zones.filter((zone) => new Date(zone.start) > new Date());
  const getExpiredZones = () =>
    zones.filter((zone) => new Date(zone.end) < new Date());

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">
            Bonjour {userData?.displayName || user?.email} !
            {isHunter && (
              <span
                className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  isCertified
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {isCertified ? "Chasseur certifié" : "Certification en attente"}
              </span>
            )}
          </p>
        </div>

        {/* Messages */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-md flex items-center ${
              message.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            )}
            <p
              className={
                message.type === "success" ? "text-green-800" : "text-red-800"
              }
            >
              {message.text}
            </p>
          </div>
        )}

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/map">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">
                    Consulter la carte
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Voir toutes les zones actives
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          {canCreateZones && (
            <Link to="/map?create=true">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">
                      Créer une zone
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Signaler une nouvelle chasse
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">
                      Administration
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Gérer les utilisateurs
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          )}
        </div>

        {/* Contenu selon le rôle */}
        {!isHunter && !isAdmin ? (
          // Vue randonneur
          <div className="space-y-6">
            <Card title="Bienvenue sur Zones de Chasse">
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Compte Randonneur
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Votre compte vous permet de consulter en temps réel les zones
                  de chasse actives pour planifier vos sorties en toute
                  sécurité.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/map">
                    <Button className="w-full sm:w-auto">
                      <MapPin className="w-4 h-4 mr-2" />
                      Consulter la carte
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Modifier mon profil
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        ) : isAdmin ? (
          // Vue administrateur avec zones
          <div className="space-y-8">
            {/* Message admin */}
            <Card>
              <div className="text-center py-8">
                <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Compte Administrateur
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  En tant qu'administrateur, vous avez accès à tous les outils
                  de gestion et vous pouvez également créer des zones de chasse.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/admin">
                    <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
                      <Shield className="w-4 h-4 mr-2" />
                      Panel d'administration
                    </Button>
                  </Link>
                  <Link to="/map?create=true">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une zone
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Statistiques admin */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {getActiveZones().length}
                </h3>
                <p className="text-gray-600">Zones actives</p>
              </Card>

              <Card className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {getUpcomingZones().length}
                </h3>
                <p className="text-gray-600">À venir</p>
              </Card>

              <Card className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <CheckCircle className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {getExpiredZones().length}
                </h3>
                <p className="text-gray-600">Terminées</p>
              </Card>

              <Card className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <MapPin className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {zones.length}
                </h3>
                <p className="text-gray-600">Total créées</p>
              </Card>
            </div>

            {/* Mes zones (admin) */}
            <Card title="Mes zones de chasse">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
              ) : zones.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune zone créée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Créez votre première zone de chasse sur la carte
                  </p>
                  <Link to="/map?create=true">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une zone
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {zones.map((zone) => {
                    const active = isZoneActive(zone);
                    const upcoming = new Date(zone.start) > new Date();
                    const expired = new Date(zone.end) < new Date();

                    return (
                      <div
                        key={zone.id}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          active
                            ? "border-green-200 bg-green-50"
                            : upcoming
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${getZoneStatusColor(
                                zone
                              )}`}
                            >
                              {active ? (
                                <AlertTriangle className="w-6 h-6" />
                              ) : upcoming ? (
                                <Clock className="w-6 h-6" />
                              ) : (
                                <CheckCircle className="w-6 h-6" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900 capitalize">
                                  {zone.type}
                                </h3>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                                    active
                                      ? "bg-green-100 text-green-800"
                                      : upcoming
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {active
                                    ? "ACTIVE"
                                    : upcoming
                                    ? "À VENIR"
                                    : "TERMINÉE"}
                                </span>
                              </div>

                              <div className="text-sm text-gray-600 mt-1">
                                <div>Début: {formatDate(zone.start)}</div>
                                <div>Fin: {formatDate(zone.end)}</div>
                                {active && (
                                  <div className="font-medium text-green-700">
                                    Temps restant: {getZoneTimeRemaining(zone)}
                                  </div>
                                )}
                              </div>

                              {zone.description && (
                                <p className="text-sm text-gray-600 mt-2 max-w-md">
                                  {zone.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedZone(zone)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setShowDeleteConfirm(zone.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        ) : !isCertified ? (
          // Vue chasseur non certifié
          <div className="space-y-6">
            <Card>
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Compte en attente de certification
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Votre compte chasseur a été créé avec succès ! Un
                  administrateur doit maintenant valider votre certification
                  avant que vous puissiez créer des zones de chasse.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-md p-4 max-w-md mx-auto">
                  <p className="text-orange-800 text-sm">
                    <strong>Prochaines étapes :</strong>
                    <br />
                    • Un administrateur va examiner votre demande
                    <br />
                    • Vous recevrez une notification une fois certifié
                    <br />• Vous pourrez alors créer des zones de chasse
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Vue chasseur certifié
          <div className="space-y-8">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {getActiveZones().length}
                </h3>
                <p className="text-gray-600">Zones actives</p>
              </Card>

              <Card className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {getUpcomingZones().length}
                </h3>
                <p className="text-gray-600">À venir</p>
              </Card>

              <Card className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <CheckCircle className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {getExpiredZones().length}
                </h3>
                <p className="text-gray-600">Terminées</p>
              </Card>

              <Card className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <MapPin className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {zones.length}
                </h3>
                <p className="text-gray-600">Total créées</p>
              </Card>
            </div>

            {/* Mes zones */}
            <Card title="Mes zones de chasse">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">
                    Erreur lors du chargement des zones
                  </p>
                </div>
              ) : zones.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune zone créée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Créez votre première zone de chasse sur la carte
                  </p>
                  <Link to="/map?create=true">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une zone
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {zones.map((zone) => {
                    const active = isZoneActive(zone);
                    const upcoming = new Date(zone.start) > new Date();
                    const expired = new Date(zone.end) < new Date();

                    return (
                      <div
                        key={zone.id}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          active
                            ? "border-green-200 bg-green-50"
                            : upcoming
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${getZoneStatusColor(
                                zone
                              )}`}
                            >
                              {active ? (
                                <AlertTriangle className="w-6 h-6" />
                              ) : upcoming ? (
                                <Clock className="w-6 h-6" />
                              ) : (
                                <CheckCircle className="w-6 h-6" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900 capitalize">
                                  {zone.type}
                                </h3>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                                    active
                                      ? "bg-green-100 text-green-800"
                                      : upcoming
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {active
                                    ? "ACTIVE"
                                    : upcoming
                                    ? "À VENIR"
                                    : "TERMINÉE"}
                                </span>
                              </div>

                              <div className="text-sm text-gray-600 mt-1">
                                <div>Début: {formatDate(zone.start)}</div>
                                <div>Fin: {formatDate(zone.end)}</div>
                                {active && (
                                  <div className="font-medium text-green-700">
                                    Temps restant: {getZoneTimeRemaining(zone)}
                                  </div>
                                )}
                              </div>

                              {zone.description && (
                                <p className="text-sm text-gray-600 mt-2 max-w-md">
                                  {zone.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedZone(zone)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setShowDeleteConfirm(zone.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirmer la suppression
              </h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer cette zone de chasse ? Cette
                action est irréversible.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="danger"
                  onClick={() => handleDeleteZone(showDeleteConfirm)}
                  className="flex-1"
                >
                  Supprimer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
