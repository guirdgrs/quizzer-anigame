import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyClbMcHYCdZEaHsUSchWPl5gAfnL6fJF-8",
  authDomain: "quizzer-anigames.firebaseapp.com",
  projectId: "quizzer-anigames",
  storageBucket: "quizzer-anigames.firebasestorage.app",
  messagingSenderId: "177053478825",
  appId: "1:177053478825:web:15a085a26fc5f183a01eb8"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);