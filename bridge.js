const script = document.createElement('script');
script.src = chrome.runtime.getURL('injector.js');
(document.head || document.documentElement).appendChild(script);
script.onload = () => script.remove();
