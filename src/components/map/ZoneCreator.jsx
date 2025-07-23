// src/components/map/ZoneCreator.jsx
import { useState, useEffect, useRef } from "react";
import { useMapEvents, Circle, Polygon } from "react-leaflet";
import { createZone } from "../../services/zones";
import { useAuth } from "../../hooks/useAuth";
import { X, Check, RotateCcw, Hand, Edit3 } from "lucide-react";

export const ZoneCreator = ({ onZoneCreated, onClose }) => {
  const { user } = useAuth();
  const [creationMode, setCreationMode] = useState("click"); // 'click' ou 'draw'
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [previewZone, setPreviewZone] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [zoneData, setZoneData] = useState({
    type: "battue",
    start: "",
    end: "",
    description: "",
    radius: 500,
  });

  // Référence pour éviter la propagation des événements
  const formRef = useRef();

  // Gérer les clics sur la carte
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (showForm) return; // Ne pas traiter les clics si le formulaire est ouvert

        if (creationMode === "click") {
          // Mode clic simple - créer un cercle
          setPreviewZone({
            type: "circle",
            center: [e.latlng.lat, e.latlng.lng],
            radius: zoneData.radius,
          });
          setShowForm(true);
        } else if (creationMode === "draw" && isDrawing) {
          // Mode dessin - ajouter un point au polygone
          const newPoint = [e.latlng.lat, e.latlng.lng];
          setCurrentPath((prev) => [...prev, newPoint]);
        }
      },
      contextmenu: (e) => {
        // Clic droit pour terminer le dessin
        if (creationMode === "draw" && isDrawing && currentPath.length >= 3) {
          setPreviewZone({
            type: "polygon",
            points: currentPath,
          });
          setIsDrawing(false);
          setShowForm(true);
        }
      },
    });
    return null;
  };

  // Valeurs par défaut pour les dates
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getTime() + 30 * 60000);
    const end = new Date(now.getTime() + 4 * 60 * 60000);

    setZoneData((prev) => ({
      ...prev,
      start: start.toISOString().slice(0, 16),
      end: end.toISOString().slice(0, 16),
    }));
  }, []);

  // Empêcher la propagation des événements sur le formulaire
  useEffect(() => {
    const handleMapInteraction = (e) => {
      e.stopPropagation();
    };

    const formElement = formRef.current;
    if (formElement) {
      formElement.addEventListener("wheel", handleMapInteraction);
      formElement.addEventListener("mousedown", handleMapInteraction);
      formElement.addEventListener("touchstart", handleMapInteraction);

      return () => {
        formElement.removeEventListener("wheel", handleMapInteraction);
        formElement.removeEventListener("mousedown", handleMapInteraction);
        formElement.removeEventListener("touchstart", handleMapInteraction);
      };
    }
  }, [showForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "radius"
        ? Math.max(100, Math.min(4000, parseInt(value) || 500))
        : value;

    setZoneData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Mettre à jour la prévisualisation si c'est un cercle
    if (name === "radius" && previewZone?.type === "circle") {
      setPreviewZone((prev) => ({
        ...prev,
        radius: newValue,
      }));
    }
  };

  const startDrawing = () => {
    setCreationMode("draw");
    setIsDrawing(true);
    setCurrentPath([]);
    setPreviewZone(null);
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setCurrentPath([]);
    setPreviewZone(null);
    setCreationMode("click");
  };

  const handleCreateZone = async () => {
    if (!previewZone) {
      alert("Veuillez définir une zone");
      return;
    }

    if (!zoneData.start || !zoneData.end) {
      alert("Veuillez renseigner les heures de début et de fin");
      return;
    }

    const startDate = new Date(zoneData.start);
    const endDate = new Date(zoneData.end);
    const now = new Date();

    if (startDate <= now) {
      alert("La date de début doit être dans le futur");
      return;
    }

    if (endDate <= startDate) {
      alert("La date de fin doit être après la date de début");
      return;
    }

    try {
      const newZone = {
        type: zoneData.type,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        description: zoneData.description,
        location:
          previewZone.type === "circle"
            ? {
                type: "circle",
                lat: previewZone.center[0],
                lng: previewZone.center[1],
                radius: previewZone.radius,
              }
            : {
                type: "polygon",
                points: previewZone.points,
              },
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      };

      const { error } = await createZone(newZone);

      if (error) {
        alert("Erreur lors de la création de la zone: " + error);
      } else {
        handleCancel();
        if (onZoneCreated) onZoneCreated();
      }
    } catch (error) {
      alert("Erreur lors de la création de la zone");
    }
  };

  const handleCancel = () => {
    setIsDrawing(false);
    setCurrentPath([]);
    setPreviewZone(null);
    setShowForm(false);
    setCreationMode("click");
    if (onClose) onClose();
  };

  return (
    <>
      <MapClickHandler />

      {/* Prévisualisation de la zone */}
      {previewZone && (
        <>
          {previewZone.type === "circle" ? (
            <Circle
              center={previewZone.center}
              radius={previewZone.radius}
              color="#10b981"
              fillColor="#10b981"
              fillOpacity={0.2}
              opacity={0.8}
              weight={3}
            />
          ) : (
            <Polygon
              positions={previewZone.points}
              color="#10b981"
              fillColor="#10b981"
              fillOpacity={0.2}
              opacity={0.8}
              weight={3}
            />
          )}
        </>
      )}

      {/* Chemin en cours de dessin */}
      {isDrawing && currentPath.length > 0 && (
        <Polygon
          positions={currentPath}
          color="#10b981"
          fillColor="#10b981"
          fillOpacity={0.1}
          opacity={0.6}
          weight={2}
          dashArray="5, 5"
        />
      )}

      {/* Interface de création */}
      {!showForm && (
        <div className="absolute bottom-4 left-4 z-[1000] max-w-sm">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Créer une zone de chasse
            </h3>

            {!isDrawing ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setCreationMode("click");
                    // Passer directement à l'état où on attend un clic
                  }}
                  className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Hand className="w-5 h-5 mr-2" />
                  Zone circulaire
                </button>
                <button
                  onClick={startDrawing}
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Edit3 className="w-5 h-5 mr-2" />
                  Dessiner zone
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center px-4 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
                >
                  <X className="w-5 h-5 mr-2" />
                  Annuler
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  📍 Cliquez pour ajouter des points
                  <br />
                  🖱️ Clic droit pour terminer ({currentPath.length} points)
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelDrawing}
                    className="flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {creationMode === "click" && !isDrawing && !showForm && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                📍 Cliquez sur la carte pour positionner votre zone circulaire
              </p>
            )}
          </div>
        </div>
      )}

      {/* Formulaire de détails */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div
            ref={formRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Détails de la zone
              </h3>

              <div className="space-y-4">
                {/* Type de chasse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de chasse
                  </label>
                  <select
                    name="type"
                    value={zoneData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    <option value="battue">Battue</option>
                    <option value="approche">Approche</option>
                    <option value="affût">Affût</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                {/* Rayon (seulement pour les cercles) */}
                {previewZone?.type === "circle" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rayon de sécurité: {zoneData.radius}m
                    </label>
                    <input
                      type="range"
                      name="radius"
                      min="100"
                      max="4000"
                      step="50"
                      value={zoneData.radius}
                      onChange={handleInputChange}
                      className="w-full accent-green-600"
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>100m</span>
                      <span>4000m</span>
                    </div>
                  </div>
                )}

                {/* Heure de début */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure de début
                  </label>
                  <input
                    type="datetime-local"
                    name="start"
                    value={zoneData.start}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                {/* Heure de fin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure de fin
                  </label>
                  <input
                    type="datetime-local"
                    name="end"
                    value={zoneData.end}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    name="description"
                    value={zoneData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Informations complémentaires..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
                  />
                </div>
              </div>

              {/* Boutons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCreateZone}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Créer la zone
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
