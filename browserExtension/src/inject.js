import { API } from './api.js';

const api = new API();
const script = document.createElement('script');
script.src = chrome.extension.getURL("main.js");
document.head.appendChild(script);

document.addEventListener('nillkizz_parser_message', (e) => {
  api.sendMessage(e.detail.msg);
});