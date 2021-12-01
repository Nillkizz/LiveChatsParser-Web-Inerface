import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCVMhTtTJ9dtEIPLFeVQqRGCMhI_lIuofw",
  authDomain: "allcomments-shkolamm.firebaseapp.com",
  databaseURL: "https://allcomments-shkolamm-default-rtdb.firebaseio.com",
  projectId: "allcomments-shkolamm",
  storageBucket: "allcomments-shkolamm.appspot.com",
  messagingSenderId: "143721825135",
  appId: "1:143721825135:web:58fbd9427a94a9c4f41e9a",
  measurementId: "G-1QRTNDH3YT",
};

initializeApp(firebaseConfig);
const db = getDatabase();

export function subscribeToMessages(cb) {
  const dbMessages = ref(db, "messages/");
  onValue(dbMessages, (snapshot) => {
    cb(snapshot.val());
  });
}

export function updateMessages(messages) {
  const now = new Date(),
    startOfDay = now.setHours(0, 0, 0, 0),
    msgEntries = Object.entries(messages),
    countOfMessages = msgEntries.length;

  const filteredMsgEntries = msgEntries.filter((msg) => {
    const msgDatetime = new Date(msg[1].datetime);
    return msgDatetime > startOfDay;
  });
  const filteredMsgs = Object.fromEntries(filteredMsgEntries);

  if (filteredMsgEntries.length < countOfMessages) {
    const dbMessages = ref(db, "messages");
    set(dbMessages, filteredMsgs);
  }

  window.filtered = true;
  return filteredMsgs;
}
