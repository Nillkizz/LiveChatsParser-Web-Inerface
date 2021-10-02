import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, set } from "firebase/database";

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


export class API {
  constructor() {
    this.stopWords = []
    this.db = getDatabase();
    const dbStopWords = ref(this.db, "stopWords/");
    onValue(dbStopWords, snapshot => {
      if (snapshot.exists())
        this.stopWords = snapshot.val();
    });
  }
  sendMessage(msg) {
    if (msg.text.length === 0 || this.messageHasStopWord(msg)) return;
    const messagesListRef = ref(this.db, 'messages');
    const newMessageRef = push(messagesListRef);
    set(newMessageRef, msg)
  }
  messageHasStopWord(msg) {
    let has = false;
    this.stopWords.forEach(word => {
      if (typeof word !== "string" || word.length == 0) return
      has = has || msg.text.includes(word)
      if (has) return has;
    })
    return has;
  }
}