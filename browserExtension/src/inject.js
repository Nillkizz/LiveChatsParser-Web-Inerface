var script = document.createElement('script');

script.src = chrome.extension.getURL("main.js");

document.head.appendChild(script);
