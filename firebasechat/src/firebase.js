import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue,
  //  query, limitToLast 
  } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCr7EOy-QYuNHUIjdAHlADM3ia7VgsXrxE",
  authDomain: "fir-ad107.firebaseapp.com",
  databaseURL: "https://fir-ad107-default-rtdb.firebaseio.com",
  projectId: "fir-ad107",
  storageBucket: "fir-ad107.appspot.com",
  messagingSenderId: "634142779348",
  appId: "1:634142779348:web:c67e5a546412e326a51841",
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
