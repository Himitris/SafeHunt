// src/services/admin.js
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

// Récupérer tous les chasseurs en attente de certification
export const getPendingHunters = async () => {
  try {
    const q = query(
      collection(db, "users"),
      where("role", "==", "chasseur"),
      where("certified", "==", false),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const hunters = [];

    querySnapshot.forEach((doc) => {
      hunters.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return { hunters, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération des chasseurs:", error);
    return { hunters: [], error: error.message };
  }
};

// Récupérer tous les chasseurs certifiés
export const getCertifiedHunters = async () => {
  try {
    const q = query(
      collection(db, "users"),
      where("role", "==", "chasseur"),
      where("certified", "==", true),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const hunters = [];

    querySnapshot.forEach((doc) => {
      hunters.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return { hunters, error: null };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des chasseurs certifiés:",
      error
    );
    return { hunters: [], error: error.message };
  }
};

// Certifier un chasseur
export const certifyHunter = async (hunterId) => {
  try {
    const userRef = doc(db, "users", hunterId);
    await updateDoc(userRef, {
      certified: true,
      certifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { error: null };
  } catch (error) {
    console.error("Erreur lors de la certification:", error);
    return { error: error.message };
  }
};

// Révoquer la certification d'un chasseur
export const revokeCertification = async (hunterId) => {
  try {
    const userRef = doc(db, "users", hunterId);
    await updateDoc(userRef, {
      certified: false,
      certificationRevokedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { error: null };
  } catch (error) {
    console.error("Erreur lors de la révocation:", error);
    return { error: error.message };
  }
};

// Récupérer les statistiques générales
export const getAdminStats = async () => {
  try {
    // Compter les utilisateurs par rôle
    const usersQuery = query(collection(db, "users"));
    const usersSnapshot = await getDocs(usersQuery);

    const stats = {
      totalUsers: 0,
      randonneurs: 0,
      chasseurs: 0,
      chasseursCertifies: 0,
      chasseursEnAttente: 0,
      admins: 0,
    };

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      stats.totalUsers++;

      switch (userData.role) {
        case "randonneur":
          stats.randonneurs++;
          break;
        case "chasseur":
          stats.chasseurs++;
          if (userData.certified) {
            stats.chasseursCertifies++;
          } else {
            stats.chasseursEnAttente++;
          }
          break;
        case "admin":
          stats.admins++;
          break;
      }
    });

    return { stats, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return { stats: null, error: error.message };
  }
};

// Récupérer les détails d'un utilisateur
export const getUserDetails = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return {
        user: { id: userDoc.id, ...userDoc.data() },
        error: null,
      };
    } else {
      return { user: null, error: "Utilisateur non trouvé" };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return { user: null, error: error.message };
  }
};
