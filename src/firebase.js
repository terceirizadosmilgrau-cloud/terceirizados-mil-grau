import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByTukpeNPT8YryYhL0kn2n7h163hPLdZo",
  authDomain: "terceirizados-mil-grau.firebaseapp.com",
  projectId: "terceirizados-mil-grau",
  storageBucket: "terceirizados-mil-grau.firebasestorage.app",
  messagingSenderId: "172823594852",
  appId: "1:172823594852:web:19e3bc1731855bea0c9c71",
  measurementId: "G-MY967EBKLZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;