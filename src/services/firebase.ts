import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

// Configure sua própria chave do Firebase aqui
// Vá em https://console.firebase.google.com para criar um projeto gratuito
const firebaseConfig = {
  apiKey: "AIzaSyB1hqCUBakFohgeulnrdoeZ0YA1H3-8lrY",
  authDomain: "editais-br.firebaseapp.com",
  projectId: "editais-br",
  storageBucket: "editais-br.firebasestorage.app",
  messagingSenderId: "853391148896",
  appId: "1:853391148896:web:1c0a46f0022f9b31824005",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth functions
export const createUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Firestore functions
export const saveUserProfile = async (userId: string, profileData: any) => {
  try {
    await setDoc(
      doc(db, "users", userId),
      {
        ...profileData,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const createEdital = async (editalData: any) => {
  try {
    const docRef = await addDoc(collection(db, "editais"), {
      ...editalData,
      createdAt: Timestamp.now(),
      views: 0,
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getEditais = async () => {
  try {
    const q = query(
      collection(db, "editais"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    const editais: any[] = [];
    querySnapshot.forEach((doc) => {
      editais.push({ id: doc.id, ...doc.data() });
    });
    return editais;
  } catch (error) {
    throw error;
  }
};

export const getUserEditais = async (userId: string) => {
  try {
    const q = query(
      collection(db, "editais"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const editais: any[] = [];
    querySnapshot.forEach((doc) => {
      editais.push({ id: doc.id, ...doc.data() });
    });
    return editais;
  } catch (error) {
    throw error;
  }
};

export const updateEditalViews = async (editalId: string) => {
  try {
    const editalRef = doc(db, "editais", editalId);
    const editalDoc = await getDoc(editalRef);

    if (editalDoc.exists()) {
      const currentViews = editalDoc.data().views || 0;
      await updateDoc(editalRef, {
        views: currentViews + 1,
      });
    }
  } catch (error) {
    console.error("Error updating views:", error);
  }
};

export const saveFavorite = async (userId: string, editalId: string) => {
  try {
    await setDoc(doc(db, "favorites", `${userId}_${editalId}`), {
      userId,
      editalId,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    throw error;
  }
};

export const removeFavorite = async (userId: string, editalId: string) => {
  try {
    await deleteDoc(doc(db, "favorites", `${userId}_${editalId}`));
  } catch (error) {
    throw error;
  }
};

export const getUserFavorites = async (userId: string) => {
  try {
    const q = query(collection(db, "favorites"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const favorites: string[] = [];
    querySnapshot.forEach((doc) => {
      favorites.push(doc.data().editalId);
    });
    return favorites;
  } catch (error) {
    throw error;
  }
};

// User metrics
export const getUserMetrics = async (userId: string) => {
  try {
    // Get user's editais
    const userEditais = await getUserEditais(userId);

    // Get user's favorites
    const userFavorites = await getUserFavorites(userId);

    // Calculate total views
    const totalViews = userEditais.reduce(
      (sum, edital) => sum + (edital.views || 0),
      0
    );

    // Get engagement data (mock for now, would be real data in production)
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString("pt-BR", { weekday: "short" }),
        views: Math.floor(Math.random() * 100) + 20,
        favorites: Math.floor(Math.random() * 10) + 2,
      };
    }).reverse();

    return {
      totalEditais: userEditais.length,
      totalFavorites: userFavorites.length,
      totalViews,
      averageViews:
        userEditais.length > 0
          ? Math.round(totalViews / userEditais.length)
          : 0,
      engagementRate:
        userEditais.length > 0
          ? ((userFavorites.length / userEditais.length) * 100).toFixed(1)
          : "0",
      last7Days,
    };
  } catch (error) {
    console.error("Error getting metrics:", error);
    return {
      totalEditais: 0,
      totalFavorites: 0,
      totalViews: 0,
      averageViews: 0,
      engagementRate: "0",
      last7Days: [],
    };
  }
};

export { onAuthStateChanged, type User };
