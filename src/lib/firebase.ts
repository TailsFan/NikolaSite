
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-WMEfZ6QTIgMXn7gQ-_mPQnsfF2BakSc",
  authDomain: "nikolasitegit-69588244-5ed16.firebaseapp.com",
  projectId: "nikolasitegit-69588244-5ed16",
  storageBucket: "nikolasitegit-69588244-5ed16.appspot.com",
  messagingSenderId: "796306617569",
  appId: "1:796306617569:web:b4ea4405df7491177733a0"
};

// Проверяем, что ключ API был изменен со значения по умолчанию
export const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey !== 'YOUR_API_KEY';
}

let app;
let auth;
let db;

// Инициализируем Firebase только если конфигурация установлена
if (isFirebaseConfigured()) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db, app };
