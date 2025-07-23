// src/pages/AdminPanel.jsx
import { useState, useEffect } from "react";
import {
  Users,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  UserX,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  getPendingHunters,
  getCertifiedHunters,
  certifyHunter,
  revokeCertification,
  getAdminStats,
} from "../services/admin";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export const AdminPanel = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [stats, setStats] = useState(null);
  const [pendingHunters, setPendingHunters] = useState([]);
  const [certifiedHunters, setCertifiedHunters] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const [statsResult, pendingResult, certifiedResult] = await Promise.all([
        getAdminStats(),
        getPendingHunters(),
        getCertifiedHunters(),
      ]);

      if (!statsResult.error) setStats(statsResult.stats);
      if (!pendingResult.error) setPendingHunters(pendingResult.hunters);
      if (!certifiedResult.error) setCertifiedHunters(certifiedResult.hunters);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors du chargement des données",
      });
    }

    setLoading(false);
  };

  const handleCertify = async (hunterId) => {
    const { error } = await certifyHunter(hunterId);

    if (error) {
      setMessage({ type: "error", text: "Erreur lors de la certification" });
    } else {
      setMessage({ type: "success", text: "Chasseur certifié avec succès !" });
      loadData(); // Recharger les données
    }

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleRevoke = async (hunterId) => {
    const { error } = await revokeCertification(hunterId);

    if (error) {
      setMessage({ type: "error", text: "Erreur lors de la révocation" });
    } else {
      setMessage({
        type: "success",
        text: "Certification révoquée avec succès !",
      });
      loadData(); // Recharger les données
    }

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non défini";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const tabs = [
    { id: "stats", label: "Statistiques", icon: TrendingUp },
    {
      id: "pending",
      label: "En attente",
      icon: Clock,
      badge: pendingHunters.length,
    },
    {
      id: "certified",
      label: "Certifiés",
      icon: CheckCircle,
      badge: certifiedHunters.length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Panel d'administration
              </h1>
              <p className="text-gray-600">
                Bonjour {userData?.displayName}, gérez les utilisateurs et les
                certifications SafeHunt
              </p>
            </div>
          </div>
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

        {/* Navigation tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs font-medium">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : (
          <>
            {/* Statistiques */}
            {activeTab === "stats" && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </h3>
                  <p className="text-gray-600">Utilisateurs totaux</p>
                </Card>

                <Card className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <UserCheck className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.chasseursCertifies}
                  </h3>
                  <p className="text-gray-600">Chasseurs certifiés</p>
                </Card>

                <Card className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.chasseursEnAttente}
                  </h3>
                  <p className="text-gray-600">En attente de certification</p>
                </Card>

                <Card className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.randonneurs}
                  </h3>
                  <p className="text-gray-600">Randonneurs</p>
                </Card>
              </div>
            )}

            {/* Chasseurs en attente */}
            {activeTab === "pending" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Chasseurs en attente de certification ({pendingHunters.length}
                  )
                </h2>

                {pendingHunters.length === 0 ? (
                  <Card>
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucune demande en attente
                      </h3>
                      <p className="text-gray-600">
                        Toutes les demandes de certification ont été traitées.
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {pendingHunters.map((hunter) => (
                      <Card key={hunter.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                              <Shield className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {hunter.displayName}
                              </h3>
                              <p className="text-gray-600">{hunter.email}</p>
                              <p className="text-sm text-gray-500">
                                Demande créée le {formatDate(hunter.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <Button
                              size="sm"
                              onClick={() => handleCertify(hunter.id)}
                              className="flex items-center"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Certifier
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                // TODO: Implémenter le rejet avec raison
                                console.log("Rejeter:", hunter.id);
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Chasseurs certifiés */}
            {activeTab === "certified" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Chasseurs certifiés ({certifiedHunters.length})
                </h2>

                {certifiedHunters.length === 0 ? (
                  <Card>
                    <div className="text-center py-8">
                      <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucun chasseur certifié
                      </h3>
                      <p className="text-gray-600">
                        Aucun chasseur n'a encore été certifié.
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {certifiedHunters.map((hunter) => (
                      <Card key={hunter.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {hunter.displayName}
                              </h3>
                              <p className="text-gray-600">{hunter.email}</p>
                              <p className="text-sm text-gray-500">
                                Certifié le {formatDate(hunter.certifiedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRevoke(hunter.id)}
                              className="flex items-center"
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              Révoquer
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
