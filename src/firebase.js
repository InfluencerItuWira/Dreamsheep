import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVoVpEZzXs5ehbIOcbqQWiBjDy6X1QWLE",
  authDomain: "iot-project-9224b.firebaseapp.com",
  databaseURL: "https://iot-project-9224b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-project-9224b",
  storageBucket: "iot-project-9224b.firebasestorage.app",
  messagingSenderId: "837503525768",
  appId: "1:837503525768:web:4765e3321526ef01e5503d",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;