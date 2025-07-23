// src/components/map/HuntingMap.jsx
import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
  useMap,
} from "react-leaflet";
import { Icon } from "leaflet";
import { MapPin, Clock, User, AlertTriangle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useZones } from "../../hooks/useZones";
import { ZoneCreator } from "./ZoneCreator";

// Icônes personnalisées pour Leaflet
const huntingIcon = new Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Composant pour centrer la carte sur la géolocalisation
const LocationMarker = ({ position, setPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Votre position actuelle</Popup>
    </Marker>
  );
};

export const HuntingMap = ({
  showZoneCreator = false,
  onZoneCreated,
  zones: propsZones,
}) => {
  const { isAuthenticated, canCreateZones } = useAuth();
  const { zones: hookZones, loading: zonesLoading } = useZones();
  const zones = propsZones || hookZones;
  const [userPosition, setUserPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([46.2276, 2.2137]); // Centre de la France par défaut
  const [selectedZone, setSelectedZone] = useState(null);
  const mapRef = useRef();

  // Géolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = [position.coords.latitude, position.coords.longitude];
          setUserPosition(pos);
          setMapCenter(pos);
        },
        (error) => {
          console.log("Erreur de géolocalisation:", error);
          // Utiliser la position par défaut (centre de la France)
        }
      );
    }
  }, []);

  // Vérifier si une zone est active
  const isZoneActive = (zone) => {
    const now = new Date();
    const start = new Date(zone.start);
    const end = new Date(zone.end);
    return now >= start && now <= end;
  };

  // Formater la date/heure
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculer la couleur de la zone selon son statut
  const getZoneColor = (zone) => {
    if (!isZoneActive(zone)) {
      return "#6b7280"; // Gris pour les zones expirées
    }

    switch (zone.type?.toLowerCase()) {
      case "battue":
        return "#dc2626"; // Rouge pour les battues
      case "approche":
        return "#f59e0b"; // Orange pour l'approche
      case "affût":
        return "#7c3aed"; // Violet pour l'affût
      default:
        return "#dc2626"; // Rouge par défaut
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={10}
        className="w-full h-full rounded-lg"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marqueur de position utilisateur */}
        <LocationMarker position={userPosition} setPosition={setUserPosition} />

        {/* Zones de chasse */}
        {!zonesLoading &&
          zones.map((zone) => {
            const isActive = isZoneActive(zone);
            const color = getZoneColor(zone);

            if (zone.location?.type === "circle") {
              return (
                <Circle
                  key={zone.id}
                  center={[zone.location.lat, zone.location.lng]}
                  radius={zone.location.radius || 500}
                  color={color}
                  fillColor={color}
                  fillOpacity={isActive ? 0.3 : 0.1}
                  opacity={isActive ? 0.8 : 0.4}
                  eventHandlers={{
                    click: () => setSelectedZone(zone),
                  }}
                />
              );
            } else if (zone.location?.type === "polygon") {
              return (
                <Polygon
                  key={zone.id}
                  positions={zone.location.points}
                  color={color}
                  fillColor={color}
                  fillOpacity={isActive ? 0.3 : 0.1}
                  opacity={isActive ? 0.8 : 0.4}
                  eventHandlers={{
                    click: () => setSelectedZone(zone),
                  }}
                />
              );
            }

            // Point simple (marker) - fallback
            return (
              <Marker
                key={zone.id}
                position={[zone.location.lat, zone.location.lng]}
                icon={huntingIcon}
                eventHandlers={{
                  click: () => setSelectedZone(zone),
                }}
              />
            );
          })}

        {/* Popup d'information de zone */}
        {selectedZone && (
          <Popup
            position={[selectedZone.location.lat, selectedZone.location.lng]}
            onClose={() => setSelectedZone(null)}
          >
            <div className="p-2 min-w-[250px]">
              <div className="flex items-center mb-2">
                <AlertTriangle
                  className={`w-5 h-5 mr-2 ${
                    isZoneActive(selectedZone)
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                />
                <h3 className="font-semibold text-gray-900">
                  Zone de chasse{" "}
                  {isZoneActive(selectedZone) ? "ACTIVE" : "TERMINÉE"}
                </h3>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Type: {selectedZone.type || "Non spécifié"}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <div>
                    <div>Début: {formatDateTime(selectedZone.start)}</div>
                    <div>Fin: {formatDateTime(selectedZone.end)}</div>
                  </div>
                </div>

                {selectedZone.description && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    {selectedZone.description}
                  </div>
                )}
              </div>
            </div>
          </Popup>
        )}

        {/* Créateur de zone */}
        {showZoneCreator && isAuthenticated && canCreateZones && (
          <ZoneCreator
            onZoneCreated={onZoneCreated}
            onClose={() => window.history.replaceState(null, "", "/map")}
          />
        )}
      </MapContainer>

      {/* Légende repositionnée */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
        <h4 className="font-semibold text-gray-900 mb-3">Légende</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded-full mr-2 opacity-60"></div>
            <span>Battue (active)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-2 opacity-60"></div>
            <span>Approche (active)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-600 rounded-full mr-2 opacity-60"></div>
            <span>Affût (active)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-500 rounded-full mr-2 opacity-40"></div>
            <span>Zone terminée</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Cliquez sur une zone pour voir les détails
          </p>
        </div>
      </div>

      {/* Indicateur de chargement */}
      {zonesLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-[1000]">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="text-gray-700">Chargement des zones...</span>
          </div>
        </div>
      )}
    </div>
  );
};
