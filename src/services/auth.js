// src/services/auth.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Provider Google
const googleProvider = new GoogleAuthProvider();

// Connexion avec Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Vérifier si l'utilisateur existe déjà
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      // Créer le document utilisateur s'il n'existe pas
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName,
        role: "randonneur", // Par défaut
        certified: false,
        createdAt: new Date().toISOString(),
        photoURL: user.photoURL,
      });
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Connexion
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Inscription
export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Mettre à jour le profil
    await updateProfile(user, {
      displayName: userData.displayName,
    });

    // Créer le document utilisateur dans Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: userData.displayName,
      role: userData.role || "randonneur",
      certified: false,
      createdAt: new Date().toISOString(),
      ...userData,
    });

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Déconnexion
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Réinitialisation mot de passe
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Récupérer les données utilisateur depuis Firestore
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { userData: userDoc.data(), error: null };
    } else {
      return { userData: null, error: "Utilisateur non trouvé" };
    }
  } catch (error) {
    return { userData: null, error: error.message };
  }
};
