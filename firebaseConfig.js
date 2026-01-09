    // firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBCt7W37zxesQ389q5aNxL-YJsMjbRblug",
  authDomain: "speak-up-c0d17.firebaseapp.com",
  projectId: "speak-up-c0d17",
  storageBucket: "speak-up-c0d17.firebasestorage.app",
  messagingSenderId: "99099001490",
  appId: "1:99099001490:web:3fc71c7556b1ba77131c4b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };