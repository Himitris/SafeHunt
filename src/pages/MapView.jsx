// src/pages/MapView.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Filter,
  RefreshCw,
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  Target,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useZones } from "../hooks/useZones";
import { HuntingMap } from "../components/map/HuntingMap";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export const MapView = () => {
  const { isAuthenticated, canCreateZones } = useAuth();
  const { zones, loading } = useZones();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showZoneCreator, setShowZoneCreator] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    status: "active",
    timeRange: "all",
  });

  // Vérifier si on doit ouvrir le créateur de zone
  useEffect(() => {
    if (searchParams.get("create") === "true" && canCreateZones) {
      setShowZoneCreator(true);
    }
  }, [searchParams, canCreateZones]);

  // Filtrer les zones
  const filteredZones = zones.filter((zone) => {
    const now = new Date();
    const start = new Date(zone.start);
    const end = new Date(zone.end);
    const isActive = now >= start && now <= end;
    const isUpcoming = start > now;
    const isExpired = end < now;

    // Filtre par statut
    if (filters.status === "active" && !isActive) return false;
    if (filters.status === "upcoming" && !isUpcoming) return false;
    if (filters.status === "expired" && !isExpired) return false;

    // Filtre par type
    if (filters.type !== "all" && zone.type !== filters.type) return false;

    // Filtre par période
    if (filters.timeRange === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (!(start >= today && start < tomorrow)) return false;
    } else if (filters.timeRange === "week") {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      if (!(start <= weekFromNow)) return false;
    }
    return true;
  });

  const getActiveZonesCount = () => {
    const now = new Date();
    return zones.filter((zone) => {
      const start = new Date(zone.start);
      const end = new Date(zone.end);
      return now >= start && now <= end;
    }).length;
  };

  const getUpcomingZonesCount = () => {
    const now = new Date();
    return zones.filter((zone) => new Date(zone.start) > now).length;
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleZoneCreated = () => {
    setShowZoneCreator(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-green-600" />
              SafeHunt - Carte interactive
            </h1>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-600 rounded-full opacity-60"></div>
                <span className="text-gray-600">
                  {getActiveZonesCount()} actives
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full opacity-60"></div>
                <span className="text-gray-600">
                  {getUpcomingZonesCount()} à venir
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-gray-100" : ""}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            {isAuthenticated && canCreateZones && (
              <Button
                size="sm"
                onClick={() => setShowZoneCreator(!showZoneCreator)}
                className={showZoneCreator ? "bg-green-700" : ""}
              >
                <Target className="w-4 h-4 mr-2" />
                {showZoneCreator ? "Fermer" : "Créer une zone"}
              </Button>
            )}
            {loading && (
              <div className="flex items-center text-gray-600">
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                <span className="text-sm">Actualisation...</span>
              </div>
            )}
          </div>
        </div>
        {showFilters && (
          <div className="max-w-7xl mx-auto mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut des zones
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  <option value="all">Toutes</option>
                  <option value="active">Actives uniquement</option>
                  <option value="upcoming">À venir</option>
                  <option value="expired">Terminées</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de chasse
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  <option value="all">Tous types</option>
                  <option value="battue">Battue</option>
                  <option value="approche">Approche</option>
                  <option value="affût">Affût</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période
                </label>
                <select
                  value={filters.timeRange}
                  onChange={(e) =>
                    handleFilterChange("timeRange", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  <option value="all">Toutes périodes</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredZones.length} zone
                {filteredZones.length !== 1 ? "s" : ""} affiché
                {filteredZones.length !== 1 ? "s" : "e"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters({
                    type: "all",
                    status: "active",
                    timeRange: "all",
                  })
                }
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="flex-1 relative">
        {!isAuthenticated && (
          <div className="absolute top-4 left-4 right-4 z-[1000]">
            <Card className="bg-blue-50 border-blue-200">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-blue-800 font-medium">
                    Consultation libre
                  </p>
                  <p className="text-blue-700 text-sm">
                    Créez un compte chasseur pour signaler vos zones de chasse
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
        {isAuthenticated && !canCreateZones && (
          <div className="absolute top-4 left-4 right-4 z-[1000]">
            <Card className="bg-orange-50 border-orange-200">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-orange-600 mr-3" />
                <div>
                  <p className="text-orange-800 font-medium">
                    Certification requise
                  </p>
                  <p className="text-orange-700 text-sm">
                    Seuls les chasseurs certifiés et les administrateurs peuvent
                    créer des zones
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <HuntingMap
          showZoneCreator={showZoneCreator}
          onZoneCreated={handleZoneCreated}
          zones={filteredZones}
        />

        {filteredZones.length > 0 && (
          <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-200px)] overflow-y-auto z-[500]">
            <Card
              title={`Zones ${
                filters.status === "active"
                  ? "actives"
                  : filters.status === "upcoming"
                  ? "à venir"
                  : "affichées"
              }`}
            >
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredZones.slice(0, 10).map((zone) => {
                  const now = new Date();
                  const start = new Date(zone.start);
                  const end = new Date(zone.end);
                  const isActive = now >= start && now <= end;
                  const isUpcoming = start > now;

                  return (
                    <div
                      key={zone.id}
                      className={`p-3 rounded-lg border ${
                        isActive
                          ? "border-red-200 bg-red-50"
                          : isUpcoming
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${
                            isActive
                              ? "bg-red-100 text-red-800"
                              : isUpcoming
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {zone.type}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            isActive
                              ? "text-red-700"
                              : isUpcoming
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {isActive
                            ? "ACTIVE"
                            : isUpcoming
                            ? "À VENIR"
                            : "TERMINÉE"}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>
                            {start.toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-3 h-3 mr-1"></span>
                          <span>
                            →{" "}
                            {end.toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      {zone.description && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                          {zone.description}
                        </p>
                      )}
                    </div>
                  );
                })}

                {filteredZones.length > 10 && (
                  <div className="text-center py-2">
                    <p className="text-xs text-gray-500">
                      ... et {filteredZones.length - 10} autres zones
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {!loading && !showZoneCreator && filteredZones.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-[500] pointer-events-none">
            <div className="pointer-events-auto">
              <Card className="max-w-md mx-4">
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune zone trouvée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {filters.status === "active"
                      ? "Aucune zone de chasse n'est actuellement active dans votre zone d'affichage."
                      : "Aucune zone ne correspond à vos critères de recherche."}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        type: "all",
                        status: "active",
                        timeRange: "all",
                      })
                    }
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
