import { initializeApp } from "firebase/app";
import {
  getDatabase, ref, onValue,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCVMhTtTJ9dtEIPLFeVQqRGCMhI_lIuofw",
  authDomain: "allcomments-shkolamm.firebaseapp.com",
  databaseURL: "https://allcomments-shkolamm-default-rtdb.firebaseio.com",
  projectId: "allcomments-shkolamm",
  storageBucket: "allcomments-shkolamm.appspot.com",
  messagingSenderId: "143721825135",
  appId: "1:143721825135:web:58fbd9427a94a9c4f41e9a",
  measurementId: "G-1QRTNDH3YT"
};

initializeApp(firebaseConfig);

export function subscribeToMessages(cb) {
  const db = getDatabase();

  // const dbMessages = query(ref(db, "messages/"), limitToLast(100));
  const dbMessages = ref(db, "messages/");
  onValue(dbMessages, (snapshot) => {
    cb(snapshot.val());
  });
}