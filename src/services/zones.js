// src/services/zones.js
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

// Créer une nouvelle zone
export const createZone = async (zoneData) => {
  try {
    const docRef = await addDoc(collection(db, "zones"), zoneData);
    return { zoneId: docRef.id, error: null };
  } catch (error) {
    console.error("Erreur lors de la création de la zone:", error);
    return { zoneId: null, error: error.message };
  }
};

// Mettre à jour une zone
export const updateZone = async (zoneId, updates) => {
  try {
    const zoneRef = doc(db, "zones", zoneId);
    await updateDoc(zoneRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la zone:", error);
    return { error: error.message };
  }
};

// Supprimer une zone
export const deleteZone = async (zoneId) => {
  try {
    await deleteDoc(doc(db, "zones", zoneId));
    return { error: null };
  } catch (error) {
    console.error("Erreur lors de la suppression de la zone:", error);
    return { error: error.message };
  }
};

// Récupérer une zone spécifique
export const getZone = async (zoneId) => {
  try {
    const zoneDoc = await getDoc(doc(db, "zones", zoneId));
    if (zoneDoc.exists()) {
      return {
        zone: { id: zoneDoc.id, ...zoneDoc.data() },
        error: null,
      };
    } else {
      return { zone: null, error: "Zone non trouvée" };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la zone:", error);
    return { zone: null, error: error.message };
  }
};

// Récupérer les zones d'un utilisateur
export const getUserZones = async (userId) => {
  try {
    const q = query(
      collection(db, "zones"),
      where("createdBy", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const zones = [];

    querySnapshot.forEach((doc) => {
      zones.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return { zones, error: null };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des zones utilisateur:",
      error
    );
    return { zones: [], error: error.message };
  }
};

// Récupérer toutes les zones actives
export const getActiveZones = async () => {
  try {
    const now = new Date();
    const q = query(
      collection(db, "zones"),
      where("end", ">", now.toISOString()),
      orderBy("start", "asc")
    );

    const querySnapshot = await getDocs(q);
    const zones = [];

    querySnapshot.forEach((doc) => {
      zones.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return { zones, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération des zones actives:", error);
    return { zones: [], error: error.message };
  }
};

// Vérifier si une zone est active
export const isZoneActive = (zone) => {
  const now = new Date();
  const start = new Date(zone.start);
  const end = new Date(zone.end);
  return now >= start && now <= end;
};

// Calculer le temps restant d'une zone
export const getZoneTimeRemaining = (zone) => {
  const now = new Date();
  const end = new Date(zone.end);

  if (end <= now) {
    return "Terminée";
  }

  const diff = end - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  } else {
    return `${minutes}min`;
  }
};
