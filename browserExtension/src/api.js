import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCr7EOy-QYuNHUIjdAHlADM3ia7VgsXrxE",
  authDomain: "fir-ad107.firebaseapp.com",
  databaseURL: "https://fir-ad107-default-rtdb.firebaseio.com",
  projectId: "fir-ad107",
  storageBucket: "fir-ad107.appspot.com",
  messagingSenderId: "634142779348",
  appId: "1:634142779348:web:c67e5a546412e326a51841"
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
    console.log(msg.text.length, this.stopWords, this.messageHasStopWord(msg), msg);
    if (msg.text.length === 0 || this.messageHasStopWord(msg)) return;
    const messagesListRef = ref(this.db, 'messages');
    const newMessageRef = push(messagesListRef);
    set(newMessageRef, msg)
  }
  messageHasStopWord(msg){
    let has = false;
    this.stopWords.forEach(word=>{
      has = has || msg.text.includes(word)
      if (has) return has;
    })
    return has;
  }
}