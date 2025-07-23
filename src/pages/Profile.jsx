// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { updateProfile, updatePassword, deleteUser } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export const Profile = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    role: "randonneur",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user && userData) {
      setFormData({
        displayName: userData.displayName || user.displayName || "",
        email: user.email || "",
        role: userData.role || "randonneur",
      });
    }
  }, [user, userData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: "", text: "" });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: "", text: "" });
  };

  const updateUserProfile = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Mettre à jour le profil Firebase Auth
      await updateProfile(user, {
        displayName: formData.displayName,
      });

      // Mettre à jour les données dans Firestore
      await updateDoc(doc(db, "users", user.uid), {
        displayName: formData.displayName,
        role: formData.role,
        updatedAt: new Date().toISOString(),
      });

      setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
      setEditing(false);

      // Recharger la page après 2 secondes pour refléter les changements
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de la mise à jour du profil",
      });
    }

    setLoading(false);
  };

  const updateUserPassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Les nouveaux mots de passe ne correspondent pas",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Le nouveau mot de passe doit contenir au moins 6 caractères",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await updatePassword(user, passwordData.newPassword);
      setMessage({
        type: "success",
        text: "Mot de passe mis à jour avec succès !",
      });
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        setMessage({
          type: "error",
          text: "Veuillez vous reconnecter avant de changer votre mot de passe",
        });
      } else {
        setMessage({
          type: "error",
          text: "Erreur lors de la mise à jour du mot de passe",
        });
      }
    }

    setLoading(false);
  };

  const deleteUserAccount = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Supprimer le document utilisateur dans Firestore
      await updateDoc(doc(db, "users", user.uid), {
        deleted: true,
        deletedAt: new Date().toISOString(),
      });

      // Supprimer le compte Firebase Auth
      await deleteUser(user);

      navigate("/");
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        setMessage({
          type: "error",
          text: "Veuillez vous reconnecter avant de supprimer votre compte",
        });
      } else {
        setMessage({
          type: "error",
          text: "Erreur lors de la suppression du compte",
        });
      }
    }

    setLoading(false);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non défini";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Paramètres du profil
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos informations personnelles et préférences
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
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2">
            <Card title="Informations personnelles">
              <div className="space-y-6">
                {/* Nom d'affichage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'affichage
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {formData.displayName || "Non défini"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">{formData.email}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      (non modifiable)
                    </span>
                  </div>
                </div>

                {/* Rôle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de compte
                  </label>
                  {editing ? (
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="randonneur">Randonneur</option>
                      <option value="chasseur">Chasseur</option>
                    </select>
                  ) : (
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-900 capitalize">
                        {formData.role}
                      </span>
                      {userData?.role === "chasseur" && (
                        <span
                          className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            userData?.certified
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {userData?.certified
                            ? "Certifié"
                            : "En attente de certification"}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="flex space-x-4 pt-4">
                  {editing ? (
                    <>
                      <Button
                        onClick={updateUserProfile}
                        loading={loading}
                        className="flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditing(false);
                          setMessage({ type: "", text: "" });
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" onClick={() => setEditing(true)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Changement de mot de passe */}
            <Card title="Sécurité" className="mt-8">
              <div className="space-y-4">
                {!showPasswordForm ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    Changer le mot de passe
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Button onClick={updateUserPassword} loading={loading}>
                        Mettre à jour
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                          setMessage({ type: "", text: "" });
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar avec informations complémentaires */}
          <div className="space-y-6">
            {/* Informations du compte */}
            <Card title="Informations du compte">
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-gray-600 mb-1">
                    Membre depuis
                  </label>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{formatDate(userData?.createdAt)}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">
                    Dernière modification
                  </label>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{formatDate(userData?.updatedAt)}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">
                    ID utilisateur
                  </label>
                  <span className="font-mono text-xs text-gray-500 break-all">
                    {user?.uid}
                  </span>
                </div>
              </div>
            </Card>

            {/* Zone dangereuse */}
            <Card title="Zone dangereuse">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  La suppression de votre compte est définitive et irréversible.
                </p>
                {!showDeleteConfirm ? (
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer mon compte
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-red-600 font-medium">
                      Êtes-vous sûr de vouloir supprimer votre compte ?
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={deleteUserAccount}
                        loading={loading}
                      >
                        Confirmer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
