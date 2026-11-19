
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";

const connectionRef = ref(database, ".info/connected");

onValue(connectionRef, (snapshot) => {
  if (snapshot.val() === true) {
    console.log("Firebase berhasil terhubung!");
  } else {
    console.log("Firebase belum terhubung.");
  }
});
