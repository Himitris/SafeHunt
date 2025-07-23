// src/hooks/useZones.js
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebase";

export const useZones = (userId = null) => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q;

    if (userId) {
      // Récupérer seulement les zones de l'utilisateur
      q = query(
        collection(db, "zones"),
        where("createdBy", "==", userId),
        orderBy("createdAt", "desc")
      );
    } else {
      // Récupérer toutes les zones actives
      const now = new Date();
      q = query(
        collection(db, "zones"),
        where("end", ">", now.toISOString()),
        orderBy("end", "asc")
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const zonesData = [];
        querySnapshot.forEach((doc) => {
          zonesData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setZones(zonesData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Erreur lors de la récupération des zones:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { zones, loading, error };
};
